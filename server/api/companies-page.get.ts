import type { CompaniesPageData } from '@features/companies/model/companies-page.types'
import prisma from '~~/lib/prisma'
import { parseSectionOrder, parseSectionVisibility } from '@shared/lib/section-config'
import { ROUTES } from '@shared/navigation'
import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'
import { businessCityFilter, getRequestedCitySlug } from '@server/utils/presence-city'

const COMPANIES_PAGE_KEYS = [
  'COMPANIES_PAGE_HERO_TITLE',
  'COMPANIES_PAGE_ABOUT_TITLE',
  'COMPANIES_PAGE_ABOUT_TEXT',
  'COMPANIES_PAGE_SECTION_ORDER',
  'COMPANIES_PAGE_SECTION_VISIBILITY',
  'HOME_BANNER_IMAGE',
  'HOME_BANNER_MOBILE_IMAGE',
  'HOME_BANNER_LINK',
] as const

const DEFAULT_SECTION_ORDER = ['hero', 'about', 'catalog', 'cta', 'banner'] as const

export default defineEventHandler(async (event): Promise<CompaniesPageData> => {
  const citySlug = getRequestedCitySlug(event)
  const [settings, companies] = await Promise.all([
    getSiteSettings(COMPANIES_PAGE_KEYS),
    prisma.business.findMany({
      where: { isPublished: true, ...businessCityFilter(citySlug) },
      orderBy: { createdAt: 'desc' },
      select: {
        slug: true,
        name: true,
        type: true,
        coverImage: true,
      },
    }),
  ])

  return {
    heroTitle: getSiteSetting(settings, 'COMPANIES_PAGE_HERO_TITLE', 'ГЛАВНЫЕ\nКОМПАНИИ'),
    aboutTitle: getSiteSetting(settings, 'COMPANIES_PAGE_ABOUT_TITLE', 'О ПРОЕКТЕ'),
    aboutText: getSiteSetting(
      settings,
      'COMPANIES_PAGE_ABOUT_TEXT',
      'Мы рассказываем личные истории предпринимателей через их дело.\n\nПотому что главное не вывеска, а человек, который ее создал.',
    ),
    companies,
    bannerImage: getSiteSetting(settings, 'HOME_BANNER_IMAGE'),
    bannerMobileImage: getSiteSetting(settings, 'HOME_BANNER_MOBILE_IMAGE'),
    bannerLink: getSiteSetting(settings, 'HOME_BANNER_LINK', ROUTES.ENTREPRENEURS),
    sectionOrder: parseSectionOrder(
      getSiteSetting(settings, 'COMPANIES_PAGE_SECTION_ORDER'),
      DEFAULT_SECTION_ORDER,
    ),
    sectionVisibility: parseSectionVisibility(
      getSiteSetting(settings, 'COMPANIES_PAGE_SECTION_VISIBILITY'),
    ),
  }
})
