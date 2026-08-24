import type { H3Event } from 'h3'
import { createError, getRequestHeader, readBody } from 'h3'

const rawBodySymbol = Symbol.for('h3RawBody')

type RequestWithCachedBody = H3Event['node']['req'] & {
  rawBody?: unknown
  body?: unknown
  [key: symbol]: unknown
}

function requestBodyTooLarge(): ReturnType<typeof createError> {
  return createError({ statusCode: 413, statusMessage: 'Request body too large' })
}

function assertMaxBytes(maxBytes: number): void {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) {
    throw new TypeError('maxBytes must be a non-negative safe integer')
  }
}

function toBuffer(value: unknown): Buffer | undefined {
  if (value === undefined || value === null) return undefined
  if (Buffer.isBuffer(value)) return value
  if (typeof value === 'string') return Buffer.from(value)
  if (value instanceof ArrayBuffer) return Buffer.from(value)
  if (ArrayBuffer.isView(value)) {
    return Buffer.from(value.buffer, value.byteOffset, value.byteLength)
  }
  if (value instanceof URLSearchParams) return Buffer.from(value.toString())
  if (typeof value === 'object' && value.constructor === Object) {
    return Buffer.from(JSON.stringify(value))
  }
  return undefined
}

function isWebBodyStream(value: unknown): value is ReadableStream<Uint8Array> {
  return typeof value === 'object'
    && value !== null
    && 'getReader' in value
    && typeof value.getReader === 'function'
}

async function readWebBody(
  stream: ReadableStream<Uint8Array>,
  maxBytes: number,
): Promise<Buffer> {
  const reader = stream.getReader()
  const chunks: Buffer[] = []
  let totalBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) return Buffer.concat(chunks, totalBytes)

      const buffer = Buffer.from(value.buffer, value.byteOffset, value.byteLength)
      totalBytes += buffer.byteLength
      if (totalBytes > maxBytes) {
        await reader.cancel(requestBodyTooLarge()).catch(() => {})
        throw requestBodyTooLarge()
      }
      chunks.push(buffer)
    }
  }
  finally {
    reader.releaseLock()
  }
}

async function readCachedBody(value: unknown, maxBytes: number): Promise<Buffer | undefined> {
  const resolved = await value
  const directBuffer = toBuffer(resolved)
  if (directBuffer) {
    if (directBuffer.byteLength > maxBytes) throw requestBodyTooLarge()
    return directBuffer
  }

  if (isWebBodyStream(resolved)) return await readWebBody(resolved, maxBytes)
  if (resolved instanceof Blob) return await readWebBody(resolved.stream(), maxBytes)
  if (resolved instanceof FormData) {
    const stream = new Response(resolved).body
    return stream ? await readWebBody(stream, maxBytes) : undefined
  }

  throw createError({ statusCode: 400, statusMessage: 'Unsupported request body' })
}

function readNodeBody(event: H3Event, maxBytes: number): Promise<Buffer | undefined> {
  const request = event.node.req
  const contentLength = Number.parseInt(request.headers['content-length'] || '', 10)
  const isChunked = /\bchunked\b/i.test(String(request.headers['transfer-encoding'] ?? ''))

  if (!contentLength && !isChunked) return Promise.resolve(undefined)

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let totalBytes = 0
    let settled = false

    const cleanup = () => {
      request.off('data', onData)
      request.off('end', onEnd)
      request.off('error', onError)
      request.off('aborted', onAborted)
    }
    const fail = (error: unknown) => {
      if (settled) return
      settled = true
      cleanup()
      reject(error)
    }
    const onData = (chunk: Buffer | string) => {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
      totalBytes += buffer.byteLength

      if (totalBytes > maxBytes) {
        fail(requestBodyTooLarge())
        request.once('error', () => {})
        request.resume()
        return
      }

      chunks.push(buffer)
    }
    const onEnd = () => {
      if (settled) return
      settled = true
      cleanup()
      resolve(Buffer.concat(chunks, totalBytes))
    }
    const onError = (error: Error) => fail(error)
    const onAborted = () => fail(createError({ statusCode: 400, statusMessage: 'Request aborted' }))

    request.on('data', onData)
    request.once('end', onEnd)
    request.once('error', onError)
    request.once('aborted', onAborted)
  })
}

export function assertContentLength(event: H3Event, maxBytes: number): void {
  assertMaxBytes(maxBytes)
  const rawLength = getRequestHeader(event, 'content-length')
  if (!rawLength) return
  const length = Number.parseInt(rawLength, 10)
  if (Number.isFinite(length) && length > maxBytes) {
    throw requestBodyTooLarge()
  }
}

export async function readLimitedRawBody(
  event: H3Event,
  maxBytes = 64 * 1024,
): Promise<Buffer | undefined> {
  assertContentLength(event, maxBytes)

  const request = event.node.req as RequestWithCachedBody
  const cachedBody = event._requestBody ?? request[rawBodySymbol] ?? request.rawBody ?? request.body
  if (cachedBody !== undefined && cachedBody !== null) {
    const buffer = await readCachedBody(cachedBody, maxBytes)
    if (buffer) event._requestBody = buffer as unknown as BodyInit
    return buffer
  }

  const bodyPromise = readNodeBody(event, maxBytes)
  request[rawBodySymbol] = bodyPromise
  const buffer = await bodyPromise
  if (buffer) event._requestBody = buffer as unknown as BodyInit
  return buffer
}

export async function readLimitedBody<T>(event: H3Event, maxBytes = 64 * 1024): Promise<T> {
  await readLimitedRawBody(event, maxBytes)
  return await readBody<T>(event)
}

export function assertSameOriginMutation(event: H3Event): void {
  if (['GET', 'HEAD', 'OPTIONS'].includes(event.method.toUpperCase())) return
  const origin = getRequestHeader(event, 'origin')
  const fetchSite = getRequestHeader(event, 'sec-fetch-site')

  if (fetchSite && !['same-origin', 'same-site', 'none'].includes(fetchSite)) {
    throw createError({ statusCode: 403, statusMessage: 'Cross-site request rejected' })
  }
  if (!origin) return

  const host = getRequestHeader(event, 'host')?.toLowerCase()
  const originHost = (() => {
    try {
      return new URL(origin).host.toLowerCase()
    }
    catch {
      throw createError({ statusCode: 403, statusMessage: 'Origin rejected' })
    }
  })()
  if (!host || originHost !== host) {
    throw createError({ statusCode: 403, statusMessage: 'Origin rejected' })
  }
}
