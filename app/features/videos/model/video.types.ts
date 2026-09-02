export interface EntrepreneurVideoItem {
  id: string
  slug: string
  name: string
  title: string
  coverImage: string | null
  videoType: 'EMBED' | 'SELF_HOSTED'
  videoUrl: string | null
  videoFile: string | null
}
