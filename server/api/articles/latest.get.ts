import prisma from '~~/lib/prisma'

const DEFAULT_LATEST_NEWS_COUNT = 6
const MAX_LATEST_NEWS_COUNT = 20

function parseCount(raw: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(raw ?? '', 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(Math.max(parsed, 1), MAX_LATEST_NEWS_COUNT)
}

function parseSkip(raw: string | undefined): number {
  const parsed = Number.parseInt(raw ?? '', 10)
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const setting = await prisma.siteSetting.findUnique({
    where: { key: 'HOME_LATEST_NEWS_COUNT' },
    select: { value: true },
  })
  const configuredCount = parseCount(setting?.value ?? '', DEFAULT_LATEST_NEWS_COUNT)
  const limit = parseCount(String(query.limit ?? ''), configuredCount)
  const skip = parseSkip(String(query.skip ?? ''))

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { isPublished: true },
      include: { entrepreneur: { select: { name: true } } },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.article.count({ where: { isPublished: true } }),
  ])

  return {
    articles: articles.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      subtitle: article.subtitle,
      entrepreneurName: article.entrepreneur?.name ?? null,
      coverImage: article.coverImage,
    })),
    hasMore: skip + articles.length < total,
  }
})
