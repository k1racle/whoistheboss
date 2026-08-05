import type { EntrepreneurDetailData, EntrepreneurMoreItem } from '@features/entrepreneurs/model/entrepreneur.types'
import prisma from '~~/lib/prisma'
import { parseSectionOrder, parseSectionVisibility } from '@shared/lib/section-config'
import { ROUTES } from '@shared/navigation'
import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'

const ENTREPRENEUR_DETAIL_SETTINGS_KEYS = [
  'HOME_BANNER_IMAGE',
  'HOME_BANNER_MOBILE_IMAGE',
  'HOME_BANNER_LINK',
] as const

const DEFAULT_SECTION_ORDER = [
  'hero',
  'about',
  'biography',
  'childhood',
  'education',
  'shorts',
  'turnover',
  'more',
  'featuredInterview',
  'cta',
  'banner',
  'interviewList',
  'articles',
] as const

function stripHtml(value: string | null | undefined): string {
  return (value || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseGallery(raw: string | null | undefined): string[] {
  return (raw || '')
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseMoreItems(titlesRaw: string | null | undefined, linksRaw: string | null | undefined): EntrepreneurMoreItem[] {
  const titles = (titlesRaw || '').split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
  const links = (linksRaw || '').split(/\r?\n/).map((item) => item.trim())
  const fallbackTitles = [
    'Компании героя',
    'Смотреть интервью',
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
    href: links[index] || fallbackLinks[index] || ROUTES.ENTREPRENEURS,
  }))
}

export default defineEventHandler(async (event): Promise<EntrepreneurDetailData> => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Entrepreneur slug is required' })
  }

  const entrepreneur = await prisma.entrepreneur.findFirst({
    where: { slug, isPublished: true },
  })

  if (!entrepreneur) {
    throw createError({ statusCode: 404, statusMessage: 'Entrepreneur not found' })
  }

  const [interviews, reels, articles, settings] = await Promise.all([
    prisma.interview.findMany({
      where: { isPublished: true, entrepreneurId: entrepreneur.id },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 6,
      include: {
        entrepreneur: {
          select: {
            slug: true,
            name: true,
            title: true,
            photo: true,
            quote: true,
          },
        },
      },
    }),
    prisma.reel.findMany({
      where: { isPublished: true, entrepreneurId: entrepreneur.id },
      orderBy: { createdAt: 'desc' },
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
    prisma.article.findMany({
      where: { isPublished: true, entrepreneurId: entrepreneur.id },
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
    getSiteSettings(ENTREPRENEUR_DETAIL_SETTINGS_KEYS),
  ])

  const heroNameParts = entrepreneur.name.split(/\s+/).filter(Boolean)
  const aboutGalleryImages = Array.from(new Set([
    entrepreneur.photo,
    ...parseGallery(entrepreneur.aboutGalleryPhotos || entrepreneur.galleryPhotos),
  ].filter(Boolean) as string[]))

  const sectionVisibility = parseSectionVisibility(entrepreneur.sectionVisibility)
  const defaultLabels = [
    `Who's the ${entrepreneur.name}?`,
    'Краткая биография',
    'Начало карьеры',
    'Первые успехи в бизнесе',
    'Миссия и масштаб',
    'Контакты и материалы',
  ] as const
  const defaultDescriptions = [
    'Краткая информация и навигация по странице героя.',
    'Детство, интересы и обстоятельства, которые сформировали взгляд на дело.',
    'Образование, первые роли и профессиональный опыт.',
    'Решения, которые привели к первым заметным результатам.',
    'Подход к масштабу, продукту и развитию.',
    'Разделы со статьями, интервью и дополнительными материалами.',
  ] as const
  const menuLinks = ['#biography', '#childhood', '#education', '#turnover', '#articles', '#contacts']
  const menuSectionKeys = ['biography', 'childhood', 'education', 'turnover', 'articles', null]
  const customLabels = (entrepreneur.aboutMenuLabels || '').split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
  const customDescriptions = (entrepreneur.aboutMenuDescriptions || '').split(/\r?\n/).map((item) => item.trim()).filter(Boolean)

  const aboutMenuItems = menuLinks
    .map((href, index) => ({
      href,
      label: customLabels[index] || defaultLabels[index] || '',
      note: customDescriptions[index] || defaultDescriptions[index] || '',
      sectionKey: menuSectionKeys[index],
    }))
    .filter((item) => !item.sectionKey || sectionVisibility[item.sectionKey] !== false)
    .map(({ href, label, note }) => ({ href, label, note }))

  const biographyBlocks = [
    entrepreneur.biographyTextOne,
    entrepreneur.biographyTextTwo,
    entrepreneur.biographyTextThree,
  ]
    .map((item) => (item || '').trim())
    .filter(Boolean)

  const biographyFallback = (entrepreneur.bio || entrepreneur.quote || '')
    .split(/\n\s*\n/)
    .map((item) => stripHtml(item))
    .filter(Boolean)

  const educationFallback = stripHtml(entrepreneur.bio || entrepreneur.quote || '')
  const featuredInterview = interviews[0] || null

  return {
    slug: entrepreneur.slug,
    name: entrepreneur.name,
    title: entrepreneur.title,
    quote: entrepreneur.quote,
    heroLastName: heroNameParts[0] || entrepreneur.name,
    heroFirstName: heroNameParts.slice(1).join(' ') || entrepreneur.name,
    heroLeftTeaser: entrepreneur.heroLeftTeaser || entrepreneur.title || '',
    heroRightTeaser: entrepreneur.heroRightTeaser || entrepreneur.quote || entrepreneur.title || '',
    heroBottomRightTeaser: entrepreneur.heroBottomRightTeaser || entrepreneur.title || '',
    heroMarquee: entrepreneur.heroMarquee || `${entrepreneur.name} • ${entrepreneur.title} • Кто здесь главный`,
    aboutIntroDescription: entrepreneur.aboutIntroDescription || entrepreneur.quote || '',
    aboutMenuItems,
    aboutGalleryImages: aboutGalleryImages.length
      ? aboutGalleryImages
      : [entrepreneur.photo || '/images/placeholder.svg'],
    biographyTitle: entrepreneur.name.toUpperCase(),
    biographyPhoto: entrepreneur.biographyPhoto || entrepreneur.photo || aboutGalleryImages[0] || null,
    biographyBlocks: biographyBlocks.length ? biographyBlocks : biographyFallback,
    childhoodTitle: entrepreneur.childhoodTitle || 'Детство, среда и первые ориентиры',
    childhoodTextOne: entrepreneur.childhoodTextOne || stripHtml(entrepreneur.bio) || entrepreneur.quote || '',
    childhoodTextTwo: entrepreneur.childhoodTextTwo || '',
    educationTitle: entrepreneur.educationTitle || 'Образование\nи опыт\nработы',
    educationText: entrepreneur.educationText || educationFallback || entrepreneur.title,
    educationAsideText: entrepreneur.educationAsideText || '',
    educationPhoto: entrepreneur.educationPhoto || entrepreneur.photo || aboutGalleryImages[0] || null,
    turnoverTitle: entrepreneur.turnoverTitle || 'Первые успехи\nв бизнесе',
    turnoverText: entrepreneur.turnoverText || educationFallback || entrepreneur.title,
    turnoverBottomText: entrepreneur.turnoverBottomText || '',
    turnoverPhoto: entrepreneur.turnoverPhoto || entrepreneur.photo || aboutGalleryImages[0] || null,
    moreItems: parseMoreItems(entrepreneur.moreCardTitles, entrepreneur.moreCardLinks),
    morePhoto: entrepreneur.morePhoto || entrepreneur.photo || aboutGalleryImages[0] || null,
    featuredInterviewVideoType: entrepreneur.featuredInterviewVideoType || featuredInterview?.videoType || 'EMBED',
    featuredInterviewVideoUrl: entrepreneur.featuredInterviewVideoUrl || featuredInterview?.videoUrl || null,
    featuredInterviewVideoFile: entrepreneur.featuredInterviewVideoFile || featuredInterview?.videoFile || null,
    interviews: interviews.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle,
      quote: item.quote,
      coverImage: item.coverImage,
      publishedAt: item.publishedAt?.toISOString() ?? null,
      entrepreneur: item.entrepreneur,
    })),
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
    reels: reels.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      description: item.description,
      coverImage: item.coverImage,
      videoType: item.videoType,
      videoUrl: item.videoUrl,
      videoFile: item.videoFile,
      entrepreneur: item.entrepreneur,
    })),
    bannerImage: getSiteSetting(settings, 'HOME_BANNER_IMAGE'),
    bannerMobileImage: getSiteSetting(settings, 'HOME_BANNER_MOBILE_IMAGE'),
    bannerLink: getSiteSetting(settings, 'HOME_BANNER_LINK', ROUTES.ENTREPRENEURS),
    sectionOrder: parseSectionOrder(entrepreneur.sectionOrder, DEFAULT_SECTION_ORDER),
    sectionVisibility,
  }
})
