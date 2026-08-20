import type { Role } from '@prisma/client'
import type { H3Event } from 'h3'
import type { ZodType } from 'zod'
import { getPublicSessionUser } from '@server/utils/auth-session'
import { readLimitedBody } from '@server/utils/request-security'

const ruToEn: Record<string, string> = {
  '\u0430': 'a',
  '\u0431': 'b',
  '\u0432': 'v',
  '\u0433': 'g',
  '\u0434': 'd',
  '\u0435': 'e',
  '\u0451': 'yo',
  '\u0436': 'zh',
  '\u0437': 'z',
  '\u0438': 'i',
  '\u0439': 'y',
  '\u043a': 'k',
  '\u043b': 'l',
  '\u043c': 'm',
  '\u043d': 'n',
  '\u043e': 'o',
  '\u043f': 'p',
  '\u0440': 'r',
  '\u0441': 's',
  '\u0442': 't',
  '\u0443': 'u',
  '\u0444': 'f',
  '\u0445': 'h',
  '\u0446': 'ts',
  '\u0447': 'ch',
  '\u0448': 'sh',
  '\u0449': 'sch',
  '\u044a': '',
  '\u044b': 'y',
  '\u044c': '',
  '\u044d': 'e',
  '\u044e': 'yu',
  '\u044f': 'ya',
}

export async function requireAdminUser(
  event: H3Event,
  roles: readonly Role[] = ['ADMIN', 'EDITOR'],
) {
  const user = await getPublicSessionUser(event)

  if (!user) {
    throwAdminError(401, 'Unauthorized')
  }

  if (!roles.includes(user.role)) {
    throwAdminError(403, 'Forbidden')
  }

  return user
}

export async function readAdminBody<T>(event: H3Event, schema: ZodType<T>): Promise<T> {
  const result = schema.safeParse(await readLimitedBody(event, 2 * 1024 * 1024))

  if (!result.success) {
    throwAdminError(400, 'Invalid input', result.error.issues)
  }

  return result.data
}

export function throwAdminError(statusCode: number, error: string, issues?: unknown): never {
  throw createError({
    statusCode,
    statusMessage: error,
    data: {
      error,
      ...(issues ? { issues } : {}),
    },
  })
}

export function requireAdminMethod(event: H3Event, allowed: readonly string[]): string {
  const method = event.method.toUpperCase()

  if (!allowed.includes(method)) {
    throwAdminError(405, 'Method not allowed')
  }

  return method
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\u0430-\u044f\u0451]/g, char => ruToEn[char] || char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function createUniqueSlug(
  source: string,
  exists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(source) || 'item'
  let candidate = base
  let suffix = 2

  while (await exists(candidate)) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }

  return candidate
}
