import { randomBytes } from 'node:crypto'
import type { BotPlatform, Prisma, RequestActivityType, RequestSource, RequestStatus } from '@prisma/client'
import prisma from '~~/lib/prisma'

export interface CreateShootingRequestInput {
  name: string
  company?: string | null
  position?: string | null
  phone?: string | null
  email?: string | null
  message?: string | null
  source?: RequestSource
  externalPlatform?: BotPlatform | null
  externalUserId?: string | null
  externalChatId?: string | null
  externalRequestKey?: string | null
  campaign?: string | null
  consentAt?: Date | null
}

export interface ShootingRequestActor {
  key?: string | null
  name?: string | null
}

function requestPayload(request: {
  id: string
  requestNumber: string
  name: string
  company: string | null
  position: string | null
  phone: string | null
  email: string | null
  message: string | null
  status: RequestStatus
  source: RequestSource
  externalPlatform: BotPlatform | null
  externalUserId: string | null
  externalChatId: string | null
  campaign: string | null
  assignedAdminKey: string | null
  assignedAdminName: string | null
  nextContactAt: Date | null
  createdAt: Date
  updatedAt: Date
}): Prisma.InputJsonObject {
  return {
    id: request.id,
    requestNumber: request.requestNumber,
    name: request.name,
    company: request.company,
    position: request.position,
    phone: request.phone,
    email: request.email,
    message: request.message,
    status: request.status,
    source: request.source,
    externalPlatform: request.externalPlatform,
    externalUserId: request.externalUserId,
    externalChatId: request.externalChatId,
    campaign: request.campaign,
    assignedAdminKey: request.assignedAdminKey,
    assignedAdminName: request.assignedAdminName,
    nextContactAt: request.nextContactAt?.toISOString() ?? null,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
  }
}

function requestNumber(): string {
  const date = new Date().toISOString().slice(2, 10).replaceAll('-', '')
  const suffix = randomBytes(4).toString('hex').slice(0, 6).toUpperCase()
  return `MP-${date}-${suffix}`
}

export async function createShootingRequest(input: CreateShootingRequestInput) {
  if (input.externalRequestKey) {
    const duplicate = await prisma.shootingRequest.findUnique({
      where: { externalRequestKey: input.externalRequestKey },
      include: { activities: { orderBy: { createdAt: 'asc' } } },
    })
    if (duplicate) return { request: duplicate, created: false }
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const request = await prisma.$transaction(async (tx) => {
        const created = await tx.shootingRequest.create({
          data: {
            requestNumber: requestNumber(),
            name: input.name,
            company: input.company || null,
            position: input.position || null,
            phone: input.phone || null,
            email: input.email || null,
            message: input.message || null,
            source: input.source ?? 'WEBSITE',
            externalPlatform: input.externalPlatform
              ?? (input.source === 'TELEGRAM' || input.source === 'MAX' ? input.source : null),
            externalUserId: input.externalUserId || null,
            externalChatId: input.externalChatId || null,
            externalRequestKey: input.externalRequestKey || null,
            campaign: input.campaign || null,
            consentAt: input.consentAt ?? null,
          },
        })

        await tx.shootingRequestActivity.create({
          data: {
            requestId: created.id,
            type: 'CREATED',
            actorKey: input.externalUserId || null,
            actorName: input.name,
          },
        })
        await tx.botOutboxEvent.create({
          data: { type: 'request.created', payload: requestPayload(created) },
        })
        return created
      })
      return { request, created: true }
    }
    catch (error) {
      const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : null
      if (code === 'P2002' && input.externalRequestKey) {
        const duplicate = await prisma.shootingRequest.findUnique({
          where: { externalRequestKey: input.externalRequestKey },
          include: { activities: { orderBy: { createdAt: 'asc' } } },
        })
        if (duplicate) return { request: duplicate, created: false }
      }
      if (code !== 'P2002' || attempt === 2) throw error
    }
  }

  throw new Error('Could not allocate request number')
}

export async function addShootingRequestActivity(input: {
  requestId: string
  type: RequestActivityType
  body?: string | null
  actor?: ShootingRequestActor
  fromStatus?: RequestStatus | null
  toStatus?: RequestStatus | null
}) {
  return prisma.shootingRequestActivity.create({
    data: {
      requestId: input.requestId,
      type: input.type,
      body: input.body || null,
      actorKey: input.actor?.key || null,
      actorName: input.actor?.name || null,
      fromStatus: input.fromStatus || null,
      toStatus: input.toStatus || null,
    },
  })
}

export async function enqueueRequestEvent(type: string, requestId: string): Promise<void> {
  const request = await prisma.shootingRequest.findUnique({ where: { id: requestId } })
  if (!request) return
  await prisma.botOutboxEvent.create({ data: { type, payload: requestPayload(request) } })
}

interface PublishedRecord {
  id: string
  slug: string
  isPublished: boolean
  title?: string | null
  name?: string | null
  subtitle?: string | null
  description?: string | null
  coverImage?: string | null
  photo?: string | null
}

const contentPaths: Record<string, string> = {
  entrepreneur: '/entrepreneurs/',
  business: '/companies/',
  interview: '/interviews/',
  article: '/blog/',
  reel: '/reels/',
}

export async function enqueuePublicationEvent(
  kind: keyof typeof contentPaths,
  previous: PublishedRecord | null,
  current: PublishedRecord,
): Promise<void> {
  if (!current.isPublished || previous?.isPublished) return
  await prisma.botOutboxEvent.create({
    data: {
      type: 'content.published',
      payload: {
        kind,
        id: current.id,
        slug: current.slug,
        title: current.title || current.name || '',
        subtitle: current.subtitle || current.description || null,
        image: current.coverImage || current.photo || null,
        path: `${contentPaths[kind]}${current.slug}`,
      },
    },
  })
}
