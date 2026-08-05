import bcrypt from 'bcrypt'
import prisma from '~~/lib/prisma'
import { setPublicUserSession } from '@server/utils/auth-session'
import {
  getStringValue,
  isValidEmail,
  normalizeEmail,
  requestWantsJson,
} from '@server/utils/request-flow'

interface RegisterBody {
  name?: unknown
  email?: unknown
  password?: unknown
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RegisterBody>(event)

  const name = getStringValue(body.name)
  const email = normalizeEmail(body.email)
  const password = getStringValue(body.password)
  const wantsJson = requestWantsJson(event)

  if (name.length < 2 || !isValidEmail(email) || password.length < 6) {
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

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'SUBSCRIBER',
    },
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
