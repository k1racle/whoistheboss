export interface ShootingStageItem {
  index: string
  title: string
  subtitle: string
  eyebrow: string
  description: string
}

export interface ShootingFaqItem {
  question: string
  answer: string
}

export interface ShootingPageData {
  heroTitle: string
  seoTitle: string
  seoDescription: string
  aboutTitle: string
  aboutText: string
  aboutBottomText: string
  aboutVideoType: 'EMBED' | 'SELF_HOSTED'
  aboutVideoUrl: string
  aboutVideoFile: string
  stagesTitle: string
  stages: ShootingStageItem[]
  faqTitle: string
  faqItems: ShootingFaqItem[]
  sectionOrder: string[]
  sectionVisibility: Record<string, boolean>
}
