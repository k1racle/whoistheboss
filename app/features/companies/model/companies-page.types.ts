import type { MapCoordinates } from '@shared/types/map'
import type { AdditionalSectionData } from '@shared/types/additional-section'
import type { BlogArticleSummary } from '@features/blog/model/blog.types'

export interface CompanyCatalogItem {
  slug: string
  name: string
  type: string
  coverImage: string | null
}

export interface CompaniesPageData {
  heroTitle: string
  aboutTitle: string
  aboutText: string
  companies: CompanyCatalogItem[]
  bannerImage: string
  bannerMobileImage: string
  bannerLink: string
  sectionOrder: string[]
  sectionVisibility: Record<string, boolean>
}

export interface CompanyOwnerSummary {
  slug: string
  name: string
  title: string
  heroRightTeaser: string | null
  heroBottomRightTeaser: string | null
  quote: string | null
  photo: string | null
  biographyPhoto: string | null
  biographyBlocks: string[]
}

export interface CompanySpecItem {
  title: string
  note: string
  icon: string | null
}

export interface CompanyAwardItem {
  nominations: string
  place: string
  icon: string | null
}

export interface CompanyMoreItem {
  title: string
  href: string
}

export interface CompanyProfileData {
  slug: string
  name: string
  type: string
  description: string | null
  heroTitleTop: string
  heroTitleBottom: string
  heroTeaser: string
  heroMarquee: string
  manifestTitle: string
  manifestTextOne: string
  manifestTextTwo: string
  manifestTextThree: string
  manifestBackgroundImage: string | null
  manifestSquareImage: string | null
  aboutTitle: string
  aboutText: string
  aboutAsideText: string
  aboutPhoto: string | null
  owner: CompanyOwnerSummary | null
  storySections: AdditionalSectionData[]
  founderPhoto: string | null
  specsTitle: string
  specsDescription: string
  specsItems: CompanySpecItem[]
  address: string | null
  city: string | null
  phone: string | null
  email: string | null
  website: string | null
  mapCoordinates: MapCoordinates[]
  awardsEnabled: boolean
  awardsTitle: string
  awardsDescription: string
  awards: CompanyAwardItem[]
  factsTitle: string
  factsSubtitle: string
  factsTextOne: string
  factsTextTwo: string
  factsPhoto: string | null
  galleryImages: string[]
  moreItems: CompanyMoreItem[]
  morePhoto: string | null
  articles: BlogArticleSummary[]
  relatedTitle: string
  related: CompanyCatalogItem[]
  bannerImage: string
  bannerMobileImage: string
  bannerLink: string
  sectionOrder: string[]
  sectionVisibility: Record<string, boolean>
}
