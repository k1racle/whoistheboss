import prisma from '~~/lib/prisma'

const knownHeaderAliases: Record<string, string> = {
  krasnodar: 'krd',
  'краснодар': 'krd',
  sochi: 'sochi',
  'сочи': 'sochi',
}

function normalizeHeaderValue(value: string | undefined): string {
  if (!value) return ''
  try {
    return decodeURIComponent(value).trim().toLocaleLowerCase('ru-RU')
  }
  catch {
    return value.trim().toLocaleLowerCase('ru-RU')
  }
}

export default defineEventHandler(async (event) => {
  const detectedName = [
    getHeader(event, 'cf-ipcity'),
    getHeader(event, 'x-vercel-ip-city'),
    getHeader(event, 'x-geo-city'),
  ].map(normalizeHeaderValue).find(Boolean)

  if (!detectedName) return null

  const aliasSlug = knownHeaderAliases[detectedName]
  return prisma.city.findFirst({
    where: aliasSlug
      ? { slug: aliasSlug }
      : {
          OR: [
            { slug: detectedName },
            { name: { equals: detectedName, mode: 'insensitive' } },
          ],
        },
    select: { id: true, name: true, slug: true },
  })
})
