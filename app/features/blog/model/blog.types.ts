export interface BlogArticleAuthor {
  slug: string
  name: string
  title: string
  photo: string | null
}

export interface BlogArticleSummary {
  id: string
  slug: string
  title: string
  subtitle: string | null
  category: string | null
  coverImage: string | null
  publishedAt: string | null
  entrepreneur: BlogArticleAuthor | null
}

export interface BlogMainFeatureCard {
  title: string
  text: string
  image: string
  url: string
}

export interface BlogRelatedEntrepreneur {
  slug: string
  name: string
  title: string
  photo: string | null
  hoverPhoto: string | null
}

export interface BlogRelatedCompany {
  slug: string
  name: string
  type: string
  coverImage: string | null
}

export interface BlogPageData {
  heroTitle: string
  popularTitle: string
  latestTitle: string
  latestDescription: string
  relatedTitle: string
  mainCards: BlogMainFeatureCard[]
  featuredArticles: BlogArticleSummary[]
  latestArticles: BlogArticleSummary[]
  relatedEntrepreneurs: BlogRelatedEntrepreneur[]
  relatedCompanies: BlogRelatedCompany[]
  sectionOrder: string[]
  sectionVisibility: Record<string, boolean>
}

export interface BlogArticleDetail extends BlogArticleSummary {
  createdAt: string
  updatedAt: string
  coverImageSource: string | null
  content: string
  secondaryImage: string | null
  secondaryImageSource: string | null
  secondaryText: string | null
  relatedTitle: string | null
  metaTitle: string | null
  metaDesc: string | null
  sectionOrder: string[]
  sectionVisibility: Record<string, boolean>
}

export interface BlogArticleRelatedMaterial {
  type: 'entrepreneur' | 'business'
  slug: string
  name: string
  title: string | null
  coverImage: string | null
  hoverPhoto: string | null
}

export interface BlogArticleDetailResponse {
  article: BlogArticleDetail
  relatedMaterials: BlogArticleRelatedMaterial[]
  latestArticles: BlogArticleSummary[]
  bannerImage: string
  bannerMobileImage: string
  bannerLink: string
}
