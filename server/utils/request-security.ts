import type { H3Event } from 'h3'

export function assertContentLength(event: H3Event, maxBytes: number): void {
  const rawLength = getRequestHeader(event, 'content-length')
  if (!rawLength) return
  const length = Number.parseInt(rawLength, 10)
  if (Number.isFinite(length) && length > maxBytes) {
    throw createError({ statusCode: 413, statusMessage: 'Request body too large' })
  }
}

export async function readLimitedBody<T>(event: H3Event, maxBytes = 64 * 1024): Promise<T> {
  assertContentLength(event, maxBytes)
  const body = await readBody<T>(event)
  const serializedSize = Buffer.byteLength(JSON.stringify(body ?? null))
  if (serializedSize > maxBytes) {
    throw createError({ statusCode: 413, statusMessage: 'Request body too large' })
  }
  return body
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
