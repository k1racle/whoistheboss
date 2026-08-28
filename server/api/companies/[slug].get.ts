import type {
  CompanyAwardItem,
  CompanyMoreItem,
  CompanyProfileData,
  CompanySpecItem,
} from '@features/companies/model/companies-page.types'
import prisma from '~~/lib/prisma'
import { parseSectionOrder, parseSectionVisibility } from '@shared/lib/section-config'
import { ROUTES } from '@shared/navigation'
import { storySectionSchema } from '@server/utils/admin-schemas'
import { safeJsonParse } from '@server/utils/json'
import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'
import { getYandexMapCoordinates } from '@server/utils/yandex-map'
import { businessCityFilter, getRequestedCitySlug } from '@server/utils/presence-city'

const COMPANY_DETAIL_SETTINGS_KEYS = [
  'HOME_BANNER_IMAGE',
  'HOME_BANNER_MOBILE_IMAGE',
  'HOME_BANNER_LINK',
] as const

const DEFAULT_SECTION_ORDER = [
  'hero',
  'manifest',
  'titleBand',
  'about',
  'founder',
  'ownerBiography',
  'specs',
  'addresses',
  'awards',
  'facts',
  'gallery',
  'more',
  'articles',
  'related',
  'cta',
  'banner',
] as const

function parseStorySections(raw: unknown): CompanyProfileData['storySections'] {
  if (!Array.isArray(raw)) return []

  return raw.flatMap((item) => {
    const result = storySectionSchema.safeParse(item)
    return result.success ? [result.data] : []
  })
}

function parseOwnerBiographyBlocks(raw: string | null | undefined): string[] {
  const parsed = safeJsonParse<unknown>(raw, [])
  if (!Array.isArray(parsed)) return []

  return parsed
    .filter((item): item is string => typeof item === 'string')
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 4)
}

function getCompanySectionOrder(
  raw: string | null | undefined,
  storySections: CompanyProfileData['storySections'],
): string[] {
  const storyKeys = storySections.map(section => `story:${section.id}`)
  const moreIndex = DEFAULT_SECTION_ORDER.indexOf('more')
  const defaults = [
    ...DEFAULT_SECTION_ORDER.slice(0, moreIndex),
    ...storyKeys,
    ...DEFAULT_SECTION_ORDER.slice(moreIndex),
  ]

  return parseSectionOrder(raw, defaults)
}

function stripHtml(value: string | null | undefined): string {
  return (value || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseImageList(raw: string | null | undefined): string[] {
  const parsed = safeJsonParse<Array<string | { image?: string }>>(raw, [])
  if (parsed.length) {
    return parsed
      .map((item) => typeof item === 'string' ? item : item?.image || '')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return (raw || '')
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseSpecsItems(raw: string | null | undefined): CompanySpecItem[] {
  const defaults: CompanySpecItem[] = [
    { title: 'Факты о проекте', note: 'Ключевые характеристики компании и бизнеса.', icon: null },
    { title: 'Рост и масштаб', note: 'Важные цифры, которые помогают понять динамику.', icon: null },
    { title: 'Команда и продукт', note: 'Люди, процессы и решения, формирующие результат.', icon: null },
  ]

  const parsed = safeJsonParse<Array<{ title?: string; note?: string; icon?: string }>>(raw, [])
    .map((item) => ({
      title: String(item?.title || '').trim(),
      note: String(item?.note || '').trim(),
      icon: String(item?.icon || '').trim() || null,
    }))
    .filter((item) => item.title || item.note || item.icon)

  return parsed.length ? parsed : defaults
}

function parseAwards(raw: string | null | undefined): CompanyAwardItem[] {
  const defaults: CompanyAwardItem[] = [
    { nominations: 'Награды и премии', place: 'Выбор команды', icon: null },
    { nominations: 'Профессиональные достижения', place: 'Ключевые результаты', icon: null },
    { nominations: 'Признание индустрии', place: 'Сильные стороны', icon: null },
  ]

  const parsed = safeJsonParse<Array<{ nominations?: string; place?: string; icon?: string }>>(raw, [])
    .map((item) => ({
      nominations: String(item?.nominations || '').trim(),
      place: String(item?.place || '').trim(),
      icon: String(item?.icon || '').trim() || null,
    }))
    .filter((item) => item.nominations || item.place || item.icon)

  return parsed.length ? parsed : defaults
}

function parseMoreItems(titlesRaw: string | null | undefined, linksRaw: string | null | undefined): CompanyMoreItem[] {
  const titles = (titlesRaw || '').split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
  const links = (linksRaw || '').split(/\r?\n/).map((item) => item.trim())
  const fallbackTitles = [
    'Другие проекты',
    'Интервью героев',
    'Читать блог',
    'Стать участником\nпроекта',
  ] as const
  const fallbackLinks = [
    ROUTES.COMPANIES,
    ROUTES.INTERVIEWS,
    ROUTES.BLOG,
    ROUTES.SHOOTING_REQUEST,
  ] as const

  return Array.from({ length: 4 }, (_, index) => ({
    title: titles[index] || fallbackTitles[index] || '',
    href: links[index] || fallbackLinks[index] || ROUTES.COMPANIES,
  }))
}

export default defineEventHandler(async (event): Promise<CompanyProfileData> => {
  const slug = getRouterParam(event, 'slug')
  const citySlug = getRequestedCitySlug(event)
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Company slug is required' })
  }

  const business = await prisma.business.findFirst({
    where: { slug, isPublished: true, ...businessCityFilter(citySlug) },
    include: {
      entrepreneur: true,
    },
  })

  if (!business) {
    throw createError({ statusCode: 404, statusMessage: 'Company not found' })
  }

  const sameOwnerRelated = await prisma.business.findMany({
    where: {
      isPublished: true,
      id: { not: business.id },
      entrepreneurId: business.entrepreneurId,
    },
    orderBy: [
      { placesSortOrder: 'asc' },
      { createdAt: 'desc' },
      { id: 'asc' },
    ],
    take: 3,
    select: {
      id: true,
      slug: true,
      name: true,
      type: true,
      coverImage: true,
    },
  })

  const [fallbackRelated, articles, settings] = await Promise.all([
    prisma.business.findMany({
      where: {
        isPublished: true,
        id: { notIn: [business.id, ...sameOwnerRelated.map((item) => item.id)] },
        entrepreneurId: { not: business.entrepreneurId },
      },
      orderBy: [
        { placesSortOrder: 'asc' },
        { createdAt: 'desc' },
        { id: 'asc' },
      ],
      take: 3,
      select: {
        id: true,
        slug: true,
        name: true,
        type: true,
        coverImage: true,
      },
    }),
    prisma.article.findMany({
      where: { isPublished: true, entrepreneurId: business.entrepreneurId },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 6,
      include: {
        entrepreneur: {
          select: {
            slug: true,
            name: true,
            title: true,
            photo: true,
          },
        },
      },
    }),
    getSiteSettings(COMPANY_DETAIL_SETTINGS_KEYS),
  ])

  const related = [...sameOwnerRelated, ...fallbackRelated]
    .slice(0, 3)
    .map(({ slug, name, type, coverImage }) => ({
      slug,
      name,
      type,
      coverImage,
    }))
  const plainDescription = stripHtml(business.description)
  const nameParts = business.name.trim().split(/\s+/).filter(Boolean)
  const galleryImages = Array.from(new Set([
    ...parseImageList(business.galleryImages),
    business.coverImage,
    business.aboutPhoto,
    business.factsPhoto,
    business.morePhoto,
  ].filter(Boolean) as string[]))

  const ownerBiographyBlocks = business.entrepreneur
    ? [
      business.entrepreneur.biographyTextOne,
      business.entrepreneur.biographyTextTwo,
      business.entrepreneur.biographyTextThree,
      stripHtml(business.entrepreneur.bio),
      business.entrepreneur.aboutIntroDescription,
      business.entrepreneur.quote,
    ]
      .map((item) => (item || '').trim())
      .filter((item, index, items) => item && items.indexOf(item) === index)
      .slice(0, 4)
    : []
  const customOwnerBiographyBlocks = business.useCustomOwnerBiography
    ? parseOwnerBiographyBlocks(business.ownerBiographyBlocks)
    : []
  const storySections = parseStorySections(business.storySections)

  return {
    slug: business.slug,
    name: business.name,
    type: business.type,
    description: plainDescription || null,
    heroTitleTop: nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : business.name,
    heroTitleBottom: nameParts.length > 1 ? (nameParts[nameParts.length - 1] || '') : '',
    heroTeaser: business.heroTeaser || business.type,
    heroMarquee: business.heroMarquee || `${business.name} • ${business.type} • История компании`,
    manifestTitle: business.manifestTitle || 'Эксперимент, который сработал',
    manifestTextOne: business.manifestTextOne || plainDescription || `${business.name} — компания с понятным характером, продуктом и собственной историей развития.`,
    manifestTextTwo: business.manifestTextTwo || 'Сильная идея становится самостоятельным проектом, когда вокруг нее появляется команда, ритм и последовательность решений.',
    manifestTextThree: business.manifestTextThree || 'Компания растет вместе со своей аудиторией, удерживая качество, тон и внимание к деталям.',
    manifestBackgroundImage: business.manifestBackgroundImage,
    manifestSquareImage: business.manifestSquareImage || business.coverImage,
    aboutTitle: business.aboutTitle || 'О компании\nС чего все начиналось\nИстория создания',
    aboutText: business.aboutText || plainDescription || `${business.name} — проект, выросший из сильной идеи, внимания к деталям и системной работы.`,
    aboutAsideText: business.aboutAsideText || 'Здесь важен не только продукт, но и люди, которые создают его ежедневно.',
    aboutPhoto: business.aboutPhoto || business.coverImage,
    owner: business.entrepreneur
      ? {
        slug: business.entrepreneur.slug,
        name: business.entrepreneur.name,
        title: business.entrepreneur.title,
        heroRightTeaser: business.entrepreneur.heroRightTeaser,
        heroBottomRightTeaser: business.entrepreneur.heroBottomRightTeaser,
        quote: business.entrepreneur.quote,
        photo: business.entrepreneur.photo,
        biographyPhoto: business.entrepreneur.biographyPhoto || business.entrepreneur.photo,
        biographyBlocks: customOwnerBiographyBlocks.length
          ? customOwnerBiographyBlocks
          : ownerBiographyBlocks.length
            ? ownerBiographyBlocks
          : [`${business.entrepreneur.name} — основатель и человек, который определяет характер компании ${business.name}.`],
      }
      : null,
    storySections,
    founderPhoto: business.founderPhoto || business.entrepreneur?.photo || null,
    specsTitle: business.specsTitle || 'Основные характеристики',
    specsDescription: business.specsDescription || 'Ключевые показатели, ориентиры и факты о компании.',
    specsItems: parseSpecsItems(business.specsItems),
    address: business.address,
    city: business.city,
    phone: business.phone,
    email: business.email,
    website: business.website,
    mapCoordinates: getYandexMapCoordinates(business.mapEmbed),
    awardsEnabled: business.awardsEnabled !== false,
    awardsTitle: business.awardsTitle || 'Достижения и награды',
    awardsDescription: business.awardsDescription || 'Ключевые результаты и внешнее признание проекта.',
    awards: parseAwards(business.awardsItems),
    factsTitle: business.factsTitle || 'Команда и\nинтересные факты',
    factsSubtitle: business.factsSubtitle || 'Люди, решения и детали, которые формируют компанию.',
    factsTextOne: business.factsTextOne || plainDescription || `${business.name} развивается через продукт, команду и постоянную работу над качеством.`,
    factsTextTwo: business.factsTextTwo || 'За каждой компанией стоят решения, ритуалы, привычки команды и последовательность, которая удерживает рост.',
    factsPhoto: business.factsPhoto || business.coverImage,
    galleryImages,
    moreItems: parseMoreItems(business.moreCardTitles, business.moreCardLinks),
    morePhoto: business.morePhoto || business.coverImage,
    articles: articles.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle,
      category: item.category,
      coverImage: item.coverImage,
      publishedAt: item.publishedAt?.toISOString() ?? null,
      entrepreneur: item.entrepreneur,
    })),
    relatedTitle: business.relatedTitle || 'Читайте также',
    related,
    bannerImage: getSiteSetting(settings, 'HOME_BANNER_IMAGE'),
    bannerMobileImage: getSiteSetting(settings, 'HOME_BANNER_MOBILE_IMAGE'),
    bannerLink: getSiteSetting(settings, 'HOME_BANNER_LINK', ROUTES.ENTREPRENEURS),
    sectionOrder: getCompanySectionOrder(business.sectionOrder, storySections),
    sectionVisibility: parseSectionVisibility(business.sectionVisibility),
  }
})
