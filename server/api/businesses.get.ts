import { z } from 'zod'
import prisma from '~~/lib/prisma'
import { stripHtml } from '../utils/stripHtml'
import { businessCityFilter } from '@server/utils/presence-city'

const DEFAULT_BUSINESSES_COUNT = 3
const MAX_BUSINESSES_COUNT = 20

const businessesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(MAX_BUSINESSES_COUNT).default(DEFAULT_BUSINESSES_COUNT),
  offset: z.coerce.number().int().min(0).default(0),
  city: z.string().trim().toLowerCase().max(24).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
})

export default defineEventHandler(async (event) => {
  const { limit, offset, city } = await getValidatedQuery(
    event,
    query => businessesQuerySchema.parse(query),
  )

  const businesses = await prisma.business.findMany({
    where: { isPublished: true, ...businessCityFilter(city) },
    select: {
      slug: true,
      name: true,
      type: true,
      coverImage: true,
      description: true,
    },
    orderBy: [
      { placesSortOrder: 'asc' },
      { createdAt: 'desc' },
      { id: 'asc' },
    ],
    skip: offset,
    take: limit + 1,
  })

  const hasMore = businesses.length > limit
  const visibleBusinesses = businesses.slice(0, limit)

  return {
    businesses: visibleBusinesses.map((business) => ({
      slug: business.slug,
      name: business.name,
      type: business.type,
      coverImage: business.coverImage,
      description: stripHtml(business.description),
    })),
    pagination: {
      limit,
      offset,
      hasMore,
      nextOffset: hasMore ? offset + limit : null,
    },
  }
})
