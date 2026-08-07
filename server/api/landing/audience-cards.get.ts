import prisma from '~~/lib/prisma'

export default defineEventHandler(async () => {
  return await prisma.audienceCard.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
})
