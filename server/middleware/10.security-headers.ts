const yandexMetrikaHttpSources = [
  'https://mc.yandex.ru',
  'https://mc.yandex.az',
  'https://mc.yandex.by',
  'https://mc.yandex.co.il',
  'https://mc.yandex.com',
  'https://mc.yandex.com.am',
  'https://mc.yandex.com.ge',
  'https://mc.yandex.com.tr',
  'https://mc.yandex.ee',
  'https://mc.yandex.fr',
  'https://mc.yandex.kg',
  'https://mc.yandex.kz',
  'https://mc.yandex.lt',
  'https://mc.yandex.lv',
  'https://mc.yandex.md',
  'https://mc.yandex.tj',
  'https://mc.yandex.tm',
  'https://mc.yandex.uz',
  'https://mc.webvisor.com',
  'https://mc.webvisor.org',
  'https://yastatic.net',
]

const yandexMetrikaWebSocketSources = yandexMetrikaHttpSources
  .filter(source => source.includes('mc.'))
  .map(source => source.replace('https://', 'wss://'))

const yandexMetrikaFrameAncestors = [
  'https://metrika.yandex.ru',
  'https://analytics.yandex.by',
  'https://analytics.yandex.com',
  'https://analytics.yandex.com.tr',
  'https://analytics.yandex.kz',
  'https://analytics.yandex.ru',
  'https://metr.yandex.by',
  'https://metr.yandex.com',
  'https://metr.yandex.com.tr',
  'https://metr.yandex.kz',
  'https://metr.yandex.ru',
  'https://metrica.ya.ru',
  'https://metrica.yandex',
  'https://metrica.yandex.by',
  'https://metrica.yandex.com',
  'https://metrica.yandex.com.tr',
  'https://metrica.yandex.kz',
  'https://metrica.yandex.ru',
  'https://metrika.ya.ru',
  'https://metrika.yandex',
  'https://metrika.yandex.by',
  'https://metrika.yandex.com',
  'https://metrika.yandex.com.tr',
  'https://metrika.yandex.kz',
  'https://metrika.yandex.uz',
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
