import type { SiteFooterData } from '@shared/types/site-footer'
import { SOCIAL_LINKS } from '@shared/social'
import {
  FOOTER_META_ITEMS_KEY,
  ensurePrivacyPolicyLink,
  isSafeFooterHref,
  parseFooterMetaItems,
  parseSocialLinks,
  SOCIAL_LINKS_KEY,
} from '@server/utils/site-footer'
import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'
import { normalizeTrademarkPage } from '@server/utils/trademark-page'

const socialSettings = [
  ['SOCIAL_TELEGRAM', 'TELEGRAM'],
  ['SOCIAL_INSTAGRAM', 'INSTAGRAM'],
  ['SOCIAL_VK', 'VK'],
  ['SOCIAL_YOUTUBE', 'YOUTUBE'],
  ['SOCIAL_PINTEREST', 'PINTEREST'],
  ['SOCIAL_DZEN', 'DZEN'],
  ['SOCIAL_X', 'X'],
  ['SOCIAL_WHATSAPP', 'WHATSAPP'],
] as const

const settingKeys = [
  ...socialSettings.map(([key]) => key),
  SOCIAL_LINKS_KEY,
  FOOTER_META_ITEMS_KEY,
  'TRADEMARK_PAGE_JSON',
] as const

export default defineEventHandler(async (): Promise<SiteFooterData> => {
  const settings = await getSiteSettings(settingKeys)
  const legacySocialLinks = socialSettings.flatMap(([key, label]) => {
        const href = getSiteSetting(settings, key)
        return href && isSafeFooterHref(href) ? [{ label, href }] : []
      })
  const socialLinks = Object.hasOwn(settings, SOCIAL_LINKS_KEY)
    ? parseSocialLinks(settings[SOCIAL_LINKS_KEY], [])
    : legacySocialLinks.length ? legacySocialLinks : SOCIAL_LINKS

  return {
    socialLinks,
    metaItems: ensurePrivacyPolicyLink(parseFooterMetaItems(settings[FOOTER_META_ITEMS_KEY])),
    trademarkLegalText: normalizeTrademarkPage(settings.TRADEMARK_PAGE_JSON).footerLegalText,
  }
})
