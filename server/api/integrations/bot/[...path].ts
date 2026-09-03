import { z } from 'zod'
import type { Prisma } from '@prisma/client'
import prisma from '~~/lib/prisma'
import { authenticateBotApi, parseBotJsonBody } from '@server/utils/bot-api-auth'
import {
  addShootingRequestActivity,
  createShootingRequest,
  enqueueRequestEvent,
} from '@server/utils/shooting-requests'

const requestStatuses = ['NEW', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'] as const
const requestSources = ['WEBSITE', 'TELEGRAM', 'MAX'] as const
const botPlatforms = ['TELEGRAM', 'MAX'] as const
const activityTypes = [
  'COMMENT',
  'MESSAGE_FROM_USER',
  'MESSAGE_TO_USER',
  'REMINDER_SET',
] as const
const contentKinds = ['latest', 'entrepreneurs', 'businesses', 'articles', 'interviews', 'reels'] as const

const createRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).optional().default(''),
  position: z.string().trim().max(160).optional().default(''),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().max(254).optional().or(z.literal('')).default(''),
  message: z.string().trim().max(4000).optional().default(''),
  source: z.enum(requestSources),
  externalUserId: z.string().trim().min(1).max(128),
  externalChatId: z.string().trim().min(1).max(128),
  externalRequestKey: z.string().trim().min(8).max(255),
  campaign: z.string().trim().max(120).optional().default(''),
  consentAt: z.coerce.date(),
})

const actorSchema = z.object({
  key: z.string().trim().max(128).optional().nullable(),
  name: z.string().trim().max(160).optional().nullable(),
}).optional()

const updateRequestSchema = z.object({
  status: z.enum(requestStatuses).optional(),
  assignedAdminKey: z.string().trim().max(128).optional().nullable(),
  assignedAdminName: z.string().trim().max(160).optional().nullable(),
  nextContactAt: z.coerce.date().optional().nullable(),
  actor: actorSchema,
}).refine(value => Object.keys(value).some(key => key !== 'actor'), 'No changes supplied')

const activitySchema = z.object({
  type: z.enum(activityTypes),
  body: z.string().trim().min(1).max(4000),
  actor: actorSchema,
})

const linkRequestSchema = z.object({
  requestNumber: z.string().trim().min(8).max(40),
  phone: z.string().trim().min(5).max(40),
  platform: z.enum(botPlatforms),
  externalUserId: z.string().trim().min(1).max(128),
  externalChatId: z.string().trim().min(1).max(128),
})

function phoneDigits(value: string | null | undefined): string {
  return String(value || '').replace(/\D/g, '')
}

function parsePositiveInt(value: unknown, fallback: number, maximum: number): number {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), maximum) : fallback
}

function parseDate(value: unknown): Date | undefined {
  if (!value) return undefined
  const parsed = new Date(String(value))
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

function parseJson<T>(schema: z.ZodType<T>, rawBody: Buffer): T {
  const parsed = schema.safeParse(parseBotJsonBody(rawBody))
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid bot API input',
      data: { issues: parsed.error.issues },
    })
  }
  return parsed.data
}

function requestInclude() {
  return { activities: { orderBy: { createdAt: 'asc' as const }, take: 200 } }
}

async function handleEvents(event: Parameters<typeof getQuery>[0]) {
  if (event.method !== 'GET') throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  const query = getQuery(event)
  const after = parsePositiveInt(query.after, 0, Number.MAX_SAFE_INTEGER)
  const limit = parsePositiveInt(query.limit, 100, 250) || 100
  const events = await prisma.botOutboxEvent.findMany({
    where: { id: { gt: after } },
    orderBy: { id: 'asc' },
    take: limit,
  })
  return {
    events: events.map(item => ({ ...item, createdAt: item.createdAt.toISOString() })),
    nextCursor: events.at(-1)?.id ?? after,
  }
}

async function handleRequests(event: Parameters<typeof getQuery>[0], path: string[], rawBody: Buffer) {
  const query = getQuery(event)

  if (path.length === 0 && event.method === 'GET') {
    const status = requestStatuses.includes(query.status as typeof requestStatuses[number])
      ? query.status as typeof requestStatuses[number]
      : undefined
    const source = requestSources.includes(query.source as typeof requestSources[number])
      ? query.source as typeof requestSources[number]
      : undefined
    const search = String(query.q ?? '').trim().slice(0, 120)
    const externalUserId = String(query.externalUserId ?? '').trim().slice(0, 128)
    const externalPlatform = botPlatforms.includes(query.externalPlatform as typeof botPlatforms[number])
      ? query.externalPlatform as typeof botPlatforms[number]
      : undefined
    const assignedAdminKey = String(query.assignedAdminKey ?? '').trim().slice(0, 128)
    const dueBefore = parseDate(query.dueBefore)
    const limit = parsePositiveInt(query.limit, 30, 100) || 30
    const offset = parsePositiveInt(query.offset, 0, 100000)
    const where: Prisma.ShootingRequestWhereInput = {
      ...(status ? { status } : {}),
      ...(source ? { source } : {}),
      ...(externalUserId ? { externalUserId } : {}),
      ...(externalPlatform ? { externalPlatform } : {}),
      ...(assignedAdminKey ? { assignedAdminKey } : {}),
      ...(dueBefore ? { nextContactAt: { lte: dueBefore }, status: { in: ['NEW', 'IN_PROGRESS'] } } : {}),
      ...(search ? {
        OR: [
          { requestNumber: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
          { company: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      } : {}),
    }
    const [items, total] = await prisma.$transaction([
      prisma.shootingRequest.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.shootingRequest.count({ where }),
    ])
    return { items, pagination: { limit, offset, total, hasMore: offset + items.length < total } }
  }

  if (path.length === 0 && event.method === 'POST') {
    const input = parseJson(createRequestSchema, rawBody)
    const result = await createShootingRequest(input)
    setResponseStatus(event, result.created ? 201 : 200)
    return result
  }

  if (path.length === 1 && path[0] === 'link' && event.method === 'POST') {
    const input = parseJson(linkRequestSchema, rawBody)
    const existing = await prisma.shootingRequest.findUnique({ where: { requestNumber: input.requestNumber } })
    const suppliedPhone = phoneDigits(input.phone)
    if (!existing || suppliedPhone.length < 5 || phoneDigits(existing.phone) !== suppliedPhone) {
      throw createError({ statusCode: 404, statusMessage: 'Request and phone do not match' })
    }
    if (existing.externalUserId && (
      existing.externalUserId !== input.externalUserId || existing.externalPlatform !== input.platform
    )) {
      throw createError({ statusCode: 409, statusMessage: 'Request is already linked to another account' })
    }
    const updated = await prisma.shootingRequest.update({
      where: { id: existing.id },
      data: {
        externalPlatform: input.platform,
        externalUserId: input.externalUserId,
        externalChatId: input.externalChatId,
      },
    })
    await addShootingRequestActivity({
      requestId: existing.id,
      type: 'COMMENT',
      body: `Заявка привязана к ${input.platform}`,
      actor: { key: input.externalUserId, name: existing.name },
    })
    await enqueueRequestEvent('request.linked', existing.id)
    return updated
  }

  const [id, action] = path
  if (!id) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  const existing = await prisma.shootingRequest.findUnique({ where: { id }, include: requestInclude() })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Request not found' })

  if (path.length === 1 && event.method === 'GET') return existing

  if (path.length === 1 && event.method === 'PATCH') {
    const input = parseJson(updateRequestSchema, rawBody)
    const changes = {
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.assignedAdminKey !== undefined ? { assignedAdminKey: input.assignedAdminKey || null } : {}),
      ...(input.assignedAdminName !== undefined ? { assignedAdminName: input.assignedAdminName || null } : {}),
      ...(input.nextContactAt !== undefined ? { nextContactAt: input.nextContactAt } : {}),
    }
    const updated = await prisma.$transaction(async (tx) => {
      const request = await tx.shootingRequest.update({ where: { id }, data: changes })
      if (input.status && input.status !== existing.status) {
        await tx.shootingRequestActivity.create({
          data: {
            requestId: id,
            type: 'STATUS_CHANGED',
            actorKey: input.actor?.key || null,
            actorName: input.actor?.name || null,
            fromStatus: existing.status,
            toStatus: input.status,
          },
        })
      }
      if (input.assignedAdminKey !== undefined && input.assignedAdminKey !== existing.assignedAdminKey) {
        await tx.shootingRequestActivity.create({
          data: {
            requestId: id,
            type: 'ASSIGNED',
            body: input.assignedAdminName || 'Ответственный снят',
            actorKey: input.actor?.key || null,
            actorName: input.actor?.name || null,
          },
        })
      }
      if (input.nextContactAt !== undefined) {
        await tx.shootingRequestActivity.create({
          data: {
            requestId: id,
            type: 'REMINDER_SET',
            body: input.nextContactAt?.toISOString() || 'Напоминание снято',
            actorKey: input.actor?.key || null,
            actorName: input.actor?.name || null,
          },
        })
      }
      return request
    })
    await enqueueRequestEvent(input.status && input.status !== existing.status ? 'request.status_changed' : 'request.updated', id)
    return updated
  }

  if (action === 'activities' && path.length === 2 && event.method === 'GET') {
    return existing.activities
  }
  if (action === 'activities' && path.length === 2 && event.method === 'POST') {
    const input = parseJson(activitySchema, rawBody)
    const activity = await addShootingRequestActivity({ requestId: id, ...input })
    await enqueueRequestEvent(`request.activity.${input.type.toLowerCase()}`, id)
    setResponseStatus(event, 201)
    return activity
  }

  if (action === 'cancel' && path.length === 2 && event.method === 'POST') {
    if (existing.status !== 'NEW') {
      throw createError({ statusCode: 409, statusMessage: 'Only a new request can be cancelled by its author' })
    }
    const input = parseJson(z.object({ source: z.enum(requestSources), externalUserId: z.string().min(1).max(128) }), rawBody)
    if (existing.externalPlatform !== input.source || existing.externalUserId !== input.externalUserId) {
      throw createError({ statusCode: 403, statusMessage: 'Request owner mismatch' })
    }
    const updated = await prisma.shootingRequest.update({ where: { id }, data: { status: 'ARCHIVED' } })
    await addShootingRequestActivity({
      requestId: id,
      type: 'USER_CANCELLED',
      actor: { key: input.externalUserId, name: existing.name },
      fromStatus: existing.status,
      toStatus: 'ARCHIVED',
    })
    await enqueueRequestEvent('request.user_cancelled', id)
    return updated
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
}

type ContentKind = Exclude<typeof contentKinds[number], 'latest'>

function contentItem(kind: ContentKind, item: Record<string, unknown>) {
  const title = String(item.title || item.name || '')
  const slug = String(item.slug || '')
  const pathRoots: Record<ContentKind, string> = {
    entrepreneurs: '/entrepreneurs/',
    businesses: '/companies/',
    articles: '/blog/',
    interviews: '/interviews/',
    reels: '/reels/',
  }
  return {
    id: String(item.id || slug),
    kind,
    slug,
    title,
    subtitle: item.subtitle || item.description || item.type || null,
    image: item.coverImage || item.photo || null,
    path: `${pathRoots[kind]}${slug}`,
    publishedAt: item.publishedAt || item.createdAt || null,
    city: item.city || null,
  }
}

async function contentRows(kind: ContentKind, limit: number, offset: number, city: string) {
  if (kind === 'entrepreneurs') {
    const rows = await prisma.entrepreneur.findMany({
      where: { isPublished: true, ...(city ? { cityLinks: { some: { city: { slug: city } } } } : {}) },
      select: { id: true, slug: true, name: true, title: true, photo: true, createdAt: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }], skip: offset, take: limit,
    })
    return rows.map(row => contentItem(kind, row))
  }
  if (kind === 'businesses') {
    const rows = await prisma.business.findMany({
      where: { isPublished: true, ...(city ? { presenceCity: { slug: city } } : {}) },
      select: { id: true, slug: true, name: true, type: true, coverImage: true, createdAt: true, city: true },
      orderBy: [{ placesSortOrder: 'asc' }, { createdAt: 'desc' }], skip: offset, take: limit,
    })
    return rows.map(row => contentItem(kind, row))
  }
  if (kind === 'articles') {
    const rows = await prisma.article.findMany({
      where: { isPublished: true, ...(city ? { entrepreneur: { cityLinks: { some: { city: { slug: city } } } } } : {}) },
      select: { id: true, slug: true, title: true, subtitle: true, coverImage: true, publishedAt: true, createdAt: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }], skip: offset, take: limit,
    })
    return rows.map(row => contentItem(kind, row))
  }
  if (kind === 'interviews') {
    const rows = await prisma.interview.findMany({
      where: { isPublished: true, ...(city ? { entrepreneur: { cityLinks: { some: { city: { slug: city } } } } } : {}) },
      select: { id: true, slug: true, title: true, subtitle: true, coverImage: true, publishedAt: true, createdAt: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }], skip: offset, take: limit,
    })
    return rows.map(row => contentItem(kind, row))
  }
  const rows = await prisma.reel.findMany({
    where: { isPublished: true, ...(city ? { entrepreneur: { cityLinks: { some: { city: { slug: city } } } } } : {}) },
    select: { id: true, slug: true, title: true, description: true, coverImage: true, createdAt: true },
    orderBy: { createdAt: 'desc' }, skip: offset, take: limit,
  })
  return rows.map(row => contentItem(kind, row))
}

async function handleContent(event: Parameters<typeof getQuery>[0], path: string[]) {
  if (event.method !== 'GET' || path.length !== 1) throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  const kind = path[0] as typeof contentKinds[number]
  if (!contentKinds.includes(kind)) throw createError({ statusCode: 404, statusMessage: 'Unknown content kind' })
  const query = getQuery(event)
  const limit = parsePositiveInt(query.limit, 8, 20) || 8
  const offset = parsePositiveInt(query.offset, 0, 100000)
  const city = String(query.city ?? '').trim().toLowerCase().slice(0, 64)
  if (kind === 'latest') {
    const groups = await Promise.all(
      (contentKinds.filter(item => item !== 'latest') as ContentKind[]).map(item => contentRows(item, limit, 0, city)),
    )
    const items = groups.flat().sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt))).slice(offset, offset + limit)
    return { items, pagination: { limit, offset, hasMore: groups.flat().length > offset + items.length } }
  }
  const rows = await contentRows(kind, limit + 1, offset, city)
  return { items: rows.slice(0, limit), pagination: { limit, offset, hasMore: rows.length > limit } }
}

async function handleCities(event: Parameters<typeof getQuery>[0]) {
  if (event.method !== 'GET') throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  return prisma.city.findMany({
    where: { OR: [{ businesses: { some: { isPublished: true } } }, { entrepreneurLinks: { some: { entrepreneur: { isPublished: true } } } }] },
    select: { slug: true, name: true },
    orderBy: { name: 'asc' },
  })
}

async function handleDeleteUserData(event: Parameters<typeof getQuery>[0], path: string[]) {
  if (event.method !== 'DELETE' || path.length !== 2) throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  const [platform, externalUserId] = path
  if (!botPlatforms.includes(platform as typeof botPlatforms[number])) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid platform' })
  }
  const requests = await prisma.shootingRequest.findMany({
    where: { externalPlatform: platform as 'TELEGRAM' | 'MAX', externalUserId },
    select: { id: true },
  })
  await prisma.shootingRequest.updateMany({
    where: { externalPlatform: platform as 'TELEGRAM' | 'MAX', externalUserId },
    data: {
      name: 'Удалено пользователем', company: null, position: null, phone: null, email: null,
      message: null, externalPlatform: null, externalUserId: null, externalChatId: null, externalRequestKey: null,
      consentAt: null, status: 'ARCHIVED',
    },
  })
  await prisma.shootingRequestActivity.updateMany({
    where: { requestId: { in: requests.map(request => request.id) } },
    data: { body: null, actorKey: null, actorName: null },
  })
  for (const request of requests) await enqueueRequestEvent('request.anonymized', request.id)
  return { ok: true, affected: requests.length }
}

function csvCell(value: unknown): string {
  let text = value instanceof Date ? value.toISOString() : String(value ?? '')
  if (/^[=+\-@]/.test(text)) text = `'${text}`
  return `"${text.replaceAll('"', '""')}"`
}

async function handleExports(event: Parameters<typeof getQuery>[0], path: string[]) {
  if (event.method !== 'GET' || path.length !== 1 || path[0] !== 'requests.csv') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }
  const rows = await prisma.shootingRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10000,
  })
  const header = [
    'Номер', 'Статус', 'Источник', 'Кампания', 'Имя', 'Компания', 'Роль', 'Телефон', 'Email',
    'Сообщение', 'Ответственный', 'Следующий контакт', 'Создана', 'Обновлена',
  ]
  const data = rows.map(item => [
    item.requestNumber, item.status, item.source, item.campaign, item.name, item.company, item.position,
    item.phone, item.email, item.message, item.assignedAdminName, item.nextContactAt,
    item.createdAt, item.updatedAt,
  ])
  setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setHeader(event, 'Content-Disposition', 'attachment; filename="shooting-requests.csv"')
  return `\uFEFF${[header, ...data].map(row => row.map(csvCell).join(';')).join('\n')}`
}

export default defineEventHandler(async (event) => {
  const rawBody = await authenticateBotApi(event)
  const routePath = getRouterParam(event, 'path') || ''
  const [resource, ...path] = routePath.split('/').filter(Boolean).map(decodeURIComponent)
  if (!resource) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  if (resource === 'health') return { ok: true, timestamp: new Date().toISOString() }
  if (resource === 'events') return handleEvents(event)
  if (resource === 'requests') return handleRequests(event, path, rawBody)
  if (resource === 'content') return handleContent(event, path)
  if (resource === 'cities') return handleCities(event)
  if (resource === 'user-data') return handleDeleteUserData(event, path)
  if (resource === 'exports') return handleExports(event, path)
  throw createError({ statusCode: 404, statusMessage: 'Not found' })
})
