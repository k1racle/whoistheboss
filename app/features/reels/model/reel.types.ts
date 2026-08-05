export interface ReelItem {
  id: string
  slug: string
  title: string
  description: string | null
  coverImage: string | null
  videoType: 'EMBED' | 'SELF_HOSTED'
  videoUrl: string | null
  videoFile: string | null
  entrepreneur: {
    slug: string
    name: string
    title: string
    photo: string | null
  } | null
}
