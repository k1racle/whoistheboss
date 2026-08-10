export const SITE_BANNER_PAGE_KEYS = [
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

export type SiteBannerPageKey = typeof SITE_BANNER_PAGE_KEYS[number]

interface SiteBannerResponse {
  image: string
  mobileImage: string
  link: string
  pages: SiteBannerPageKey[]
}

const fallbackBanner: SiteBannerResponse = {
  image: '',
  mobileImage: '',
  link: '/entrepreneurs',
  pages: [
    '/',
    '/companies',
    '/companies/SLUG',
    '/entrepreneurs',
    '/entrepreneurs/SLUG',
    '/blog/SLUG',
  ],
}

export function useSiteBanner() {
  const { data } = useFetch<SiteBannerResponse>('/api/site-banner', {
    key: 'site-banner',
  })
  const banner = computed(() => data.value ?? fallbackBanner)
  const enabledPages = computed(() => new Set(banner.value.pages))
  const isEnabled = (pageKey: SiteBannerPageKey) => enabledPages.value.has(pageKey)

  return {
    banner,
    isEnabled,
  }
}
