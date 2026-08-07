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
  image: string | null
}

interface EntrepreneurStorySectionBase {
  id: string
  isVisible: boolean
  menuLabel: string
  menuDescription: string
  menuImage: string | null
}

export interface EntrepreneurBiographyStorySection extends EntrepreneurStorySectionBase {
  type: 'BIOGRAPHY'
  eyebrow: string
  title: string
  textOne: string
  textTwo: string
  textThree: string
  image: string | null
}

export interface EntrepreneurAccentStorySection extends EntrepreneurStorySectionBase {
  type: 'ACCENT'
  title: string
  textOne: string
  textTwo: string
}

export interface EntrepreneurPortraitStorySection extends EntrepreneurStorySectionBase {
  type: 'PORTRAIT'
  title: string
  text: string
  asideText: string
  image: string | null
}

export interface EntrepreneurWideStorySection extends EntrepreneurStorySectionBase {
  type: 'WIDE'
  title: string
  text: string
  bottomText: string
  image: string | null
}

export type EntrepreneurStorySection =
  | EntrepreneurBiographyStorySection
  | EntrepreneurAccentStorySection
  | EntrepreneurPortraitStorySection
  | EntrepreneurWideStorySection

export function getEntrepreneurStorySectionAnchor(sectionId: string): string {
  const legacyAnchors: Record<string, string> = {
    'legacy-biography': 'biography',
    'legacy-childhood': 'childhood',
    'legacy-education': 'education',
    'legacy-turnover': 'turnover',
  }

  return legacyAnchors[sectionId] || `story-${sectionId}`
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
  storySections: EntrepreneurStorySection[]
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
