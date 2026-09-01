export const SEO_SITE_NAME = 'МАРШРУТ ПОСТРОЕН МЕДИАГИД'

const LEGACY_SITE_NAME = 'маршрут построен'
const SITE_NAME_ONLY_PATTERN = new RegExp(`^«?${LEGACY_SITE_NAME}(?: медиагид)?»?$`, 'iu')
const SITE_NAME_SUFFIX_PATTERN = new RegExp(`\\s+(?:—|\\||-)\\s*«?${LEGACY_SITE_NAME}(?: медиагид)?»?$`, 'iu')

export function normalizeConfiguredSiteName(siteName?: string | null): string {
  const normalized = siteName?.trim() || ''
  return SITE_NAME_ONLY_PATTERN.test(normalized) ? SEO_SITE_NAME : normalized || SEO_SITE_NAME
}

export function withSeoSiteName(title: string): string {
  const normalized = title.replace(/\s+/g, ' ').trim()

  if (!normalized || SITE_NAME_ONLY_PATTERN.test(normalized)) {
    return SEO_SITE_NAME
  }

  if (SITE_NAME_SUFFIX_PATTERN.test(normalized)) {
    return normalized.replace(SITE_NAME_SUFFIX_PATTERN, ` — ${SEO_SITE_NAME}`)
  }

  return `${normalized} — ${SEO_SITE_NAME}`
}
