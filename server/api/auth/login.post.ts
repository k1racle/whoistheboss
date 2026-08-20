import prisma from '~~/lib/prisma'
import { getPostLoginRedirect, setPublicUserSession } from '@server/utils/auth-session'
import { comparePassword } from '@server/utils/password'
import {
  getStringValue,
  isValidEmail,
  normalizeEmail,
  requestWantsJson,
} from '@server/utils/request-flow'
import { enforceRateLimit } from '@server/utils/rate-limit'
import { readLimitedBody } from '@server/utils/request-security'

interface LoginBody extends Record<string, unknown> {
  email?: unknown
  password?: unknown
  returnTo?: unknown
}

export default defineEventHandler(async (event) => {
  const body = await readLimitedBody<LoginBody>(event, 16 * 1024)

  const email = normalizeEmail(body.email)
  const password = getStringValue(body.password)
  const wantsJson = requestWantsJson(event)

  enforceRateLimit(event, {
    id: 'auth-login',
    limit: 8,
    windowMs: 15 * 60 * 1000,
    key: email.slice(0, 160),
  })

  if (!isValidEmail(email) || email.length > 254 || password.length < 6 || password.length > 128) {
    if (!wantsJson) {
      return sendRedirect(event, '/login?error=1', 303)
    }

    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.isActive) {
    if (!wantsJson) {
      return sendRedirect(event, '/login?error=1', 303)
    }

    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const isPasswordValid = await comparePassword(password, user.password)
  if (!isPasswordValid) {
    if (!wantsJson) {
      return sendRedirect(event, '/login?error=1', 303)
    }

    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const sessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }

  await setPublicUserSession(event, sessionUser)

  if (!wantsJson) {
    return sendRedirect(event, getPostLoginRedirect(event, body, user.role), 303)
  }

  return sessionUser
})
