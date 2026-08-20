import { resolveImageVariant, streamImageVariant } from '@server/utils/image-variant'
import { clampImageQuality, clampImageWidth } from '~~/app/shared/image/image-variants'
import { enforceRateLimit } from '@server/utils/rate-limit'

function queryInteger(value: unknown): number | undefined {
  if (typeof value !== 'string' || !/^\d{1,4}$/.test(value)) return undefined
  return Number.parseInt(value, 10)
}

export default defineEventHandler(async (event) => {
  const rawFilename = getRouterParam(event, 'filename') ?? ''
  let filename: string
  try {
    filename = decodeURIComponent(rawFilename)
  }
  catch {
    throw createError({ statusCode: 404, statusMessage: 'Image not found' })
  }

  const query = getQuery(event)
  enforceRateLimit(event, { id: 'media-image', limit: 180, windowMs: 60 * 1000 })
  const result = await resolveImageVariant({
    filename,
    width: clampImageWidth(queryInteger(query.w)),
    quality: clampImageQuality(queryInteger(query.q)),
  })

  setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
  setHeader(event, 'content-type', 'image/webp')
  setHeader(event, 'content-length', result.size)
  setHeader(event, 'x-image-cache', result.cacheHit ? 'HIT' : 'MISS')

  if (event.method === 'HEAD') return null
  return sendStream(event, streamImageVariant(result.path))
})
