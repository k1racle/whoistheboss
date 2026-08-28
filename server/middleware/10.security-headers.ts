export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'content-security-policy': [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "media-src 'self' blob:",
      "connect-src 'self'",
      "child-src 'self' blob:",
      "frame-src 'self' blob: https://vk.com https://vkvideo.ru https://rutube.ru https://www.rutube.ru https://www.youtube.com https://www.youtube-nocookie.com https://yandex.ru",
      'upgrade-insecure-requests',
    ].join('; '),
    'cross-origin-opener-policy': 'same-origin',
    'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'x-content-type-options': 'nosniff',
  })
})
