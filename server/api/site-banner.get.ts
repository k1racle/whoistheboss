import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'

const SITE_BANNER_SETTINGS_KEYS = [
  'HOME_BANNER_IMAGE',
  'HOME_BANNER_MOBILE_IMAGE',
  'HOME_BANNER_LINK',
  'HOME_BANNER_PAGES',
] as const

const SITE_BANNER_PAGE_KEYS = [
  '/',
  '/companies',
  '/companies/SLUG',
  '/entrepreneurs',
  '/entrepreneurs/SLUG',
  '/blog',
  '/blog/SLUG',
  '/shooting-request',
  '/contacts',
  '/reels',
  '/interviews',
  '/interviews/SLUG',
] as const

type SiteBannerPageKey = typeof SITE_BANNER_PAGE_KEYS[number]

const DEFAULT_SITE_BANNER_PAGES: SiteBannerPageKey[] = [
  '/',
  '/companies',
  '/companies/SLUG',
  '/entrepreneurs',
  '/entrepreneurs/SLUG',
  '/blog/SLUG',
]

function parseBannerPages(value: string): SiteBannerPageKey[] {
  if (!value.trim()) return DEFAULT_SITE_BANNER_PAGES

  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return DEFAULT_SITE_BANNER_PAGES

    return SITE_BANNER_PAGE_KEYS.filter(key => parsed.includes(key))
  }
  catch {
    return DEFAULT_SITE_BANNER_PAGES
  }
}

export default defineEventHandler(async () => {
  const settings = await getSiteSettings(SITE_BANNER_SETTINGS_KEYS)

  return {
    image: getSiteSetting(settings, 'HOME_BANNER_IMAGE'),
    mobileImage: getSiteSetting(settings, 'HOME_BANNER_MOBILE_IMAGE'),
    link: getSiteSetting(settings, 'HOME_BANNER_LINK', '/entrepreneurs'),
    pages: parseBannerPages(getSiteSetting(settings, 'HOME_BANNER_PAGES')),
  }
})
