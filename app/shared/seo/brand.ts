export const SEO_SITE_NAME = 'МАРШРУТ ПОСТРОЕН МЕДИАГИД'

export const SEO_FALLBACK_DESCRIPTION = 'Медиагид о предпринимателях, компаниях, брендах и проектах России.'

export type SeoBrandMode = 'auto' | 'always' | 'never'

const SEO_BRAND_PATTERN = /[«"]?маршрут\s+построен(?:\s+медиагид)?[»"]?/giu

export function normalizeSeoBrand(value: string | null | undefined) {
  return value
    ?.replace(SEO_BRAND_PATTERN, SEO_SITE_NAME)
    .replace(/\s+/g, ' ')
    .trim() || ''
}

function deduplicateTitleSegments(title: string) {
  const parts = title.split(/(\s*(?:\||—)\s*)/u)
  const seen = new Set<string>()
  let result = ''

  for (let index = 0; index < parts.length; index += 2) {
    const segment = parts[index]?.trim()

    if (!segment) {
      continue
    }

    const key = segment.toLocaleLowerCase('ru-RU')

    if (seen.has(key)) {
      continue
    }

    const separator = result ? (parts[index - 1] || ' | ') : ''
    result += `${separator}${segment}`
    seen.add(key)
  }

  return result.trim()
}

export function normalizeConfiguredSiteName(siteName?: string | null): string {
  return normalizeSeoBrand(siteName) || SEO_SITE_NAME
}

export function withSeoSiteName(
  title: string | null | undefined,
  mode: SeoBrandMode = 'auto',
): string {
  const normalizedTitle = deduplicateTitleSegments(normalizeSeoBrand(title))

  if (!normalizedTitle) {
    return SEO_SITE_NAME
  }

  if (normalizedTitle.includes(SEO_SITE_NAME) || mode === 'never') {
    return normalizedTitle
  }

  const brandedTitle = `${normalizedTitle} | ${SEO_SITE_NAME}`

  if (mode === 'always' || brandedTitle.length <= 70) {
    return brandedTitle
  }

  return normalizedTitle
}
