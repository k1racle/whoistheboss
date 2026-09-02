import prisma from '~~/lib/prisma'
import { getSafeUploadedMediaUrl, getTrustedEmbedUrl } from '@shared/lib/media-url'

export default defineEventHandler(async () => {
  const interviews = await prisma.interview.findMany({
    where: { isPublished: true },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      slug: true,
      title: true,
      subtitle: true,
      coverImage: true,
      publishedAt: true,
      videoType: true,
      videoUrl: true,
      videoFile: true,
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

  return interviews.flatMap((interview) => {
    const videoUrl = interview.videoType === 'EMBED'
      ? getTrustedEmbedUrl(interview.videoUrl)
      : ''
    const videoFile = interview.videoType === 'SELF_HOSTED'
      ? getSafeUploadedMediaUrl(interview.videoFile)
      : ''

    if (!videoUrl && !videoFile) return []

    return [{
      id: interview.id,
      slug: interview.slug,
      title: interview.title,
      subtitle: interview.subtitle,
      coverImage: interview.coverImage,
      publishedAt: interview.publishedAt?.toISOString() ?? null,
      videoType: interview.videoType,
      videoUrl: videoUrl || null,
      videoFile: videoFile || null,
      entrepreneur: interview.entrepreneur,
    }]
  })
})
