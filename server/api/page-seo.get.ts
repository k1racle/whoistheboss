import type { PageSeoData, PageSeoKey } from '@shared/seo/page-seo'
import { STATIC_PAGE_SEO } from '@shared/seo/static-page-seo'
import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'

const PAGE_SEO: Record<PageSeoKey, {
  prefix: string
}> = {
  home: { prefix: 'HOME' },
  entrepreneurs: { prefix: 'ENTREPRENEURS' },
  companies: { prefix: 'COMPANIES' },
  blog: { prefix: 'BLOG' },
  interviews: { prefix: 'INTERVIEWS' },
  reels: { prefix: 'REELS' },
  contacts: { prefix: 'CONTACTS' },
}

const ALL_KEYS = [
  'SEO_DEFAULT_IMAGE',
  ...Object.values(PAGE_SEO).flatMap(({ prefix }) => [
    `SEO_${prefix}_TITLE`,
    `SEO_${prefix}_DESCRIPTION`,
    `SEO_${prefix}_IMAGE`,
  ]),
] as const

export default defineEventHandler(async (event): Promise<PageSeoData> => {
  const requestedPage = String(getQuery(event).page || '') as PageSeoKey
  const definition = PAGE_SEO[requestedPage]
  if (!definition) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported SEO page' })
  }

  const settings = await getSiteSettings(ALL_KEYS)
  const key = `SEO_${definition.prefix}`
  const fallback = STATIC_PAGE_SEO[requestedPage]

  return {
    title: getSiteSetting(settings, `${key}_TITLE`, fallback.title),
    description: getSiteSetting(settings, `${key}_DESCRIPTION`, fallback.description),
    image: getSiteSetting(
      settings,
      `${key}_IMAGE`,
      getSiteSetting(settings, 'SEO_DEFAULT_IMAGE', '/favicon/web-app-manifest-512x512.png'),
    ),
  }
})
