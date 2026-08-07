import type { H3Event } from 'h3'
import prisma from '~~/lib/prisma'
import {
  articleSchema,
  businessSchema,
  entrepreneurSchema,
  interviewSchema,
  reelSchema,
} from '@server/utils/admin-schemas'
import {
  createUniqueSlug,
  readAdminBody,
  requireAdminMethod,
  throwAdminError,
} from '@server/utils/admin-api'

const entrepreneurSummary = { select: { id: true, name: true } } as const

function singleId(path: readonly string[]): string | undefined {
  if (path.length > 1) throwAdminError(404, 'Not found')
  return path[0]
}

function normalizePublishedAt(value: string | null | undefined): Date | null {
  return value ? new Date(value) : null
}

export async function handleEntrepreneurs(event: H3Event, path: readonly string[]) {
  const id = singleId(path)
  const method = requireAdminMethod(event, id ? ['GET', 'PUT', 'DELETE'] : ['GET', 'POST'])

  if (!id && method === 'GET') {
    return prisma.entrepreneur.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { interviews: true, reels: true, articles: true } },
      },
    })
  }

  if (!id && method === 'POST') {
    const data = await readAdminBody(event, entrepreneurSchema)
    const slug = await createUniqueSlug(data.name, async candidate => Boolean(
      await prisma.entrepreneur.findUnique({ where: { slug: candidate }, select: { id: true } }),
    ))
    setResponseStatus(event, 201)
    return prisma.entrepreneur.create({ data: { ...data, slug } })
  }

  const existing = await prisma.entrepreneur.findUnique({ where: { id: id! } })
  if (!existing) throwAdminError(404, 'Entrepreneur not found')

  if (method === 'GET') return existing

  if (method === 'DELETE') {
    await prisma.entrepreneur.delete({ where: { id: id! } })
    return { ok: true }
  }

  const data = await readAdminBody(event, entrepreneurSchema)
  const slug = await createUniqueSlug(data.name, async candidate => Boolean(
    await prisma.entrepreneur.findFirst({
      where: { slug: candidate, id: { not: id! } },
      select: { id: true },
    }),
  ))
  return prisma.entrepreneur.update({ where: { id: id! }, data: { ...data, slug } })
}

export async function handleInterviews(event: H3Event, path: readonly string[]) {
  const id = singleId(path)
  const method = requireAdminMethod(event, id ? ['GET', 'PUT', 'DELETE'] : ['GET', 'POST'])

  if (!id && method === 'GET') {
    return prisma.interview.findMany({
      orderBy: { createdAt: 'desc' },
      include: { entrepreneur: entrepreneurSummary },
    })
  }

  if (!id && method === 'POST') {
    const { publishedAt, ...data } = await readAdminBody(event, interviewSchema)
    const slug = await createUniqueSlug(data.title, async candidate => Boolean(
      await prisma.interview.findUnique({ where: { slug: candidate }, select: { id: true } }),
    ))
    setResponseStatus(event, 201)
    return prisma.interview.create({
      data: { ...data, slug, publishedAt: normalizePublishedAt(publishedAt) },
      include: { entrepreneur: entrepreneurSummary },
    })
  }

  const existing = await prisma.interview.findUnique({ where: { id: id! } })
  if (!existing) throwAdminError(404, 'Interview not found')

  if (method === 'GET') return existing

  if (method === 'DELETE') {
    await prisma.interview.delete({ where: { id: id! } })
    return { ok: true }
  }

  const { publishedAt, ...data } = await readAdminBody(event, interviewSchema)
  const slug = await createUniqueSlug(data.title, async candidate => Boolean(
    await prisma.interview.findFirst({
      where: { slug: candidate, id: { not: id! } },
      select: { id: true },
    }),
  ))
  return prisma.interview.update({
    where: { id: id! },
    data: { ...data, slug, publishedAt: normalizePublishedAt(publishedAt) },
    include: { entrepreneur: entrepreneurSummary },
  })
}

export async function handleReels(event: H3Event, path: readonly string[]) {
  const id = singleId(path)
  const method = requireAdminMethod(event, id ? ['GET', 'PUT', 'DELETE'] : ['GET', 'POST'])

  if (!id && method === 'GET') {
    return prisma.reel.findMany({
      orderBy: { createdAt: 'desc' },
      include: { entrepreneur: entrepreneurSummary },
    })
  }

  if (!id && method === 'POST') {
    const data = await readAdminBody(event, reelSchema)
    const slug = await createUniqueSlug(data.title, async candidate => Boolean(
      await prisma.reel.findUnique({ where: { slug: candidate }, select: { id: true } }),
    ))
    setResponseStatus(event, 201)
    return prisma.reel.create({
      data: { ...data, slug },
      include: { entrepreneur: entrepreneurSummary },
    })
  }

  const existing = await prisma.reel.findUnique({ where: { id: id! } })
  if (!existing) throwAdminError(404, 'Reel not found')

  if (method === 'GET') return existing

  if (method === 'DELETE') {
    await prisma.reel.delete({ where: { id: id! } })
    return { ok: true }
  }

  const data = await readAdminBody(event, reelSchema)
  const slug = await createUniqueSlug(data.title, async candidate => Boolean(
    await prisma.reel.findFirst({
      where: { slug: candidate, id: { not: id! } },
      select: { id: true },
    }),
  ))
  return prisma.reel.update({
    where: { id: id! },
    data: { ...data, slug },
    include: { entrepreneur: entrepreneurSummary },
  })
}

export async function handleArticles(event: H3Event, path: readonly string[]) {
  const id = singleId(path)
  const method = requireAdminMethod(event, id ? ['GET', 'PUT', 'DELETE'] : ['GET', 'POST'])

  if (!id && method === 'GET') {
    return prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      include: { entrepreneur: entrepreneurSummary },
    })
  }

  if (!id && method === 'POST') {
    const { publishedAt, ...data } = await readAdminBody(event, articleSchema)
    const slug = await createUniqueSlug(data.title, async candidate => Boolean(
      await prisma.article.findUnique({ where: { slug: candidate }, select: { id: true } }),
    ))
    setResponseStatus(event, 201)
    return prisma.article.create({
      data: { ...data, slug, publishedAt: normalizePublishedAt(publishedAt) },
      include: { entrepreneur: entrepreneurSummary },
    })
  }

  const existing = await prisma.article.findUnique({ where: { id: id! } })
  if (!existing) throwAdminError(404, 'Article not found')

  if (method === 'GET') return existing

  if (method === 'DELETE') {
    await prisma.article.delete({ where: { id: id! } })
    return { ok: true }
  }

  const { publishedAt, ...data } = await readAdminBody(event, articleSchema)
  const slug = await createUniqueSlug(data.title, async candidate => Boolean(
    await prisma.article.findFirst({
      where: { slug: candidate, id: { not: id! } },
      select: { id: true },
    }),
  ))
  return prisma.article.update({
    where: { id: id! },
    data: { ...data, slug, publishedAt: normalizePublishedAt(publishedAt) },
    include: { entrepreneur: entrepreneurSummary },
  })
}

export async function handleBusinesses(event: H3Event, path: readonly string[]) {
  const id = singleId(path)
  const method = requireAdminMethod(event, id ? ['GET', 'PUT', 'DELETE'] : ['GET', 'POST'])

  if (!id && method === 'GET') {
    return prisma.business.findMany({
      orderBy: { createdAt: 'desc' },
      include: { entrepreneur: entrepreneurSummary },
    })
  }

  if (id && method === 'GET') {
    const item = await prisma.business.findUnique({
      where: { id },
      include: { entrepreneur: entrepreneurSummary },
    })
    if (!item) throwAdminError(404, 'Not found')
    return item
  }

  if (id && method === 'DELETE') {
    await prisma.business.delete({ where: { id } })
    return { ok: true }
  }

  const data = await readAdminBody(event, businessSchema)
  const slug = await createUniqueSlug(data.name, async candidate => Boolean(
    await prisma.business.findFirst({
      where: { slug: candidate, ...(id ? { id: { not: id } } : {}) },
      select: { id: true },
    }),
  ))
  const normalized = {
    ...data,
    slug,
    email: data.email || null,
    website: data.website || null,
    coverImage: data.coverImage || null,
  }

  if (!id) {
    setResponseStatus(event, 201)
    return prisma.business.create({
      data: normalized,
      include: { entrepreneur: entrepreneurSummary },
    })
  }

  return prisma.business.update({
    where: { id },
    data: normalized,
    include: { entrepreneur: entrepreneurSummary },
  })
}
