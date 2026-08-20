import prisma from '~~/lib/prisma'
import { z } from 'zod'
import { notifyAdminAboutShootingRequest } from '@server/utils/notify-admin'
import { enforceRateLimit } from '@server/utils/rate-limit'
import {
  buildErrorRedirect,
  buildSuccessRedirect,
  getStringValue,
  isValidEmail,
  normalizeEmail,
  requestWantsJson,
} from '@server/utils/request-flow'
import { assertSameOriginMutation, readLimitedBody } from '@server/utils/request-security'

interface ShootingRequestBody {
  name?: unknown
  company?: unknown
  email?: unknown
  phone?: unknown
  message?: unknown
  redirect?: unknown
}

const shootingRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).optional().default(''),
  email: z.string().trim().max(254).optional().default(''),
  phone: z.string().trim().max(40).optional().default(''),
  message: z.string().trim().max(4000).optional().default(''),
  redirect: z.string().trim().max(200).optional().default(''),
})

export default defineEventHandler(async (event) => {
  assertSameOriginMutation(event)
  enforceRateLimit(event, { id: 'shooting-request', limit: 8, windowMs: 15 * 60 * 1000 })
  const rawBody = await readLimitedBody<ShootingRequestBody>(event, 32 * 1024)
  const parsedBody = shootingRequestSchema.safeParse(rawBody)
  if (!parsedBody.success) {
    if (!requestWantsJson(event)) {
      return sendRedirect(event, buildErrorRedirect(rawBody.redirect), 303)
    }
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }
  const body = parsedBody.data

  const name = getStringValue(body.name)
  const company = getStringValue(body.company)
  const email = normalizeEmail(body.email)
  const phone = getStringValue(body.phone)
  const message = getStringValue(body.message)
  const wantsJson = requestWantsJson(event)
  const hasValidEmail = email ? isValidEmail(email) : false
  const hasValidPhone = phone.length >= 5

  if (name.length < 2 || (!hasValidEmail && !hasValidPhone) || (email && !hasValidEmail)) {
    if (!wantsJson) {
      return sendRedirect(event, buildErrorRedirect(body.redirect), 303)
    }

    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }

  const data = await prisma.shootingRequest.create({
    data: {
      name,
      phone: phone || null,
      company: company || null,
      email: email || null,
      message: message || null,
    },
  })

  void notifyAdminAboutShootingRequest({
    name,
    company,
    email,
    phone,
    message,
  })

  if (!wantsJson) {
    return sendRedirect(event, buildSuccessRedirect(body.redirect), 303)
  }

  return { success: true, id: data.id }
})
