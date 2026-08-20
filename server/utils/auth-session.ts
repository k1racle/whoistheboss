import type { Role } from '@prisma/client'
import { clearSession, useSession, type H3Event, type SessionConfig } from 'h3'
import prisma from '~~/lib/prisma'
import { getReturnToPath } from '@server/utils/request-flow'

export interface PublicSessionUser {
  id: string
  email: string
  name: string
  role: Role
}

interface SessionShape {
  user?: PublicSessionUser | null
  loggedInAt?: string
  [key: string]: unknown
}

function getPublicSessionConfig(): SessionConfig {
  const config = useRuntimeConfig()
  const password = process.env.NUXT_SESSION_PASSWORD
    || process.env.SESSION_SECRET
    || config.session.password
    || config.sessionSecret

  return {
    password,
    name: 'nuxt-session',
    maxAge: 60 * 60 * 12,
    sessionHeader: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.nodeEnv === 'production',
      path: '/',
    },
  }
}

export async function setPublicUserSession(
  event: H3Event,
  user: PublicSessionUser,
): Promise<void> {
  const session = await useSession<SessionShape>(event, getPublicSessionConfig())

  await session.update({
    user,
    loggedInAt: new Date().toISOString(),
  })
}

export async function getPublicSessionUser(event: H3Event): Promise<PublicSessionUser | null> {
  const session = await useSession<SessionShape>(event, getPublicSessionConfig())
  const claims = session.data.user
  if (!claims?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: claims.id },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  })
  if (!user?.isActive) {
    await session.clear()
    return null
  }

  const current = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
  if (
    claims.email !== current.email
    || claims.name !== current.name
    || claims.role !== current.role
  ) {
    await session.update({ user: current })
  }
  return current
}

export async function clearPublicUserSession(event: H3Event): Promise<void> {
  await clearSession(event, getPublicSessionConfig())
}

export function getPostLoginRedirect(
  event: H3Event,
  body: Record<string, unknown> | undefined,
  role: Role,
): string {
  const returnTo = getReturnToPath(event, body)
  if (returnTo) return returnTo

  return role === 'ADMIN' || role === 'EDITOR' ? '/admin/' : '/'
}
