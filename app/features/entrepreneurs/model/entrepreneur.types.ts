import type { BlogArticleSummary } from '@features/blog/model/blog.types'
import type { InterviewListItem } from '@features/interviews/model/interview.types'
import type { ReelItem } from '@features/reels/model/reel.types'

export interface AudienceCardItem {
  id: string
  title: string
  description: string | null
  hoverTitle: string | null
  hoverDescription: string | null
}

export interface EntrepreneurListItem {
  slug: string
  name: string
  title: string
  photo: string | null
  hoverPhoto: string | null
  quote: string | null
}

export interface EntrepreneursPageData {
  heroTitle: string
  audienceTitle: string
  audienceText: string
  heroesTitle: string
  heroesText: string
  audienceCards: AudienceCardItem[]
  entrepreneurs: EntrepreneurListItem[]
  bannerImage: string
  bannerMobileImage: string
  bannerLink: string
  sectionOrder: string[]
  sectionVisibility: Record<string, boolean>
}

export interface EntrepreneurAboutMenuItem {
  href: string
  label: string
  note: string
}

export interface EntrepreneurMoreItem {
  title: string
  href: string
}

export interface EntrepreneurDetailData {
  slug: string
  name: string
  title: string
  quote: string | null
  heroLastName: string
  heroFirstName: string
  heroLeftTeaser: string
  heroRightTeaser: string
  heroBottomRightTeaser: string
  heroMarquee: string
  aboutIntroDescription: string
  aboutMenuItems: EntrepreneurAboutMenuItem[]
  aboutGalleryImages: string[]
  biographyTitle: string
  biographyPhoto: string | null
  biographyBlocks: string[]
  childhoodTitle: string
  childhoodTextOne: string
  childhoodTextTwo: string
  educationTitle: string
  educationText: string
  educationAsideText: string
  educationPhoto: string | null
  turnoverTitle: string
  turnoverText: string
  turnoverBottomText: string
  turnoverPhoto: string | null
  moreItems: EntrepreneurMoreItem[]
  morePhoto: string | null
  featuredInterviewVideoType: 'EMBED' | 'SELF_HOSTED'
  featuredInterviewVideoUrl: string | null
  featuredInterviewVideoFile: string | null
  interviews: InterviewListItem[]
  articles: BlogArticleSummary[]
  reels: ReelItem[]
  bannerImage: string
  bannerMobileImage: string
  bannerLink: string
  sectionOrder: string[]
  sectionVisibility: Record<string, boolean>
}
