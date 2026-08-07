import prisma from '~~/lib/prisma'
import {
  buildErrorRedirect,
  buildSuccessRedirect,
  getStringValue,
  isValidEmail,
  normalizeEmail,
  requestWantsJson,
} from '@server/utils/request-flow'

interface ShootingRequestBody {
  name?: unknown
  company?: unknown
  email?: unknown
  phone?: unknown
  message?: unknown
  redirect?: unknown
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ShootingRequestBody>(event)

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

  // TODO: notifyAdmin + sendTelegramMessage after the mailer and telegram migration.

  if (!wantsJson) {
    return sendRedirect(event, buildSuccessRedirect(body.redirect), 303)
  }

  return { success: true, id: data.id }
})
