export interface ReelItem {
  id: string
  slug: string
  title: string
  description: string | null
  coverImage: string | null
  metaTitle: string | null
  metaDesc: string | null
  socialImage: string | null
  createdAt: string
  updatedAt: string
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
