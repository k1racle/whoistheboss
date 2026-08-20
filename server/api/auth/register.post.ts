import prisma from '~~/lib/prisma'
import { setPublicUserSession } from '@server/utils/auth-session'
import { hashPassword } from '@server/utils/password'
import {
  getStringValue,
  isValidEmail,
  normalizeEmail,
  requestWantsJson,
} from '@server/utils/request-flow'
import { enforceRateLimit } from '@server/utils/rate-limit'
import { isPrismaUniqueError } from '@server/utils/prisma-errors'
import { readLimitedBody } from '@server/utils/request-security'

interface RegisterBody {
  name?: unknown
  email?: unknown
  password?: unknown
}

export default defineEventHandler(async (event) => {
  const body = await readLimitedBody<RegisterBody>(event, 16 * 1024)

  const name = getStringValue(body.name)
  const email = normalizeEmail(body.email)
  const password = getStringValue(body.password)
  const wantsJson = requestWantsJson(event)

  enforceRateLimit(event, { id: 'auth-register', limit: 5, windowMs: 60 * 60 * 1000 })

  if (
    name.length < 2
    || name.length > 120
    || !isValidEmail(email)
    || email.length > 254
    || password.length < 10
    || password.length > 128
  ) {
    if (!wantsJson) {
      return sendRedirect(event, '/register?error=1', 303)
    }

    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    if (!wantsJson) {
      return sendRedirect(event, '/register?error=2', 303)
    }

    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }

  const hashedPassword = await hashPassword(password, 10)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'SUBSCRIBER',
    },
  }).catch((error) => {
    if (isPrismaUniqueError(error, 'email')) {
      throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
    }
    throw error
  })

  const sessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }

  await setPublicUserSession(event, sessionUser)

  if (!wantsJson) {
    return sendRedirect(event, '/', 303)
  }

  return sessionUser
})
