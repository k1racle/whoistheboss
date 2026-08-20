import { getSafeUploadedMediaUrl, getTrustedEmbedUrl } from '@shared/lib/media-url'
import { sanitizeRichText } from '@server/utils/content-security'
import { throwAdminError } from '@server/utils/admin-api'

function normalizeOptionalEmbed(value: string | null | undefined, label: string): string | null {
  if (!value?.trim()) return null
  const normalized = getTrustedEmbedUrl(value)
  if (!normalized) throwAdminError(400, `${label}: unsupported embed URL`)
  return normalized
}

function normalizeOptionalUpload(value: string | null | undefined, label: string): string | null {
  if (!value?.trim()) return null
  const normalized = getSafeUploadedMediaUrl(value)
  if (!normalized) throwAdminError(400, `${label}: invalid uploaded media URL`)
  return normalized
}

export function normalizeVideoFields<T extends {
  videoType: 'EMBED' | 'SELF_HOSTED'
  videoUrl?: string | null
  videoFile?: string | null
}>(data: T): T {
  return {
    ...data,
    videoUrl: data.videoType === 'EMBED'
      ? normalizeOptionalEmbed(data.videoUrl, 'Video')
      : null,
    videoFile: data.videoType === 'SELF_HOSTED'
      ? normalizeOptionalUpload(data.videoFile || data.videoUrl, 'Video')
      : null,
  }
}

export function normalizeArticleContent<T extends {
  content: string
  secondaryText?: string | null
}>(data: T): T {
  return {
    ...data,
    content: sanitizeRichText(data.content),
    secondaryText: data.secondaryText ? sanitizeRichText(data.secondaryText) : null,
  }
}

export function normalizeInterviewContent<T extends {
  content?: string | null
  summary?: string | null
}>(data: T): T {
  return {
    ...data,
    content: data.content ? sanitizeRichText(data.content) : null,
    summary: data.summary ? sanitizeRichText(data.summary) : null,
  }
}

export function normalizeFeaturedInterview<T extends {
  featuredInterviewVideoType?: 'EMBED' | 'SELF_HOSTED' | null
  featuredInterviewVideoUrl?: string | null
  featuredInterviewVideoFile?: string | null
}>(data: T): T {
  const type = data.featuredInterviewVideoType
  if (!type) return data
  return {
    ...data,
    featuredInterviewVideoUrl: type === 'EMBED'
      ? normalizeOptionalEmbed(data.featuredInterviewVideoUrl, 'Featured interview')
      : null,
    featuredInterviewVideoFile: type === 'SELF_HOSTED'
      ? normalizeOptionalUpload(
          data.featuredInterviewVideoFile || data.featuredInterviewVideoUrl,
          'Featured interview',
        )
      : null,
  }
}

