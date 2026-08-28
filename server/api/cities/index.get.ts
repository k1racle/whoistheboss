import type { PresenceCity } from '@shared/types/city'
import prisma from '~~/lib/prisma'

export default defineEventHandler(async (): Promise<PresenceCity[]> => {
  return prisma.city.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true },
  })
})
