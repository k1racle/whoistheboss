export interface InterviewListItem {
  id: string
  slug: string
  title: string
  subtitle: string | null
  quote: string | null
  coverImage: string | null
  publishedAt: string | null
  entrepreneur: {
    slug: string
    name: string
    title: string
    photo: string | null
    quote: string | null
  } | null
}

export interface InterviewDetailItem extends InterviewListItem {
  summary: string | null
  content: string | null
  videoType: 'EMBED' | 'SELF_HOSTED'
  videoUrl: string | null
  videoFile: string | null
  metaTitle: string | null
  metaDesc: string | null
}

export interface InterviewDetailResponse {
  interview: InterviewDetailItem
  related: InterviewListItem[]
}
