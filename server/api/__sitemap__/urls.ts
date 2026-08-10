import type { SitemapUrlInput } from '#sitemap/types'
import prisma from '~~/lib/prisma'

function imageEntry(image: string | null, title: string) {
  return image ? [{ loc: image, title }] : undefined
}

export default defineSitemapEventHandler(async () => {
  const [entrepreneurs, companies, articles, interviews] = await Promise.all([
    prisma.entrepreneur.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        name: true,
        photo: true,
        updatedAt: true,
      },
    }),
    prisma.business.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        name: true,
        coverImage: true,
        updatedAt: true,
      },
    }),
    prisma.article.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        title: true,
        coverImage: true,
        updatedAt: true,
      },
    }),
    prisma.interview.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        title: true,
        coverImage: true,
        updatedAt: true,
      },
    }),
  ])

  return [
    ...entrepreneurs.map(item => ({
      loc: `/entrepreneurs/${item.slug}`,
      lastmod: item.updatedAt,
      images: imageEntry(item.photo, item.name),
    } satisfies SitemapUrlInput)),
    ...companies.map(item => ({
      loc: `/companies/${item.slug}`,
      lastmod: item.updatedAt,
      images: imageEntry(item.coverImage, item.name),
    } satisfies SitemapUrlInput)),
    ...articles.map(item => ({
      loc: `/blog/${item.slug}`,
      lastmod: item.updatedAt,
      images: imageEntry(item.coverImage, item.title),
    } satisfies SitemapUrlInput)),
    ...interviews.map(item => ({
      loc: `/interviews/${item.slug}`,
      lastmod: item.updatedAt,
      images: imageEntry(item.coverImage, item.title),
    } satisfies SitemapUrlInput)),
  ]
})
