const yandexMetrikaHttpSources = [
  'https://mc.yandex.ru',
  'https://mc.webvisor.com',
  'https://mc.webvisor.org',
  'https://yastatic.net',
]

const yandexMetrikaWebSocketSources = yandexMetrikaHttpSources
  .filter(source => source.includes('mc.'))
  .map(source => source.replace('https://', 'wss://'))

const yandexMetrikaFrameAncestors = [
  'https://metrika.yandex.ru',
]

export default defineEventHandler((event) => {
  const pathname = getRequestURL(event).pathname
  const isPublicPage = pathname !== '/api'
    && !pathname.startsWith('/api/')
    && pathname !== '/admin'
    && !pathname.startsWith('/admin/')
  const metrikaHttpSources = isPublicPage ? ` ${yandexMetrikaHttpSources.join(' ')}` : ''
  const metrikaConnectSources = isPublicPage
    ? `${metrikaHttpSources} ${yandexMetrikaWebSocketSources.join(' ')}`
    : ''
  const metrikaFrameAncestors = isPublicPage ? ` ${yandexMetrikaFrameAncestors.join(' ')}` : ''

  setResponseHeaders(event, {
    'content-security-policy': [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      `frame-ancestors 'self'${metrikaFrameAncestors}`,
      "form-action 'self'",
      `script-src 'self' 'unsafe-inline'${metrikaHttpSources}`,
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob:${metrikaHttpSources}`,
      "font-src 'self' data:",
      "media-src 'self' blob:",
      `connect-src 'self'${metrikaConnectSources}`,
      `child-src 'self' blob:${metrikaHttpSources}`,
      `frame-src 'self' blob: https://vk.com https://vkvideo.ru https://rutube.ru https://www.rutube.ru https://www.youtube.com https://www.youtube-nocookie.com https://yandex.ru${metrikaHttpSources}`,
      'upgrade-insecure-requests',
    ].join('; '),
    'cross-origin-opener-policy': 'same-origin',
    'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'x-content-type-options': 'nosniff',
  })
})
