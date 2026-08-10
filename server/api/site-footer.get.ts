import type { SiteFooterData } from '@shared/types/site-footer'
import { SOCIAL_LINKS } from '@shared/social'
import {
  FOOTER_META_ITEMS_KEY,
  isSafeFooterHref,
  parseFooterMetaItems,
} from '@server/utils/site-footer'
import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'

const socialSettings = [
  ['SOCIAL_TELEGRAM', 'TELEGRAM'],
  ['SOCIAL_INSTAGRAM', 'INSTAGRAM'],
  ['SOCIAL_VK', 'VK'],
  ['SOCIAL_YOUTUBE', 'YOUTUBE'],
  ['SOCIAL_PINTEREST', 'PINTEREST'],
  ['SOCIAL_DZEN', 'DZEN'],
] as const

const settingKeys = [
  ...socialSettings.map(([key]) => key),
  FOOTER_META_ITEMS_KEY,
] as const

export default defineEventHandler(async (): Promise<SiteFooterData> => {
  const settings = await getSiteSettings(settingKeys)
  const hasSavedSocialSettings = socialSettings.some(([key]) => Object.hasOwn(settings, key))
  const socialLinks = hasSavedSocialSettings
    ? socialSettings.flatMap(([key, label]) => {
        const href = getSiteSetting(settings, key)
        return href && isSafeFooterHref(href) ? [{ label, href }] : []
      })
    : SOCIAL_LINKS

  return {
    socialLinks,
    metaItems: parseFooterMetaItems(settings[FOOTER_META_ITEMS_KEY]),
  }
})
