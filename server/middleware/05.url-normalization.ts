import { getMethod, getRequestURL, sendRedirect } from 'h3'

const LEGACY_REDIRECTS: Readonly<Record<string, string>> = {
  '/companies/stereopiknik': '/companies/stereo-piknik',
}

export default defineEventHandler((event) => {
  if (!['GET', 'HEAD'].includes(getMethod(event))) return

  const requestUrl = getRequestURL(event)
  const legacyTarget = LEGACY_REDIRECTS[requestUrl.pathname]

  if (legacyTarget) {
    return sendRedirect(event, `${legacyTarget}${requestUrl.search}`, 301)
  }

  if (requestUrl.pathname.length > 1 && requestUrl.pathname.endsWith('/')) {
    const normalizedPath = requestUrl.pathname.replace(/\/+$/u, '')
    return sendRedirect(event, `${normalizedPath}${requestUrl.search}`, 301)
  }
})
