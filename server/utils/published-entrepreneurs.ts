import prisma from '~~/lib/prisma'

export function getPublishedEntrepreneurs() {
  return prisma.entrepreneur.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    select: {
      slug: true,
      name: true,
      title: true,
      photo: true,
      hoverPhoto: true,
      quote: true,
    },
  })
}
