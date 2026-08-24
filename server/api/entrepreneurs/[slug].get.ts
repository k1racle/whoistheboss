import {
  getEntrepreneurStorySectionAnchor,
  type EntrepreneurDetailData,
  type EntrepreneurMoreItem,
} from '@features/entrepreneurs/model/entrepreneur.types'
import prisma from '~~/lib/prisma'
import { parseSectionVisibility } from '@shared/lib/section-config'
import { ROUTES } from '@shared/navigation'
import {
  normalizeEntrepreneurSectionOrder,
  normalizeEntrepreneurStorySections,
} from '@server/utils/entrepreneur-story-sections'
import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'

const ENTREPRENEUR_DETAIL_SETTINGS_KEYS = [
  'HOME_BANNER_IMAGE',
  'HOME_BANNER_MOBILE_IMAGE',
  'HOME_BANNER_LINK',
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
    'OPEN BAR ZANOZA',
    'КАФЕ-БАР СЕЛЬДЕРЕЙ',
    'ДРУГИЕ УЧАСТНИКИ',
    'Стать участником\nпроекта',
  ] as const
  const fallbackLinks = [
    '',
    '',
    '',
    ROUTES.SHOOTING_REQUEST,
  ] as const

  return Array.from({ length: 4 }, (_, index) => ({
    title: titles[index] || fallbackTitles[index] || '',
    href: links[index] || fallbackLinks[index] || '',
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
  const hasStoredStorySections = Array.isArray(entrepreneur.storySections)
  const educationFallback = stripHtml(entrepreneur.bio || entrepreneur.quote || '')
  const storySections = normalizeEntrepreneurStorySections(
    entrepreneur,
    sectionVisibility,
    aboutGalleryImages,
    educationFallback,
  )
  const customLabels = (entrepreneur.aboutMenuLabels || '').split(/\r?\n/).map(item => item.trim())
  const customDescriptions = (entrepreneur.aboutMenuDescriptions || '').split(/\r?\n/).map(item => item.trim())
  const articlesMenuIndex = hasStoredStorySections ? 0 : 4
  const contactsMenuIndex = hasStoredStorySections ? 1 : 5
  const aboutMenuItems = [
    ...storySections
      .filter(section => section.isVisible)
      .map(section => ({
        href: `#${getEntrepreneurStorySectionAnchor(section.id)}`,
        label: section.menuLabel,
        note: section.menuDescription,
        image: section.menuImage,
      })),
    ...(sectionVisibility.articles === false
      ? []
      : [{
          href: '#articles',
          label: customLabels[articlesMenuIndex] || 'Миссия и масштаб',
          note: customDescriptions[articlesMenuIndex] || 'Подход к масштабу, продукту и развитию.',
          image: aboutGalleryImages[4] || entrepreneur.photo || null,
        }]),
    {
      href: '#contacts',
      label: customLabels[contactsMenuIndex] || 'Контакты и материалы',
      note: customDescriptions[contactsMenuIndex] || 'Разделы со статьями, интервью и дополнительными материалами.',
      image: aboutGalleryImages[5] || entrepreneur.photo || null,
    },
  ]
  const featuredInterview = interviews[0] || null
  const defaultMarquee = [entrepreneur.name, entrepreneur.title, 'Маршрут Построен'].filter(Boolean).join(' • ')

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
    heroMarquee: entrepreneur.heroMarquee || defaultMarquee,
    aboutIntroDescription: entrepreneur.aboutIntroDescription || entrepreneur.quote || '',
    aboutMenuItems,
    aboutGalleryImages: aboutGalleryImages.length
      ? aboutGalleryImages
      : [entrepreneur.photo || '/images/placeholder.svg'],
    storySections,
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
    sectionOrder: normalizeEntrepreneurSectionOrder(entrepreneur.sectionOrder, storySections),
    sectionVisibility,
  }
})
