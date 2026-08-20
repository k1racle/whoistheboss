import type { H3Event } from 'h3'
import type { Prisma } from '@prisma/client'
import type { PublicSessionUser } from '@server/utils/auth-session'
import prisma from '~~/lib/prisma'
import {
  audienceCardSchema,
  commentApprovalSchema,
  createUserSchema,
  settingsSchema,
  shootingRequestStatusSchema,
  updateUserSchema,
} from '@server/utils/admin-schemas'
import {
  readAdminBody,
  requireAdminMethod,
  throwAdminError,
} from '@server/utils/admin-api'
import { hashPassword } from '@server/utils/password'
import {
  FOOTER_META_ITEMS_KEY,
  footerMetaItemsSchema,
  isSafeFooterHref,
} from '@server/utils/site-footer'
import { readPagination } from '@server/utils/pagination'

const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const

const commentInclude = {
  user: { select: { id: true, name: true, email: true } },
  interview: { select: { id: true, title: true, slug: true } },
  article: { select: { id: true, title: true, slug: true } },
  reel: { select: { id: true, title: true, slug: true } },
  entrepreneur: { select: { id: true, name: true, slug: true } },
} as const

function singleId(path: readonly string[]): string | undefined {
  if (path.length > 1) throwAdminError(404, 'Not found')
  return path[0]
}

export async function handleAudienceCards(event: H3Event, path: readonly string[]) {
  const id = singleId(path)
  const method = requireAdminMethod(event, id ? ['GET', 'PUT', 'DELETE'] : ['GET', 'POST'])

  if (!id && method === 'GET') {
    return prisma.audienceCard.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
  }

  if (!id && method === 'POST') {
    const data = await readAdminBody(event, audienceCardSchema)
    setResponseStatus(event, 201)
    return prisma.audienceCard.create({ data })
  }

  if (id && method === 'GET') {
    const item = await prisma.audienceCard.findUnique({ where: { id } })
    if (!item) throwAdminError(404, 'Not found')
    return item
  }

  if (id && method === 'DELETE') {
    await prisma.audienceCard.delete({ where: { id } })
    return { ok: true }
  }

  const data = await readAdminBody(event, audienceCardSchema)
  return prisma.audienceCard.update({ where: { id: id! }, data })
}

export async function handleComments(event: H3Event, path: readonly string[]) {
  if (path.length === 0) {
    requireAdminMethod(event, ['GET'])
    const { limit, offset } = readPagination(event, { defaultLimit: 100, maxLimit: 250 })
    return prisma.comment.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: commentInclude,
    })
  }

  const [id, action] = path
  if (!id || path.length > 2) throwAdminError(404, 'Not found')

  if (action === 'approve') {
    requireAdminMethod(event, ['POST'])
    const result = commentApprovalSchema.safeParse(await readBody(event))
    const isApproved = result.success ? result.data.isApproved : true
    const existing = await prisma.comment.findUnique({ where: { id } })
    if (!existing) throwAdminError(404, 'Comment not found')
    return prisma.comment.update({
      where: { id },
      data: { isApproved },
      include: commentInclude,
    })
  }

  if (action) throwAdminError(404, 'Not found')
  requireAdminMethod(event, ['DELETE'])
  const existing = await prisma.comment.findUnique({ where: { id } })
  if (!existing) throwAdminError(404, 'Comment not found')
  await prisma.comment.delete({ where: { id } })
  return { ok: true }
}

export async function handleShootingRequests(event: H3Event, path: readonly string[]) {
  if (path.length === 0) {
    requireAdminMethod(event, ['GET'])
    const { limit, offset } = readPagination(event, { defaultLimit: 100, maxLimit: 250 })
    return prisma.shootingRequest.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
  }

  const [id, action] = path
  if (!id || path.length > 2) throwAdminError(404, 'Not found')

  if (action === 'status') {
    requireAdminMethod(event, ['PUT'])
    const data = await readAdminBody(event, shootingRequestStatusSchema)
    const existing = await prisma.shootingRequest.findUnique({ where: { id } })
    if (!existing) throwAdminError(404, 'Request not found')
    return prisma.shootingRequest.update({ where: { id }, data: { status: data.status } })
  }

  if (action) throwAdminError(404, 'Not found')
  requireAdminMethod(event, ['DELETE'])
  const existing = await prisma.shootingRequest.findUnique({ where: { id } })
  if (!existing) throwAdminError(404, 'Request not found')
  await prisma.shootingRequest.delete({ where: { id } })
  return { ok: true }
}

export async function handleSubscribers(event: H3Event, path: readonly string[]) {
  requireAdminMethod(event, path[0] === 'export.csv' || path.length === 0 ? ['GET'] : ['DELETE'])

  if (path.length === 0) {
    const { limit, offset } = readPagination(event, { defaultLimit: 100, maxLimit: 500 })
    return prisma.subscriber.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
  }

  if (path.length !== 1) throwAdminError(404, 'Not found')

  if (path[0] === 'export.csv') {
    const subscribers = await prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } })
    const rows = [
      ['Email', 'Active', 'Created At'],
      ...subscribers.map(subscriber => [
        subscriber.email,
        subscriber.isActive ? 'Yes' : 'No',
        subscriber.createdAt.toISOString(),
      ]),
    ]
    const csv = rows
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
    setHeader(event, 'Content-Disposition', 'attachment; filename="subscribers.csv"')
    return csv
  }

  const id = path[0]!
  const existing = await prisma.subscriber.findUnique({ where: { id } })
  if (!existing) throwAdminError(404, 'Subscriber not found')
  await prisma.subscriber.delete({ where: { id } })
  return { ok: true }
}

const ADMIN_ONLY_SETTING_KEYS = new Set([
  'ADMIN_EMAIL',
  'SITE_URL',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID',
  'YANDEX_METRIKA',
])

export async function handleSettings(
  event: H3Event,
  path: readonly string[],
  currentUser: PublicSessionUser,
) {
  if (path.length !== 0) throwAdminError(404, 'Not found')
  const method = requireAdminMethod(event, ['GET', 'PUT'])

  if (method === 'GET') {
    const settings = await prisma.siteSetting.findMany()
    return Object.fromEntries(settings
      .filter(setting => currentUser.role === 'ADMIN' || !ADMIN_ONLY_SETTING_KEYS.has(setting.key))
      .map(setting => [setting.key, setting.value]))
  }

  const data = await readAdminBody(event, settingsSchema)
  if (
    currentUser.role !== 'ADMIN'
    && Object.keys(data).some(key => ADMIN_ONLY_SETTING_KEYS.has(key))
  ) {
    throwAdminError(403, 'Only administrators can change system settings')
  }
  if (Object.hasOwn(data, FOOTER_META_ITEMS_KEY)) {
    try {
      data[FOOTER_META_ITEMS_KEY] = JSON.stringify(
        footerMetaItemsSchema.parse(JSON.parse(data[FOOTER_META_ITEMS_KEY] || '[]')),
      )
    }
    catch {
      throwAdminError(400, 'Проверьте текст и ссылки элементов нижней строки футера')
    }
  }
  const invalidSocialLink = Object.entries(data).find(([key, value]) => (
    key.startsWith('SOCIAL_') && value.trim() && !isSafeFooterHref(value.trim())
  ))
  if (invalidSocialLink) {
    throwAdminError(400, `Некорректная ссылка в поле ${invalidSocialLink[0]}`)
  }
  await prisma.$transaction(
    Object.entries(data).map(([key, value]) => prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })),
  )
  return data
}

export async function handleUsers(
  event: H3Event,
  path: readonly string[],
  currentUser: PublicSessionUser,
) {
  const id = singleId(path)
  const method = requireAdminMethod(event, id ? ['GET', 'PUT', 'DELETE'] : ['GET', 'POST'])

  if (!id && method === 'GET') {
    const { limit, offset } = readPagination(event, { defaultLimit: 100, maxLimit: 250 })
    return prisma.user.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: publicUserSelect,
    })
  }

  if (!id && method === 'POST') {
    const { password, ...data } = await readAdminBody(event, createUserSchema)
    setResponseStatus(event, 201)
    return prisma.user.create({
      data: { ...data, password: await hashPassword(password, 10) },
      select: publicUserSelect,
    })
  }

  const existing = await prisma.user.findUnique({ where: { id: id! } })
  if (!existing) throwAdminError(404, 'User not found')

  if (method === 'GET') {
    return prisma.user.findUnique({ where: { id: id! }, select: publicUserSelect })
  }

  if (method === 'DELETE') {
    if (existing.id === currentUser.id) {
      throwAdminError(409, 'You cannot delete your own account')
    }
    if (existing.role === 'ADMIN' && existing.isActive) {
      const otherAdmins = await prisma.user.count({
        where: { role: 'ADMIN', isActive: true, id: { not: existing.id } },
      })
      if (otherAdmins === 0) throwAdminError(409, 'The last active administrator cannot be deleted')
    }
    await prisma.user.delete({ where: { id: id! } })
    return { ok: true }
  }

  const { password, ...data } = await readAdminBody(event, updateUserSchema)
  const removesAdminAccess = existing.role === 'ADMIN'
    && existing.isActive
    && ((Boolean(data.role) && data.role !== 'ADMIN') || data.isActive === false)
  if (removesAdminAccess) {
    const otherAdmins = await prisma.user.count({
      where: { role: 'ADMIN', isActive: true, id: { not: existing.id } },
    })
    if (otherAdmins === 0) throwAdminError(409, 'The last active administrator cannot be disabled')
  }
  if (existing.id === currentUser.id && removesAdminAccess) {
    throwAdminError(409, 'You cannot remove your own administrator access')
  }
  const update: Prisma.UserUpdateInput = { ...data }
  if (password) update.password = await hashPassword(password, 10)
  return prisma.user.update({ where: { id: id! }, data: update, select: publicUserSelect })
}
