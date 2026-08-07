import type { EntrepreneursPageData } from '@features/entrepreneurs/model/entrepreneur.types'
import prisma from '~~/lib/prisma'
import { parseSectionOrder, parseSectionVisibility } from '@shared/lib/section-config'
import { ROUTES } from '@shared/navigation'
import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'

const ENTREPRENEURS_PAGE_KEYS = [
  'ENTREPRENEURS_PAGE_HERO_TITLE',
  'ENTREPRENEURS_PAGE_AUDIENCE_TITLE',
  'ENTREPRENEURS_PAGE_AUDIENCE_TEXT',
  'ENTREPRENEURS_PAGE_HEROES_TITLE',
  'ENTREPRENEURS_PAGE_HEROES_TEXT',
  'ENTREPRENEURS_PAGE_SECTION_ORDER',
  'ENTREPRENEURS_PAGE_SECTION_VISIBILITY',
  'HOME_BANNER_IMAGE',
  'HOME_BANNER_MOBILE_IMAGE',
  'HOME_BANNER_LINK',
] as const

const DEFAULT_SECTION_ORDER = ['hero', 'audience', 'heroes', 'cta', 'banner'] as const

const DEFAULT_AUDIENCE_CARDS = [
  { title: 'Предприниматели', hoverTitle: 'Герои бизнеса' },
  { title: 'Руководители', hoverTitle: 'Лидеры команд' },
  { title: 'Основатели компаний', hoverTitle: 'Создатели идей' },
  { title: 'Владельцы своего дела', hoverTitle: 'Те, кто строит свое' },
  { title: 'Управляющие партнеры', hoverTitle: 'Лица решений' },
  { title: 'Генеральные директора', hoverTitle: 'Те, кто ведет вперед' },
  { title: 'Создатели нового', hoverTitle: 'Авторы перемен' },
] as const

export default defineEventHandler(async (): Promise<EntrepreneursPageData> => {
  const [settings, entrepreneurs, audienceCards] = await Promise.all([
    getSiteSettings(ENTREPRENEURS_PAGE_KEYS),
    prisma.entrepreneur.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      select: {
        slug: true,
        name: true,
        title: true,
        photo: true,
        hoverPhoto: true,
        quote: true,
      },
    }),
    prisma.audienceCard.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        hoverTitle: true,
        hoverDescription: true,
      },
    }),
  ])

  return {
    heroTitle: getSiteSetting(settings, 'ENTREPRENEURS_PAGE_HERO_TITLE', 'Кто здесь\nглавный?'),
    audienceTitle: getSiteSetting(settings, 'ENTREPRENEURS_PAGE_AUDIENCE_TITLE', 'Наши герои'),
    audienceText: getSiteSetting(
      settings,
      'ENTREPRENEURS_PAGE_AUDIENCE_TEXT',
      'Здесь собраны предприниматели, руководители и основатели компаний, которые создают проекты и развивают бизнес через личное участие.',
    ),
    heroesTitle: getSiteSetting(settings, 'ENTREPRENEURS_PAGE_HEROES_TITLE', 'Герои'),
    heroesText: getSiteSetting(
      settings,
      'ENTREPRENEURS_PAGE_HEROES_TEXT',
      'Мы рассказываем не только о компаниях, но и о людях, которые стоят за ними.',
    ),
    audienceCards: audienceCards.length
      ? audienceCards
      : DEFAULT_AUDIENCE_CARDS.map((item, index) => ({
        id: `default-${index}`,
        title: item.title,
        description: null,
        hoverTitle: item.hoverTitle,
        hoverDescription: null,
      })),
    entrepreneurs,
    bannerImage: getSiteSetting(settings, 'HOME_BANNER_IMAGE'),
    bannerMobileImage: getSiteSetting(settings, 'HOME_BANNER_MOBILE_IMAGE'),
    bannerLink: getSiteSetting(settings, 'HOME_BANNER_LINK', ROUTES.ENTREPRENEURS),
    sectionOrder: parseSectionOrder(
      getSiteSetting(settings, 'ENTREPRENEURS_PAGE_SECTION_ORDER'),
      DEFAULT_SECTION_ORDER,
    ),
    sectionVisibility: parseSectionVisibility(
      getSiteSetting(settings, 'ENTREPRENEURS_PAGE_SECTION_VISIBILITY'),
    ),
  }
})
