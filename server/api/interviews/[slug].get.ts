import prisma from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug' })
  }

  const interview = await prisma.interview.findFirst({
    where: { slug, isPublished: true },
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

  if (!interview) {
    throw createError({ statusCode: 404, statusMessage: 'Interview not found' })
  }

  const related = await prisma.interview.findMany({
    where: {
      isPublished: true,
      id: { not: interview.id },
    },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: 3,
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

  return {
    interview: {
      id: interview.id,
      slug: interview.slug,
      title: interview.title,
      subtitle: interview.subtitle,
      quote: interview.quote,
      coverImage: interview.coverImage,
      publishedAt: interview.publishedAt?.toISOString() ?? null,
      updatedAt: interview.updatedAt.toISOString(),
      entrepreneur: interview.entrepreneur,
      summary: interview.summary,
      content: interview.content,
      videoType: interview.videoType,
      videoUrl: interview.videoUrl,
      videoFile: interview.videoFile,
      metaTitle: interview.metaTitle,
      metaDesc: interview.metaDesc,
    },
    related: related.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle,
      quote: item.quote,
      coverImage: item.coverImage,
      publishedAt: item.publishedAt?.toISOString() ?? null,
      entrepreneur: item.entrepreneur,
    })),
  }
})
