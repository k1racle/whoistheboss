import prisma from '~~/lib/prisma'
import { readPagination } from '@server/utils/pagination'
import { entrepreneurCityFilter, getRequestedCitySlug } from '@server/utils/presence-city'

export default defineEventHandler(async (event) => {
  const { limit, offset } = readPagination(event, { defaultLimit: 48, maxLimit: 120 })
  const citySlug = getRequestedCitySlug(event)
  const reels = await prisma.reel.findMany({
    where: { isPublished: true, ...(citySlug ? { entrepreneur: entrepreneurCityFilter(citySlug) } : {}) },
    skip: offset,
    take: limit,
    orderBy: [{ createdAt: 'desc' }],
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

  return reels.map((reel) => ({
    id: reel.id,
    slug: reel.slug,
    title: reel.title,
    description: reel.description,
    coverImage: reel.coverImage,
    videoType: reel.videoType,
    videoUrl: reel.videoUrl,
    videoFile: reel.videoFile,
    entrepreneur: reel.entrepreneur,
  }))
})
