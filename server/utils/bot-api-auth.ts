import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
import { getRequestHeader, getRequestURL } from 'h3'
import { readLimitedRawBody } from './request-security'

const MAX_CLOCK_SKEW_SECONDS = 300

export function buildBotCanonicalRequest(
  timestamp: string,
  method: string,
  pathWithQuery: string,
  contentHash: string,
): string {
  return [timestamp, method.toUpperCase(), pathWithQuery, contentHash].join('\n')
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function authenticateBotApi(event: H3Event): Promise<Buffer> {
  const config = useRuntimeConfig()
  const keyId = String(config.botApiKeyId || '')
  const secret = String(config.botApiSecret || '')
  if (!keyId || secret.length < 32) {
    throw createError({ statusCode: 503, statusMessage: 'Bot integration is not configured' })
  }

  const suppliedKey = getRequestHeader(event, 'x-bot-key-id') || ''
  const suppliedTimestamp = getRequestHeader(event, 'x-bot-timestamp') || ''
  const suppliedHash = (getRequestHeader(event, 'x-bot-content-sha256') || '').toLowerCase()
  const suppliedSignature = (getRequestHeader(event, 'x-bot-signature') || '').toLowerCase()
  const timestamp = Number.parseInt(suppliedTimestamp, 10)

  if (!safeEqual(suppliedKey, keyId) || !Number.isFinite(timestamp)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid bot credentials' })
  }
  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > MAX_CLOCK_SKEW_SECONDS) {
    throw createError({ statusCode: 401, statusMessage: 'Expired bot request' })
  }

  const rawBody = ['GET', 'HEAD'].includes(event.method.toUpperCase())
    ? Buffer.alloc(0)
    : (await readLimitedRawBody(event, 64 * 1024) ?? Buffer.alloc(0))
  const actualHash = createHash('sha256').update(rawBody).digest('hex')
  if (!safeEqual(suppliedHash, actualHash)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid bot content hash' })
  }

  const url = getRequestURL(event)
  const canonical = buildBotCanonicalRequest(
    suppliedTimestamp,
    event.method,
    `${url.pathname}${url.search}`,
    actualHash,
  )
  const expected = createHmac('sha256', secret).update(canonical).digest('hex')
  if (!safeEqual(suppliedSignature, expected)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid bot signature' })
  }
  return rawBody
}

export function parseBotJsonBody<T>(rawBody: Buffer): T {
  if (rawBody.byteLength === 0) return {} as T
  try {
    return JSON.parse(rawBody.toString('utf8')) as T
  }
  catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid JSON body' })
  }
}
