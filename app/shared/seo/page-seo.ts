export type PageSeoKey = 'home' | 'entrepreneurs' | 'companies' | 'blog' | 'interviews' | 'reels' | 'contacts'

export interface PageSeoData {
  title: string
  description: string
  image: string
}

export function isCrawlableSeoImage(value: string | null | undefined): value is string {
  if (!value) return false
  const normalized = value.trim()
  if (!normalized || normalized.includes('/images/placeholder.svg')) return false
  if (normalized.startsWith('/')) return !normalized.startsWith('//')

  try {
    const url = new URL(normalized)
    return url.protocol === 'http:' || url.protocol === 'https:'
  }
  catch {
    return false
  }
}
