import type { BlogPageData } from '@features/blog/model/blog.types'
import prisma from '~~/lib/prisma'
import { parseSectionOrder, parseSectionVisibility } from '@shared/lib/section-config'
import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'
import { safeJsonParse } from '@server/utils/json'

const BLOG_PAGE_KEYS = [
  'BLOG_PAGE_HERO_TITLE',
  'BLOG_PAGE_POPULAR_TITLE',
  'BLOG_PAGE_MAIN_ONE_TITLE',
  'BLOG_PAGE_MAIN_ONE_TEXT',
  'BLOG_PAGE_MAIN_ONE_IMAGE',
  'BLOG_PAGE_MAIN_ONE_URL',
  'BLOG_PAGE_MAIN_TWO_TITLE',
  'BLOG_PAGE_MAIN_TWO_TEXT',
  'BLOG_PAGE_MAIN_TWO_IMAGE',
  'BLOG_PAGE_MAIN_TWO_URL',
  'BLOG_PAGE_LATEST_COUNT',
  'BLOG_PAGE_LATEST_TITLE',
  'BLOG_PAGE_LATEST_DESCRIPTION',
  'BLOG_PAGE_RELATED_TITLE',
  'BLOG_PAGE_POPULAR_ARTICLE_IDS',
  'BLOG_PAGE_SECTION_ORDER',
  'BLOG_PAGE_SECTION_VISIBILITY',
] as const

const DEFAULT_SECTION_ORDER = ['hero', 'popular', 'mainNews', 'latestNews', 'related', 'cta'] as const

function clampLatestCount(raw: string): number {
  const parsed = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed)) return 8

  return Math.min(20, Math.max(1, parsed))
}

function mapArticleSummary(article: {
  id: string
  slug: string
  title: string
  subtitle: string | null
  category: string | null
  coverImage: string | null
  publishedAt: Date | null
  entrepreneur: {
    slug: string
    name: string
    title: string
    photo: string | null
  } | null
}) {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    subtitle: article.subtitle,
    category: article.category,
    coverImage: article.coverImage,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    entrepreneur: article.entrepreneur,
  }
}

export default defineEventHandler(async (): Promise<BlogPageData> => {
  const [settings, articles, relatedEntrepreneurs, relatedCompanies] = await Promise.all([
    getSiteSettings(BLOG_PAGE_KEYS),
    prisma.article.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
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
    prisma.entrepreneur.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        slug: true,
        name: true,
        title: true,
        photo: true,
        hoverPhoto: true,
      },
    }),
    prisma.business.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        slug: true,
        name: true,
        type: true,
        coverImage: true,
      },
    }),
  ])

  const selectedIds = safeJsonParse<string[]>(
    getSiteSetting(settings, 'BLOG_PAGE_POPULAR_ARTICLE_IDS', '[]'),
    [],
  )
    .map(String)
    .filter((id, index, ids) => id && ids.indexOf(id) === index)

  const selectedArticles = selectedIds
    .map((id) => articles.find((article) => article.id === id))
    .filter((article): article is (typeof articles)[number] => Boolean(article))

  const featuredArticles = [
    ...selectedArticles,
    ...articles.filter((article) => !selectedIds.includes(article.id)),
  ]
    .slice(0, 6)
    .map(mapArticleSummary)

  const latestCount = clampLatestCount(getSiteSetting(settings, 'BLOG_PAGE_LATEST_COUNT', '8'))

  return {
    heroTitle: getSiteSetting(settings, 'BLOG_PAGE_HERO_TITLE', 'Главные\nновости'),
    popularTitle: getSiteSetting(settings, 'BLOG_PAGE_POPULAR_TITLE', 'Популярное'),
    latestTitle: getSiteSetting(settings, 'BLOG_PAGE_LATEST_TITLE', 'Последние новости'),
    latestDescription: getSiteSetting(
      settings,
      'BLOG_PAGE_LATEST_DESCRIPTION',
      'Новости проекта, истории предпринимателей и материалы о компаниях.',
    ),
    relatedTitle: getSiteSetting(settings, 'BLOG_PAGE_RELATED_TITLE', 'Читайте также'),
    mainCards: [
      {
        title: getSiteSetting(settings, 'BLOG_PAGE_MAIN_ONE_TITLE', 'Новый выпуск проекта'),
        text: getSiteSetting(settings, 'BLOG_PAGE_MAIN_ONE_TEXT'),
        image: getSiteSetting(settings, 'BLOG_PAGE_MAIN_ONE_IMAGE'),
        url: getSiteSetting(settings, 'BLOG_PAGE_MAIN_ONE_URL'),
      },
      {
        title: getSiteSetting(settings, 'BLOG_PAGE_MAIN_TWO_TITLE', 'Еще один материал'),
        text: getSiteSetting(settings, 'BLOG_PAGE_MAIN_TWO_TEXT'),
        image: getSiteSetting(settings, 'BLOG_PAGE_MAIN_TWO_IMAGE'),
        url: getSiteSetting(settings, 'BLOG_PAGE_MAIN_TWO_URL'),
      },
    ],
    featuredArticles,
    latestArticles: articles.slice(0, latestCount).map(mapArticleSummary),
    relatedEntrepreneurs,
    relatedCompanies,
    sectionOrder: parseSectionOrder(
      getSiteSetting(settings, 'BLOG_PAGE_SECTION_ORDER'),
      DEFAULT_SECTION_ORDER,
    ),
    sectionVisibility: parseSectionVisibility(
      getSiteSetting(settings, 'BLOG_PAGE_SECTION_VISIBILITY'),
    ),
  }
})
