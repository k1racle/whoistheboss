import prisma from '~~/lib/prisma'
import { readPagination } from '@server/utils/pagination'

export default defineEventHandler(async (event) => {
  const { limit, offset } = readPagination(event, { defaultLimit: 48, maxLimit: 120 })
  const interviews = await prisma.interview.findMany({
    where: { isPublished: true },
    skip: offset,
    take: limit,
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    include: {
      entrepreneur: {
        select: {
          slug: true,
          name: true,
          title: true,
          photo: true,
          quote: true,
        },
      },
    },
  })

  return interviews.map((interview) => ({
    id: interview.id,
    slug: interview.slug,
    title: interview.title,
    subtitle: interview.subtitle,
    quote: interview.quote,
    coverImage: interview.coverImage,
    publishedAt: interview.publishedAt?.toISOString() ?? null,
    entrepreneur: interview.entrepreneur,
  }))
})
