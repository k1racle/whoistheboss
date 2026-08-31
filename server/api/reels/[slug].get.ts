import prisma from '~~/lib/prisma'
import { getSafeUploadedMediaUrl, getTrustedEmbedUrl } from '@shared/lib/media-url'
import { entrepreneurCityFilter, getRequestedCitySlug } from '@server/utils/presence-city'
import { sanitizeRichText } from '@server/utils/content-security'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const citySlug = getRequestedCitySlug(event)
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug' })
  }

  const reel = await prisma.reel.findFirst({
    where: { slug, isPublished: true, ...(citySlug ? { entrepreneur: entrepreneurCityFilter(citySlug) } : {}) },
    include: {
      entrepreneur: {
        select: {
          slug: true,
          name: true,
          title: true,
          photo: true,
        },
      },
    },
  })

  if (!reel) {
    throw createError({ statusCode: 404, statusMessage: 'Reel not found' })
  }

  return {
    id: reel.id,
    slug: reel.slug,
    title: reel.title,
    description: reel.description ? sanitizeRichText(reel.description) : null,
    coverImage: reel.coverImage,
    metaTitle: reel.metaTitle,
    metaDesc: reel.metaDesc,
    socialImage: reel.socialImage,
    createdAt: reel.createdAt.toISOString(),
    updatedAt: reel.updatedAt.toISOString(),
    videoType: reel.videoType,
    videoUrl: reel.videoType === 'EMBED' ? getTrustedEmbedUrl(reel.videoUrl) : null,
    videoFile: reel.videoType === 'SELF_HOSTED' ? getSafeUploadedMediaUrl(reel.videoFile) : null,
    entrepreneur: reel.entrepreneur,
  }
})
