import type { BlogArticleDetailResponse } from '@features/blog/model/blog.types'
import prisma from '~~/lib/prisma'
import { parseSectionOrder, parseSectionVisibility } from '@shared/lib/section-config'
import { ROUTES } from '@shared/navigation'
import { safeJsonParse } from '@server/utils/json'
import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'
import { sanitizeRichText } from '@server/utils/content-security'

const BLOG_DETAIL_SETTINGS_KEYS = [
  'HOME_BANNER_IMAGE',
  'HOME_BANNER_MOBILE_IMAGE',
  'HOME_BANNER_LINK',
] as const

const DEFAULT_SECTION_ORDER = ['cover', 'content', 'secondary', 'related', 'latest', 'banner'] as const

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

export default defineEventHandler(async (event): Promise<BlogArticleDetailResponse> => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Article slug is required' })
  }

  const article = await prisma.article.findFirst({
    where: { slug, isPublished: true },
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
  })

  if (!article) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  const selections = safeJsonParse<Array<{ type: 'entrepreneur' | 'business'; id: string }>>(
    article.relatedMaterials,
    [],
  ).filter(
    (item) =>
      (item.type === 'entrepreneur' || item.type === 'business')
      && typeof item.id === 'string'
      && item.id.length > 0,
  )

  const entrepreneurIds = selections
    .filter((item) => item.type === 'entrepreneur')
    .map((item) => item.id)
  const businessIds = selections
    .filter((item) => item.type === 'business')
    .map((item) => item.id)

  const [selectedEntrepreneurs, selectedBusinesses, latestArticles, settings] = await Promise.all([
    entrepreneurIds.length
      ? prisma.entrepreneur.findMany({
        where: { id: { in: entrepreneurIds }, isPublished: true },
        select: {
          id: true,
          slug: true,
          name: true,
          title: true,
          photo: true,
          hoverPhoto: true,
        },
      })
      : [],
    businessIds.length
      ? prisma.business.findMany({
        where: { id: { in: businessIds }, isPublished: true },
        select: {
          id: true,
          slug: true,
          name: true,
          type: true,
          coverImage: true,
        },
      })
      : [],
    prisma.article.findMany({
      where: { isPublished: true, id: { not: article.id } },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 5,
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
    getSiteSettings(BLOG_DETAIL_SETTINGS_KEYS),
  ])

  const entrepreneurMap = new Map(selectedEntrepreneurs.map((item) => [item.id, item]))
  const businessMap = new Map(selectedBusinesses.map((item) => [item.id, item]))
  const relatedMaterials: BlogArticleDetailResponse['relatedMaterials'] = []

  selections.forEach((selection) => {
    if (selection.type === 'entrepreneur') {
      const relatedEntrepreneur = entrepreneurMap.get(selection.id)
      if (!relatedEntrepreneur) return

      relatedMaterials.push({
        type: 'entrepreneur' as const,
        slug: relatedEntrepreneur.slug,
        name: relatedEntrepreneur.name,
        title: relatedEntrepreneur.title,
        coverImage: relatedEntrepreneur.photo,
        hoverPhoto: relatedEntrepreneur.hoverPhoto,
      })
      return
    }

    const relatedBusiness = businessMap.get(selection.id)
    if (!relatedBusiness) return

    relatedMaterials.push({
      type: 'business' as const,
      slug: relatedBusiness.slug,
      name: relatedBusiness.name,
      title: relatedBusiness.type,
      coverImage: relatedBusiness.coverImage,
      hoverPhoto: null,
    })
  })

  return {
    article: {
      ...mapArticleSummary(article),
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      coverImageSource: article.coverImageSource,
      content: sanitizeRichText(article.content),
      secondaryImage: article.secondaryImage,
      secondaryImageSource: article.secondaryImageSource,
      secondaryText: article.secondaryText ? sanitizeRichText(article.secondaryText) : null,
      relatedTitle: article.relatedTitle,
      metaTitle: article.metaTitle,
      metaDesc: article.metaDesc,
      sectionOrder: parseSectionOrder(article.sectionOrder, DEFAULT_SECTION_ORDER),
      sectionVisibility: parseSectionVisibility(article.sectionVisibility),
    },
    relatedMaterials,
    latestArticles: latestArticles.map(mapArticleSummary),
    bannerImage: getSiteSetting(settings, 'HOME_BANNER_IMAGE'),
    bannerMobileImage: getSiteSetting(settings, 'HOME_BANNER_MOBILE_IMAGE'),
    bannerLink: getSiteSetting(settings, 'HOME_BANNER_LINK', ROUTES.BLOG),
  }
})
