import { z } from 'zod'
import type { FooterMetaItem } from '@shared/types/site-footer'

export const FOOTER_META_ITEMS_KEY = 'FOOTER_META_ITEMS'

export const DEFAULT_FOOTER_META_ITEMS: FooterMetaItem[] = [
  { text: 'ИП Батагов А.А.', href: '' },
  { text: 'Пошта Почта', href: '' },
  { text: 'Политика конф-ти', href: '' },
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
