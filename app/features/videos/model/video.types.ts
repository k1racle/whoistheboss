export interface VideoInterviewItem {
  id: string
  slug: string
  title: string
  subtitle: string | null
  coverImage: string | null
  publishedAt: string | null
  videoType: 'EMBED' | 'SELF_HOSTED'
  videoUrl: string | null
  videoFile: string | null
  entrepreneur: {
    slug: string
    name: string
    title: string
    photo: string | null
  }
}
