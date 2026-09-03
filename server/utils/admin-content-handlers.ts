import type { H3Event } from 'h3'
import prisma from '~~/lib/prisma'
import {
  articleSchema,
  contentOrderSchema,
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
import {
  normalizeArticleContent,
  normalizeFeaturedInterview,
  normalizeInterviewContent,
  normalizeVideoFields,
} from '@server/utils/admin-normalizers'
import { notifyIndexNow } from '@server/utils/index-now'
import { enqueuePublicationEvent } from '@server/utils/shooting-requests'

const entrepreneurSummary = { select: { id: true, name: true } } as const
const citySummary = { select: { id: true, name: true, slug: true } } as const
const entrepreneurCityInclude = {
  cityLinks: { include: { city: citySummary } },
} as const

function singleId(path: readonly string[]): string | undefined {
  if (path.length > 1) throwAdminError(404, 'Not found')
  return path[0]
}

function normalizePublishedAt(value: string | null | undefined): Date | null {
  return value ? new Date(value) : null
}

function assertRecordIsCurrent(expectedUpdatedAt: string | undefined, actualUpdatedAt: Date): void {
  if (expectedUpdatedAt && expectedUpdatedAt !== actualUpdatedAt.toISOString()) {
    throwAdminError(409, 'Запись уже изменена в другой вкладке или другим пользователем. Обновите страницу и повторите изменения.')
  }
}

async function updateVersionedRecord<T>(expectedUpdatedAt: string | undefined, update: () => Promise<T>): Promise<T> {
  try {
    return await update()
  }
  catch (error) {
    if (
      expectedUpdatedAt
      && typeof error === 'object'
      && error !== null
      && 'code' in error
      && error.code === 'P2025'
    ) {
      throwAdminError(409, 'Запись уже изменена в другой вкладке или другим пользователем. Обновите страницу и повторите изменения.')
    }
    throw error
  }
}

export async function handleEntrepreneurs(event: H3Event, path: readonly string[]) {
  if (path.length === 1 && path[0] === 'order') {
    requireAdminMethod(event, ['PUT'])
    const { ids } = await readAdminBody(event, contentOrderSchema)
    const entrepreneurs = await prisma.entrepreneur.findMany({ select: { id: true } })
    const existingIds = new Set(entrepreneurs.map(entrepreneur => entrepreneur.id))

    if (ids.length !== entrepreneurs.length || ids.some(id => !existingIds.has(id))) {
      throwAdminError(400, 'Entrepreneur order must include every entrepreneur exactly once')
    }

    await prisma.$transaction(ids.map((id, sortOrder) => prisma.entrepreneur.update({
      where: { id },
      data: { sortOrder },
    })))

    return { ok: true }
  }

  const id = singleId(path)
  const method = requireAdminMethod(event, id ? ['GET', 'PUT', 'DELETE'] : ['GET', 'POST'])

  if (!id && method === 'GET') {
    return prisma.entrepreneur.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
        { id: 'asc' },
      ],
      include: {
        _count: { select: { interviews: true, reels: true, articles: true } },
        ...entrepreneurCityInclude,
      },
    })
  }

  if (!id && method === 'POST') {
    const { cityIds, expectedUpdatedAt, ...rawData } = await readAdminBody(event, entrepreneurSchema)
    void expectedUpdatedAt
    const data = normalizeFeaturedInterview(rawData)
    const slug = await createUniqueSlug(data.name, async candidate => Boolean(
      await prisma.entrepreneur.findUnique({ where: { slug: candidate }, select: { id: true } }),
    ))
    const lastEntrepreneur = await prisma.entrepreneur.aggregate({
      _max: { sortOrder: true },
    })
    setResponseStatus(event, 201)
    const created = await prisma.entrepreneur.create({
      data: {
        ...data,
        slug,
        sortOrder: (lastEntrepreneur._max.sortOrder ?? -1) + 1,
        cityLinks: { create: cityIds.map(cityId => ({ cityId })) },
      },
      include: entrepreneurCityInclude,
    })
    await notifyIndexNow('entrepreneur', null, created)
    await enqueuePublicationEvent('entrepreneur', null, created)
    return created
  }

  const existing = await prisma.entrepreneur.findUnique({
    where: { id: id! },
    include: entrepreneurCityInclude,
  })
  if (!existing) throwAdminError(404, 'Entrepreneur not found')

  if (method === 'GET') return existing

  if (method === 'DELETE') {
    await prisma.entrepreneur.delete({ where: { id: id! } })
    await notifyIndexNow('entrepreneur', existing, null)
    return { ok: true }
  }

  const { cityIds, expectedUpdatedAt, ...rawData } = await readAdminBody(event, entrepreneurSchema)
  assertRecordIsCurrent(expectedUpdatedAt, existing.updatedAt)
  const data = normalizeFeaturedInterview(rawData)
  const slug = await createUniqueSlug(data.name, async candidate => Boolean(
    await prisma.entrepreneur.findFirst({
      where: { slug: candidate, id: { not: id! } },
      select: { id: true },
    }),
  ))
  const updated = await updateVersionedRecord(expectedUpdatedAt, () => prisma.entrepreneur.update({
    where: {
      id: id!,
      ...(expectedUpdatedAt ? { updatedAt: new Date(expectedUpdatedAt) } : {}),
    },
    data: {
      ...data,
      slug,
      cityLinks: {
        deleteMany: {},
        create: cityIds.map(cityId => ({ cityId })),
      },
    },
    include: entrepreneurCityInclude,
  }))
  await notifyIndexNow('entrepreneur', existing, updated)
  await enqueuePublicationEvent('entrepreneur', existing, updated)
  return updated
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
    const { publishedAt, ...rawData } = await readAdminBody(event, interviewSchema)
    const data = normalizeVideoFields(normalizeInterviewContent(rawData))
    const slug = await createUniqueSlug(data.title, async candidate => Boolean(
      await prisma.interview.findUnique({ where: { slug: candidate }, select: { id: true } }),
    ))
    setResponseStatus(event, 201)
    const created = await prisma.interview.create({
      data: { ...data, slug, publishedAt: normalizePublishedAt(publishedAt) },
      include: { entrepreneur: entrepreneurSummary },
    })
    await notifyIndexNow('interview', null, created)
    await enqueuePublicationEvent('interview', null, created)
    return created
  }

  const existing = await prisma.interview.findUnique({ where: { id: id! } })
  if (!existing) throwAdminError(404, 'Interview not found')

  if (method === 'GET') return existing

  if (method === 'DELETE') {
    await prisma.interview.delete({ where: { id: id! } })
    await notifyIndexNow('interview', existing, null)
    return { ok: true }
  }

  const { publishedAt, ...rawData } = await readAdminBody(event, interviewSchema)
  const data = normalizeVideoFields(normalizeInterviewContent(rawData))
  const slug = await createUniqueSlug(data.title, async candidate => Boolean(
    await prisma.interview.findFirst({
      where: { slug: candidate, id: { not: id! } },
      select: { id: true },
    }),
  ))
  const updated = await prisma.interview.update({
    where: { id: id! },
    data: { ...data, slug, publishedAt: normalizePublishedAt(publishedAt) },
    include: { entrepreneur: entrepreneurSummary },
  })
  await notifyIndexNow('interview', existing, updated)
  await enqueuePublicationEvent('interview', existing, updated)
  return updated
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
    const data = normalizeVideoFields(await readAdminBody(event, reelSchema))
    const slug = await createUniqueSlug(data.title, async candidate => Boolean(
      await prisma.reel.findUnique({ where: { slug: candidate }, select: { id: true } }),
    ))
    setResponseStatus(event, 201)
    const created = await prisma.reel.create({
      data: { ...data, slug },
      include: { entrepreneur: entrepreneurSummary },
    })
    await notifyIndexNow('reel', null, created)
    await enqueuePublicationEvent('reel', null, created)
    return created
  }

  const existing = await prisma.reel.findUnique({ where: { id: id! } })
  if (!existing) throwAdminError(404, 'Reel not found')

  if (method === 'GET') return existing

  if (method === 'DELETE') {
    await prisma.reel.delete({ where: { id: id! } })
    await notifyIndexNow('reel', existing, null)
    return { ok: true }
  }

  const data = normalizeVideoFields(await readAdminBody(event, reelSchema))
  const slug = await createUniqueSlug(data.title, async candidate => Boolean(
    await prisma.reel.findFirst({
      where: { slug: candidate, id: { not: id! } },
      select: { id: true },
    }),
  ))
  const updated = await prisma.reel.update({
    where: { id: id! },
    data: { ...data, slug },
    include: { entrepreneur: entrepreneurSummary },
  })
  await notifyIndexNow('reel', existing, updated)
  await enqueuePublicationEvent('reel', existing, updated)
  return updated
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
    const { publishedAt, expectedUpdatedAt, ...rawData } = await readAdminBody(event, articleSchema)
    void expectedUpdatedAt
    const data = normalizeArticleContent(rawData)
    const slug = await createUniqueSlug(data.title, async candidate => Boolean(
      await prisma.article.findUnique({ where: { slug: candidate }, select: { id: true } }),
    ))
    setResponseStatus(event, 201)
    const created = await prisma.article.create({
      data: { ...data, slug, publishedAt: normalizePublishedAt(publishedAt) },
      include: { entrepreneur: entrepreneurSummary },
    })
    await notifyIndexNow('article', null, created)
    await enqueuePublicationEvent('article', null, created)
    return created
  }

  const existing = await prisma.article.findUnique({ where: { id: id! } })
  if (!existing) throwAdminError(404, 'Article not found')

  if (method === 'GET') return existing

  if (method === 'DELETE') {
    await prisma.article.delete({ where: { id: id! } })
    await notifyIndexNow('article', existing, null)
    return { ok: true }
  }

  const { publishedAt, expectedUpdatedAt, ...rawData } = await readAdminBody(event, articleSchema)
  assertRecordIsCurrent(expectedUpdatedAt, existing.updatedAt)
  const data = normalizeArticleContent(rawData)
  const slug = await createUniqueSlug(data.title, async candidate => Boolean(
    await prisma.article.findFirst({
      where: { slug: candidate, id: { not: id! } },
      select: { id: true },
    }),
  ))
  const updated = await updateVersionedRecord(expectedUpdatedAt, () => prisma.article.update({
    where: {
      id: id!,
      ...(expectedUpdatedAt ? { updatedAt: new Date(expectedUpdatedAt) } : {}),
    },
    data: { ...data, slug, publishedAt: normalizePublishedAt(publishedAt) },
    include: { entrepreneur: entrepreneurSummary },
  }))
  await notifyIndexNow('article', existing, updated)
  await enqueuePublicationEvent('article', existing, updated)
  return updated
}

export async function handleBusinesses(event: H3Event, path: readonly string[]) {
  if (path.length === 1 && path[0] === 'order') {
    requireAdminMethod(event, ['PUT'])
    const { ids } = await readAdminBody(event, contentOrderSchema)
    const businesses = await prisma.business.findMany({ select: { id: true } })
    const existingIds = new Set(businesses.map(business => business.id))

    if (ids.length !== businesses.length || ids.some(id => !existingIds.has(id))) {
      throwAdminError(400, 'Business order must include every business exactly once')
    }

    await prisma.$transaction(ids.map((id, placesSortOrder) => prisma.business.update({
      where: { id },
      data: { placesSortOrder },
    })))

    return { ok: true }
  }

  const id = singleId(path)
  const method = requireAdminMethod(event, id ? ['GET', 'PUT', 'DELETE'] : ['GET', 'POST'])

  if (!id && method === 'GET') {
    return prisma.business.findMany({
      orderBy: [
        { placesSortOrder: 'asc' },
        { createdAt: 'desc' },
        { id: 'asc' },
      ],
      include: { entrepreneur: entrepreneurSummary, presenceCity: citySummary },
    })
  }

  if (id && method === 'GET') {
    const item = await prisma.business.findUnique({
      where: { id },
      include: { entrepreneur: entrepreneurSummary, presenceCity: citySummary },
    })
    if (!item) throwAdminError(404, 'Not found')
    return item
  }

  if (id && method === 'DELETE') {
    const existing = await prisma.business.findUnique({ where: { id } })
    if (!existing) throwAdminError(404, 'Business not found')
    await prisma.business.delete({ where: { id } })
    await notifyIndexNow('company', existing, null)
    return { ok: true }
  }

  const { expectedUpdatedAt, ...data } = await readAdminBody(event, businessSchema)
  if (id) {
    const existing = await prisma.business.findUnique({ where: { id }, select: { updatedAt: true } })
    if (!existing) throwAdminError(404, 'Business not found')
    assertRecordIsCurrent(expectedUpdatedAt, existing.updatedAt)
  }
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
    const lastBusiness = await prisma.business.aggregate({
      _max: { placesSortOrder: true },
    })
    setResponseStatus(event, 201)
    const created = await prisma.business.create({
      data: {
        ...normalized,
        placesSortOrder: (lastBusiness._max.placesSortOrder ?? -1) + 1,
      },
      include: { entrepreneur: entrepreneurSummary, presenceCity: citySummary },
    })
    await notifyIndexNow('company', null, created)
    await enqueuePublicationEvent('business', null, created)
    return created
  }

  const previous = await prisma.business.findUnique({ where: { id } })
  const updated = await updateVersionedRecord(expectedUpdatedAt, () => prisma.business.update({
    where: {
      id,
      ...(expectedUpdatedAt ? { updatedAt: new Date(expectedUpdatedAt) } : {}),
    },
    data: normalized,
    include: { entrepreneur: entrepreneurSummary, presenceCity: citySummary },
  }))
  await notifyIndexNow('company', previous, updated)
  await enqueuePublicationEvent('business', previous, updated)
  return updated
}
