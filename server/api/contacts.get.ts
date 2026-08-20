import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'
import { getTrustedEmbedUrl } from '@shared/lib/media-url'

const CONTACT_SETTING_KEYS = [
  'CONTACT_ADDRESS',
  'CONTACT_MAP_EMBED',
  'CONTACT_PHONE',
  'CONTACT_EMAIL',
] as const

export default defineEventHandler(async () => {
  const settings = await getSiteSettings(CONTACT_SETTING_KEYS)

  return {
    address: getSiteSetting(settings, 'CONTACT_ADDRESS'),
    mapSrc: getTrustedEmbedUrl(getSiteSetting(settings, 'CONTACT_MAP_EMBED')),
    phone: getSiteSetting(settings, 'CONTACT_PHONE'),
    email: getSiteSetting(settings, 'CONTACT_EMAIL'),
  }
})
