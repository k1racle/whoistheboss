const TRUSTED_EMBED_HOSTS = new Set([
  'vk.com',
  'vkvideo.ru',
  'rutube.ru',
  'www.rutube.ru',
  'youtube.com',
  'www.youtube.com',
  'www.youtube-nocookie.com',
  'yandex.ru',
  'yandex.com',
])

function extractIframeSource(value: string): string {
  const match = /\bsrc\s*=\s*(["'])(.*?)\1/i.exec(value)
  return match?.[2]?.trim() || value.trim()
}

export function getTrustedEmbedUrl(value: string | null | undefined): string {
  const source = extractIframeSource(String(value || ''))
  if (!source) return ''

  try {
    const url = new URL(source)
    if (url.protocol !== 'https:' || !TRUSTED_EMBED_HOSTS.has(url.hostname.toLowerCase())) return ''
    return url.toString()
  }
  catch {
    return ''
  }
}

export function getSafeUploadedMediaUrl(value: string | null | undefined): string {
  const source = String(value || '').trim()
  if (!/^\/uploads\/[a-z0-9][a-z0-9._-]*$/i.test(source)) return ''
  return source
}

