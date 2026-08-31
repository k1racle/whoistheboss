export interface TrademarkRegistrationRow {
  label: string
  value: string
}

export interface TrademarkMktuClass {
  number: string
  title: string
  summary: string
  officialText: string
}

export interface TrademarkRuleSection {
  id: string
  eyebrow: string
  title: string
  intro: string
  points: string[]
  note: string
  tone: 'neutral' | 'accent' | 'warning'
}

export interface TrademarkProcessStep {
  number: string
  title: string
  text: string
}

export interface TrademarkFaqItem {
  question: string
  answer: string
}

export interface TrademarkPageData {
  seoTitle: string
  seoDescription: string
  lastUpdated: string
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    intro: string
    primaryButton: string
    certificateButton: string
    reportButton: string
  }
  registration: {
    title: string
    rows: TrademarkRegistrationRow[]
    certificateUrl: string
    appendixUrl: string
    certificateAlt: string
  }
  protection: {
    title: string
    intro: string
    notice: string
    classes: TrademarkMktuClass[]
  }
  rules: TrademarkRuleSection[]
  licensing: {
    title: string
    intro: string
    points: string[]
    processTitle: string
    steps: TrademarkProcessStep[]
    disclaimer: string
  }
  quality: {
    title: string
    text: string
    points: string[]
  }
  violation: {
    title: string
    text: string
    requirements: string[]
    button: string
    disclaimer: string
  }
  faqTitle: string
  faqItems: TrademarkFaqItem[]
  contacts: {
    title: string
    rightsHolder: string
    ogrn: string
    inn: string
    legalAddress: string
    postalAddress: string
    licenseEmail: string
    violationEmail: string
    phone: string
    disclaimer: string
  }
  application: {
    title: string
    intro: string
    successText: string
  }
  footerLegalText: string
}

export type TrademarkRequestType = 'LICENSE' | 'INFRINGEMENT'

