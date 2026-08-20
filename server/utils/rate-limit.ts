import type { H3Event } from 'h3'

interface RateLimitBucket {
  count: number
  resetAt: number
}

interface RateLimitOptions {
  id: string
  limit: number
  windowMs: number
  key?: string
}

const buckets = new Map<string, RateLimitBucket>()
let lastCleanupAt = 0

function requestIp(event: H3Event): string {
  const forwarded = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || event.node.req.socket.remoteAddress || 'unknown'
}

function cleanupExpiredBuckets(now: number) {
  if (now - lastCleanupAt < 60_000) return
  lastCleanupAt = now
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export function enforceRateLimit(event: H3Event, options: RateLimitOptions): void {
  const now = Date.now()
  cleanupExpiredBuckets(now)
  const bucketKey = `${options.id}:${requestIp(event)}:${options.key || ''}`
  const current = buckets.get(bucketKey)
  const bucket = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + options.windowMs }
    : current

  bucket.count += 1
  buckets.set(bucketKey, bucket)
  const remaining = Math.max(options.limit - bucket.count, 0)
  setHeader(event, 'x-ratelimit-limit', String(options.limit))
  setHeader(event, 'x-ratelimit-remaining', String(remaining))
  setHeader(event, 'x-ratelimit-reset', String(Math.ceil(bucket.resetAt / 1000)))

  if (bucket.count > options.limit) {
    const retryAfter = Math.max(Math.ceil((bucket.resetAt - now) / 1000), 1)
    setHeader(event, 'retry-after', retryAfter)
    throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  }
}

export function clearRateLimitBucketsForTests() {
  buckets.clear()
  lastCleanupAt = 0
}
