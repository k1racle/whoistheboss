import prisma from '~~/lib/prisma'
import { entrepreneurCityFilter, getRequestedCitySlug } from '@server/utils/presence-city'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const citySlug = getRequestedCitySlug(event)
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug' })
  }

  const reel = await prisma.reel.findFirst({
    where: { slug, isPublished: true, ...(citySlug ? { entrepreneur: entrepreneurCityFilter(citySlug) } : {}) },
    select: {
      slug: true,
    },
  })

  if (!reel) {
    throw createError({ statusCode: 404, statusMessage: 'Reel not found' })
  }

  return reel
})
