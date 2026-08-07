import type { SiteSettingsRecord } from '@server/utils/site-settings'
import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'

const DEFAULT_SPLASH_LOGO = '/images/logo.svg'
const DEFAULT_SPLASH_MARQUEE = 'Скоро вы узнаете кто здесь главный — личные истории предпринимателей через их бизнес'

const SPLASH_SETTING_KEYS = [
  'SPLASH_ENABLED',
  'SPLASH_LOGO',
  'SPLASH_MARQUEE',
] as const

const SKIP_PREFIXES = [
  '/admin',
  '/api',
  '/health',
  '/_nuxt',
  '/_ipx',
  '/__nuxt_error',
  '/__og-image__',
  '/css',
  '/js',
  '/fonts',
  '/images',
  '/uploads',
] as const

const SKIP_PATHS = new Set([
  '/robots.txt',
  '/sitemap.xml',
  '/favicon.ico',
  '/logo.svg',
])

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function getNonEmptySiteSetting(
  settings: SiteSettingsRecord,
  key: string,
  fallback: string,
): string {
  return getSiteSetting(settings, key).trim() || fallback
}

function renderSplashPage(siteName: string, siteUrl: string, logo: string, marquee: string): string {
  const safeSiteName = escapeHtml(siteName)
  const safeSiteUrl = escapeHtml(siteUrl)
  const safeLogo = escapeHtml(logo)
  const safeMarquee = escapeHtml(marquee)
  const marqueeItems = Array.from({ length: 4 }, () => `<span class="marquee-item">${safeMarquee}</span>`).join('')
  const marqueeGroups = Array.from(
    { length: 2 },
    () => `<div class="marquee-group">${marqueeItems}</div>`,
  ).join('')

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeSiteName}</title>
  <meta name="description" content="${safeMarquee}">
  <meta property="og:title" content="${safeSiteName}">
  <meta property="og:description" content="${safeMarquee}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${safeSiteUrl}">
  <meta property="og:image" content="${safeSiteUrl}${safeLogo}">
  <meta property="og:site_name" content="${safeSiteName}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeSiteName}">
  <meta name="twitter:description" content="${safeMarquee}">
  <meta name="twitter:image" content="${safeSiteUrl}${safeLogo}">
  <style>
    :root {
      color-scheme: light;
      --bg: #f4f0e8;
      --text: #111111;
      --accent: #cf3f1d;
      --accent-text: #fff6f2;
      --border: rgba(17, 17, 17, 0.12);
    }

    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; }
    body {
      min-height: 100vh;
      overflow: hidden;
      background:
        radial-gradient(circle at top left, rgba(207, 63, 29, 0.12), transparent 38%),
        linear-gradient(180deg, #f7f4ec 0%, var(--bg) 100%);
      color: var(--text);
      font-family: "Arial Narrow", Arial, sans-serif;
      display: flex;
      flex-direction: column;
    }

    main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px 24px 112px;
    }

    .frame {
      width: min(100%, 1320px);
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.72);
      backdrop-filter: blur(12px);
      padding: clamp(24px, 5vw, 64px);
      display: grid;
      gap: 24px;
      place-items: center;
    }

    .logo {
      width: min(100%, 1040px);
      height: auto;
      display: block;
    }

    .caption {
      font-size: 12px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      opacity: 0.68;
      text-align: center;
    }

    .marquee {
      position: fixed;
      inset: auto 0 0 0;
      overflow: hidden;
      border-top: 1px solid rgba(255,255,255,0.14);
      background: var(--accent);
      color: var(--accent-text);
      padding: 18px 0;
    }

    .marquee-track {
      display: flex;
      width: max-content;
      animation: marquee 32s linear infinite;
    }

    .marquee-group {
      display: flex;
      flex: none;
    }

    .marquee-item {
      flex: none;
      padding: 0 32px;
      white-space: nowrap;
      font-size: clamp(18px, 3vw, 32px);
      line-height: 1;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    @keyframes marquee {
      from { transform: translate3d(0, 0, 0); }
      to { transform: translate3d(-50%, 0, 0); }
    }

    @media (max-width: 768px) {
      main { padding: 20px 16px 96px; }
      .frame { padding: 20px; }
      .marquee { padding: 16px 0; }
      .marquee-item { padding: 0 20px; letter-spacing: 0.12em; }
    }
  </style>
</head>
<body>
  <main>
    <div class="frame">
      <img class="logo" src="${safeLogo}" alt="${safeSiteName}">
      <div class="caption">Скоро вы узнаете, кто здесь главный</div>
    </div>
  </main>
  <div class="marquee" aria-label="О проекте">
    <div class="marquee-track">${marqueeGroups}</div>
  </div>
</body>
</html>`
}

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') return

  const accept = getRequestHeader(event, 'accept') || ''
  if (!accept.includes('text/html')) return

  const path = getRequestURL(event).pathname
  if (SKIP_PATHS.has(path) || SKIP_PREFIXES.some((prefix) => path.startsWith(prefix))) return

  try {
    const settings = await getSiteSettings(SPLASH_SETTING_KEYS)
    if (getSiteSetting(settings, 'SPLASH_ENABLED') !== 'true') return

    const config = useRuntimeConfig(event)
    const logo = getNonEmptySiteSetting(
      settings,
      'SPLASH_LOGO',
      DEFAULT_SPLASH_LOGO,
    )
    const marquee = getNonEmptySiteSetting(
      settings,
      'SPLASH_MARQUEE',
      DEFAULT_SPLASH_MARQUEE,
    )

    setResponseHeader(event, 'content-type', 'text/html; charset=UTF-8')

    return renderSplashPage(
      config.public.siteName,
      config.public.siteUrl,
      logo,
      marquee,
    )
  }
  catch {
    return
  }
})
