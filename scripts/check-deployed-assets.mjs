import process from 'node:process'

const DEFAULT_PATHS = ['/', '/companies', '/entrepreneurs', '/blog']
const requestTimeoutMs = 30_000

function getStylesheetUrls(html, pageUrl) {
  const links = html.match(/<link\b[^>]*>/gi) || []

  return links.flatMap((tag) => {
    const rel = tag.match(/\brel\s*=\s*["']([^"']+)["']/i)?.[1] || ''
    const href = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1]
    if (!href || !rel.split(/\s+/).includes('stylesheet')) return []

    return [new URL(href, pageUrl)]
  })
}

async function fetchChecked(url, accept) {
  const response = await fetch(url, {
    headers: {
      accept,
      'cache-control': 'no-cache',
      'user-agent': 'guessboss-deploy-smoke/1.0',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(requestTimeoutMs),
  })

  return response
}

async function main() {
  const rawBaseUrl = process.argv[2] || process.env.SMOKE_BASE_URL || process.env.SITE_URL
  if (!rawBaseUrl) {
    throw new Error('Pass the deployed URL: npm run smoke:assets -- https://example.com')
  }

  const baseUrl = new URL(rawBaseUrl)
  if (!['http:', 'https:'].includes(baseUrl.protocol)) {
    throw new Error('The deployed URL must use http or https')
  }

  const configuredPaths = process.env.SMOKE_PATHS
    ?.split(',')
    .map(item => item.trim())
    .filter(Boolean)
  const pagePaths = configuredPaths?.length ? configuredPaths : DEFAULT_PATHS
  const stylesheetUrls = new Map()
  const errors = []

  for (const pagePath of pagePaths) {
    const pageUrl = new URL(pagePath, baseUrl)

    try {
      const response = await fetchChecked(pageUrl, 'text/html')
      const contentType = response.headers.get('content-type') || ''
      if (!response.ok || !contentType.toLowerCase().includes('text/html')) {
        errors.push(`${pageUrl}: expected HTML 200, received ${response.status} ${contentType || 'without content-type'}`)
        continue
      }

      const html = await response.text()
      const pageStylesheets = getStylesheetUrls(html, pageUrl)
      if (!pageStylesheets.length) {
        errors.push(`${pageUrl}: no stylesheet links found`)
        continue
      }

      pageStylesheets.forEach(url => stylesheetUrls.set(url.href, url))
      console.log(`Page OK: ${pageUrl} (${pageStylesheets.length} stylesheets)`)
    }
    catch (error) {
      errors.push(`${pageUrl}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  for (const stylesheetUrl of stylesheetUrls.values()) {
    try {
      const response = await fetchChecked(stylesheetUrl, 'text/css,*/*;q=0.1')
      const contentType = response.headers.get('content-type') || ''
      if (!response.ok || !contentType.toLowerCase().startsWith('text/css')) {
        errors.push(`${stylesheetUrl}: expected CSS 200, received ${response.status} ${contentType || 'without content-type'}`)
        continue
      }

      console.log(`CSS OK: ${stylesheetUrl}`)
    }
    catch (error) {
      errors.push(`${stylesheetUrl}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (errors.length) {
    throw new Error(`Asset smoke-check failed:\n- ${errors.join('\n- ')}`)
  }

  console.log(`Asset smoke-check passed: ${pagePaths.length} pages, ${stylesheetUrls.size} unique stylesheets.`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
