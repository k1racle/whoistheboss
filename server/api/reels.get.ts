import prisma from '~~/lib/prisma'

export default defineEventHandler(async () => {
  const reels = await prisma.reel.findMany({
    where: { isPublished: true },
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
