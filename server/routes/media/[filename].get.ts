import { resolveImageVariant, streamImageVariant } from '@server/utils/image-variant'
import { clampImageQuality, clampImageWidth } from '~~/app/shared/image/image-variants'

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
  let result: Awaited<ReturnType<typeof resolveImageVariant>>
  try {
    result = await resolveImageVariant({
      filename,
      width: clampImageWidth(queryInteger(query.w)),
      quality: clampImageQuality(queryInteger(query.q)),
    })
  }
  catch {
    // Never replace valid content with a broken image when the optimization
    // cache is temporarily unavailable (permissions, disk space, Sharp, etc.).
    setHeader(event, 'cache-control', 'no-store')
    return sendRedirect(event, `/uploads/${encodeURIComponent(filename)}`, 307)
  }

  setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
  setHeader(event, 'content-type', 'image/webp')
  setHeader(event, 'content-length', result.size)
  setHeader(event, 'x-image-cache', result.cacheHit ? 'HIT' : 'MISS')

  if (event.method === 'HEAD') return null
  return sendStream(event, streamImageVariant(result.path))
})
