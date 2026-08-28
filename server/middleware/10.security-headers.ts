const METRIKA_HTTPS_SOURCES = [
  'https://mc.yandex.ru',
  'https://mc.yandex.com',
  'https://mc.webvisor.com',
  'https://mc.webvisor.org',
  'https://yastatic.net',
]

const METRIKA_WSS_SOURCES = METRIKA_HTTPS_SOURCES
  .filter(source => source !== 'https://yastatic.net')
  .map(source => source.replace('https://', 'wss://'))

const METRIKA_FRAME_ANCESTORS = [
  'https://metrika.yandex.ru',
  'https://analytics.yandex.com',
  'https://analytics.yandex.ru',
  'https://metr.yandex.com',
  'https://metr.yandex.ru',
  'https://metrica.yandex.com',
  'https://metrica.yandex.ru',
  'https://metrika.yandex.com',
]

export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'content-security-policy': [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      `frame-ancestors 'self' ${METRIKA_FRAME_ANCESTORS.join(' ')}`,
      "form-action 'self'",
      `script-src 'self' 'unsafe-inline' ${METRIKA_HTTPS_SOURCES.join(' ')}`,
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: ${METRIKA_HTTPS_SOURCES.join(' ')}`,
      "font-src 'self' data:",
      "media-src 'self' blob:",
      `connect-src 'self' ${METRIKA_HTTPS_SOURCES.join(' ')} ${METRIKA_WSS_SOURCES.join(' ')}`,
      `child-src 'self' blob: ${METRIKA_HTTPS_SOURCES.join(' ')}`,
      `frame-src 'self' blob: https://vk.com https://vkvideo.ru https://rutube.ru https://www.rutube.ru https://www.youtube.com https://www.youtube-nocookie.com https://yandex.ru ${METRIKA_HTTPS_SOURCES.join(' ')}`,
      'upgrade-insecure-requests',
    ].join('; '),
    'cross-origin-opener-policy': 'same-origin',
    'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'x-content-type-options': 'nosniff',
  })
})
