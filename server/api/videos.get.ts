import { getSafeUploadedMediaUrl, getTrustedEmbedUrl } from '@shared/lib/media-url'
import prisma from '~~/lib/prisma'

export default defineEventHandler(async () => {
  const entrepreneurs = await prisma.entrepreneur.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      slug: true,
      name: true,
      title: true,
      photo: true,
      featuredInterviewVideoType: true,
      featuredInterviewVideoUrl: true,
      featuredInterviewVideoFile: true,
      featuredInterviewCoverImage: true,
    },
  })

  return entrepreneurs.flatMap((entrepreneur) => {
    const videoType = entrepreneur.featuredInterviewVideoType
      || (entrepreneur.featuredInterviewVideoFile ? 'SELF_HOSTED' : 'EMBED')
    const videoUrl = videoType === 'EMBED'
      ? getTrustedEmbedUrl(entrepreneur.featuredInterviewVideoUrl)
      : ''
    const videoFile = videoType === 'SELF_HOSTED'
      ? getSafeUploadedMediaUrl(entrepreneur.featuredInterviewVideoFile)
      : ''

    if (!videoUrl && !videoFile) return []

    return [{
      id: entrepreneur.id,
      slug: entrepreneur.slug,
      name: entrepreneur.name,
      title: entrepreneur.title,
      coverImage: entrepreneur.featuredInterviewCoverImage || entrepreneur.photo,
      videoType,
      videoUrl: videoUrl || null,
      videoFile: videoFile || null,
    }]
  })
})
