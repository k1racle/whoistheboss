import type { Role } from '@prisma/client'
import type { H3Event } from 'h3'
import { getReturnToPath } from '@server/utils/request-flow'

export interface PublicSessionUser {
  id: string
  email: string
  name: string
  role: Role
}

interface SessionShape {
  user?: PublicSessionUser | null
}

export async function setPublicUserSession(
  event: H3Event,
  user: PublicSessionUser,
): Promise<void> {
  await setUserSession(event, {
    user,
    loggedInAt: new Date().toISOString(),
  })
}

export async function getPublicSessionUser(event: H3Event): Promise<PublicSessionUser | null> {
  const session = await getUserSession(event) as SessionShape
  return session.user ?? null
}

export function getPostLoginRedirect(
  event: H3Event,
  body: Record<string, unknown> | undefined,
  role: Role,
): string {
  const returnTo = getReturnToPath(event, body)
  if (returnTo) return returnTo

  return role === 'ADMIN' || role === 'EDITOR' ? '/admin' : '/'
}
