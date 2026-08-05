import prisma from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug' })
  }

  const reel = await prisma.reel.findFirst({
    where: { slug, isPublished: true },
    select: {
      slug: true,
    },
  })

  if (!reel) {
    throw createError({ statusCode: 404, statusMessage: 'Reel not found' })
  }

  return reel
})
