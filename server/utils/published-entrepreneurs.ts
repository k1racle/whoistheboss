import prisma from '~~/lib/prisma'
import { entrepreneurCityFilter } from '@server/utils/presence-city'

export function getPublishedEntrepreneurs(take?: number, citySlug?: string) {
  return prisma.entrepreneur.findMany({
    where: { isPublished: true, ...entrepreneurCityFilter(citySlug) },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' },
      { id: 'asc' },
    ],
    select: {
      slug: true,
      name: true,
      title: true,
      photo: true,
      hoverPhoto: true,
      quote: true,
    },
    take,
  })
}
