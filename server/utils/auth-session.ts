import type { Role } from '@prisma/client'
import { clearSession, useSession, type H3Event, type SessionConfig } from 'h3'
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
  return session.data.user ?? null
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
