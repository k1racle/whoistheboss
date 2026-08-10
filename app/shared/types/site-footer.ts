import type { SocialLink } from '@shared/social'

export interface FooterMetaItem {
  text: string
  href: string
}

export interface SiteFooterData {
  socialLinks: SocialLink[]
  metaItems: FooterMetaItem[]
}
