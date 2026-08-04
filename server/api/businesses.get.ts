import prisma from '~~/lib/prisma'

const DEFAULT_BUSINESSES_COUNT = 3
const MAX_BUSINESSES_COUNT = 20

function parseCount(raw: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(raw ?? '', 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(Math.max(parsed, 1), MAX_BUSINESSES_COUNT)
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = parseCount(String(query.limit ?? ''), DEFAULT_BUSINESSES_COUNT)

  const businesses = await prisma.business.findMany({
    where: { isPublished: true },
    select: {
      slug: true,
      name: true,
      type: true,
      coverImage: true,
      description: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return { businesses }
})
