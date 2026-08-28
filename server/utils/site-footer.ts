import { z } from 'zod'
import type { FooterMetaItem } from '@shared/types/site-footer'
import type { SocialLink } from '@shared/social'

export const FOOTER_META_ITEMS_KEY = 'FOOTER_META_ITEMS'
export const SOCIAL_LINKS_KEY = 'SOCIAL_LINKS'

export const DEFAULT_FOOTER_META_ITEMS: FooterMetaItem[] = [
  { text: 'ИП Батагов А.А.', href: '' },
  { text: 'Пошта Почта', href: '' },
  { text: 'Политика конф-ти', href: '/privacy-policy' },
]

export function isSafeFooterHref(href: string): boolean {
  if (!href) return true
  if (href.startsWith('/') && !href.startsWith('//')) return true

  try {
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(new URL(href).protocol)
  }
  catch {
    return false
  }
}

const footerHrefSchema = z.string().trim().refine(
  isSafeFooterHref,
  'Ссылка должна быть внутренним путем или начинаться с http://, https://, mailto: или tel:',
)

export const footerMetaItemsSchema = z.array(z.object({
  text: z.string().trim().min(1, 'Текст элемента футера обязателен'),
  href: footerHrefSchema.default(''),
})).max(20)

export const socialLinksSchema = z.array(z.object({
  label: z.string().trim().min(1).max(80),
  href: footerHrefSchema.refine(value => Boolean(value), 'Ссылка на социальную сеть обязательна'),
})).max(30)

export function parseFooterMetaItems(value: string | undefined): FooterMetaItem[] {
  if (!value) return DEFAULT_FOOTER_META_ITEMS

  try {
    const parsed = footerMetaItemsSchema.safeParse(JSON.parse(value))
    return parsed.success ? parsed.data : DEFAULT_FOOTER_META_ITEMS
  }
  catch {
    return DEFAULT_FOOTER_META_ITEMS
  }
}

export function ensurePrivacyPolicyLink(items: FooterMetaItem[]): FooterMetaItem[] {
  return items.map(item => (
    !item.href && item.text.trim().toLowerCase().startsWith('политика')
      ? { ...item, href: '/privacy-policy' }
      : item
  ))
}

export function parseSocialLinks(value: string | undefined, fallback: SocialLink[]): SocialLink[] {
  if (!value) return fallback
  try {
    const parsed = socialLinksSchema.safeParse(JSON.parse(value))
    return parsed.success ? parsed.data : fallback
  }
  catch {
    return fallback
  }
}
