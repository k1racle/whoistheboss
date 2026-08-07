import type { H3Event } from 'h3'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function getStringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function normalizeEmail(value: unknown): string {
  return getStringValue(value).toLowerCase()
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value)
}

export function requestWantsJson(event: H3Event): boolean {
  const accept = getRequestHeader(event, 'accept') ?? ''
  const contentType = getRequestHeader(event, 'content-type') ?? ''
  const requestedWith = getRequestHeader(event, 'x-requested-with') ?? ''

  return requestedWith.toLowerCase() === 'xmlhttprequest'
    || accept.includes('application/json')
    || contentType.includes('application/json')
}

export function getLocalRedirectPath(value: unknown): string {
  const redirect = getStringValue(value)

  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) {
    return ''
  }

  return redirect
}

export function getReturnToPath(
  event: H3Event,
  body?: Record<string, unknown>,
): string {
  const query = getQuery(event)

  return getLocalRedirectPath(body?.returnTo ?? query.returnTo)
}

export function buildErrorRedirect(
  redirect: unknown,
  fallback = '/shooting-request?error=1',
): string {
  const localRedirect = getLocalRedirectPath(redirect)
  if (!localRedirect) return fallback

  const [pathname] = localRedirect.split('?')
  return `${pathname}?error=1`
}

export function buildSuccessRedirect(
  redirect: unknown,
  fallback = '/shooting-request?success=1',
): string {
  return getLocalRedirectPath(redirect) || fallback
}
