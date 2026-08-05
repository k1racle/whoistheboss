import bcrypt from 'bcrypt'
import prisma from '~~/lib/prisma'
import { getPostLoginRedirect, setPublicUserSession } from '@server/utils/auth-session'
import {
  getStringValue,
  isValidEmail,
  normalizeEmail,
  requestWantsJson,
} from '@server/utils/request-flow'

interface LoginBody {
  email?: unknown
  password?: unknown
  returnTo?: unknown
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)

  const email = normalizeEmail(body.email)
  const password = getStringValue(body.password)
  const wantsJson = requestWantsJson(event)

  if (!isValidEmail(email) || password.length < 6) {
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

  const isPasswordValid = await bcrypt.compare(password, user.password)
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
