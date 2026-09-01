const INDEX_NOW_ENDPOINT = 'https://yandex.com/indexnow'
const INDEX_NOW_DEDUPE_MS = 10 * 60 * 1000
const INDEX_NOW_KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/u

export type IndexNowContentType = 'entrepreneur' | 'company' | 'article' | 'interview' | 'reel'

export interface IndexNowRecord {
  slug: string
  isPublished: boolean
}

const contentPrefixes: Record<IndexNowContentType, string> = {
  entrepreneur: '/entrepreneurs',
  company: '/companies',
  article: '/blog',
  interview: '/interviews',
  reel: '/reels',
}

const recentlySubmitted = new Map<string, number>()

export function getIndexNowPath(type: IndexNowContentType, slug: string): string {
  return `${contentPrefixes[type]}/${encodeURIComponent(slug)}`
}

export function getChangedIndexNowPaths(
  type: IndexNowContentType,
  previous?: IndexNowRecord | null,
  current?: IndexNowRecord | null,
): string[] {
  const paths = new Set<string>()
  if (previous?.isPublished) paths.add(getIndexNowPath(type, previous.slug))
  if (current?.isPublished) paths.add(getIndexNowPath(type, current.slug))
  return [...paths]
}

function normalizeSiteUrl(value: string): URL {
  const url = new URL(value)
  url.pathname = '/'
  url.search = ''
  url.hash = ''
  return url
}

export async function notifyIndexNow(
  type: IndexNowContentType,
  previous?: IndexNowRecord | null,
  current?: IndexNowRecord | null,
): Promise<void> {
  const config = useRuntimeConfig()
  const key = String(config.indexNowKey || '').trim()
  if (!key) return

  if (!INDEX_NOW_KEY_PATTERN.test(key)) {
    console.warn('[IndexNow] INDEXNOW_KEY has an invalid format; notification skipped.')
    return
  }

  try {
    const siteUrl = normalizeSiteUrl(String(config.public.siteUrl))
    const now = Date.now()
    const urlList = getChangedIndexNowPaths(type, previous, current)
      .map(path => new URL(path, siteUrl).href)
      .filter((url) => {
        const submittedAt = recentlySubmitted.get(url) ?? 0
        return now - submittedAt >= INDEX_NOW_DEDUPE_MS
      })

    if (!urlList.length) return

    const response = await fetch(INDEX_NOW_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: siteUrl.host,
        key,
        keyLocation: new URL(`/${key}.txt`, siteUrl).href,
        urlList,
      }),
    })

    if (!response.ok) {
      throw new Error(`IndexNow responded with HTTP ${response.status}`)
    }

    urlList.forEach(url => recentlySubmitted.set(url, now))
  }
  catch (error) {
    console.warn('[IndexNow] Notification failed without interrupting the CMS operation.', error)
  }
}
