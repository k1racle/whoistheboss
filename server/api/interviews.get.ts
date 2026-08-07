import prisma from '~~/lib/prisma'

export default defineEventHandler(async () => {
  const interviews = await prisma.interview.findMany({
    where: { isPublished: true },
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
