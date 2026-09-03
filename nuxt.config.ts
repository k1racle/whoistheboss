import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { normalizeConfiguredSiteName, SEO_FALLBACK_DESCRIPTION } from './app/shared/seo/brand'

const siteUrl = process.env.SITE_URL ?? 'https://xn----7sbqzieaghadljej2f.xn--p1ai'
const siteName = normalizeConfiguredSiteName(process.env.SITE_NAME)
const siteDescription = process.env.SITE_DESCRIPTION ?? SEO_FALLBACK_DESCRIPTION
const uploadDir = resolve(process.env.UPLOAD_DIR ?? './public/uploads')
const nitroCacheDir = resolve('./.data/nitro-cache')

const cachedRouteRules: Record<string, { swr: number }> = {
  '/': { swr: 60 },
  '/blog': { swr: 60 },
  '/blog/**': { swr: 60 },
  '/companies': { swr: 60 },
  '/companies/**': { swr: 60 },
  '/entrepreneurs': { swr: 60 },
  '/entrepreneurs/**': { swr: 60 },
  '/interviews': { swr: 60 },
  '/interviews/**': { swr: 60 },
  '/reels': { swr: 60 },
  '/reels/**': { swr: 60 },
  '/videos': { swr: 60 },
  '/contacts': { swr: 60 },
  '/shooting-request': { swr: 60 },
  '/tovarnyy-znak-marshrut-postroen': { swr: 60 },
  '/privacy-policy': { swr: 300 },
  '/api/site-footer': { swr: 300 },
  '/api/site-banner': { swr: 60 },
  '/api/landing-page': { swr: 60 },
  '/api/landing/audience-cards': { swr: 60 },
  '/api/articles/latest': { swr: 60 },
  '/api/businesses': { swr: 60 },
  '/api/blog-page': { swr: 60 },
  '/api/blog/**': { swr: 60 },
  '/api/companies-page': { swr: 60 },
  '/api/companies/**': { swr: 60 },
  '/api/entrepreneurs-page': { swr: 60 },
  '/api/entrepreneurs/**': { swr: 60 },
  '/api/interviews': { swr: 60 },
  '/api/interviews/**': { swr: 60 },
  '/api/reels': { swr: 60 },
  '/api/reels/**': { swr: 60 },
  '/api/videos': { swr: 60 },
  '/api/contacts': { swr: 60 },
  '/api/shooting-page': { swr: 60 },
  '/api/trademark-page': { swr: 60 },
  '/api/privacy-policy': { swr: 300 },
  '/api/page-seo': { swr: 300 },
}

const developmentRouteRules = Object.fromEntries(
  Object.keys(cachedRouteRules).map(route => [route, { swr: false }]),
)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  hooks: {
    'pages:extend'(pages) {
      const cityPages = [
        ['city-home', '/:city', 'app/pages/index.vue'],
        ['city-entrepreneurs', '/:city/entrepreneurs', 'app/pages/entrepreneurs/index.vue'],
        ['city-entrepreneur', '/:city/entrepreneurs/:slug', 'app/pages/entrepreneurs/[slug].vue'],
        ['city-companies', '/:city/companies', 'app/pages/companies/index.vue'],
        ['city-company', '/:city/companies/:slug', 'app/pages/companies/[slug].vue'],
        ['city-businesses', '/:city/businesses', 'app/pages/businesses/index.vue'],
        ['city-business', '/:city/businesses/:slug', 'app/pages/businesses/[slug].vue'],
        ['city-blog', '/:city/blog', 'app/pages/blog/index.vue'],
        ['city-article', '/:city/blog/:slug', 'app/pages/blog/[slug].vue'],
        ['city-interviews', '/:city/interviews', 'app/pages/interviews/index.vue'],
        ['city-interview', '/:city/interviews/:slug', 'app/pages/interviews/[slug].vue'],
        ['city-reels', '/:city/reels', 'app/pages/reels/index.vue'],
        ['city-reel', '/:city/reels/:slug', 'app/pages/reels/[slug].vue'],
      ] as const

      cityPages.forEach(([name, path, file]) => {
        pages.push({ name, path, file: resolve(__dirname, file) })
      })
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    'nuxt-site-config',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    'nuxt-link-checker',
    'nuxt-schema-org',
    'nuxt-seo-utils',
  ],

  image: {
    provider: 'persistent',
    quality: 96,
    providers: {
      persistent: {
        provider: './app/shared/image/persistent-provider.ts',
      },
    },
  },

  site: {
    url: siteUrl,
    name: siteName,
    description: siteDescription,
    defaultLocale: 'ru',
    trailingSlash: false,
  },

  robots: {
    disallow: ['/admin', '/login', '/register'],
    sitemap: '/sitemap.xml',
    mergeWithRobotsTxtPath: false,
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: [
      '/admin/**',
      '/api/**',
      '/login',
      '/register',
      '/businesses',
      '/businesses/**',
    ],
  },

  schemaOrg: {
    identity: {
      '@type': 'Organization',
      name: siteName,
      alternateName: 'Маршрут построен',
      url: siteUrl,
      logo: '/favicon/web-app-manifest-512x512.png',
    },
  },

  seo: {
    canonicalQueryWhitelist: [],
    redirectToCanonicalSiteUrl: false,
  },

  linkChecker: {
    failOnError: false,
    excludeLinks: ['/admin/**', '/api/**', '/uploads/**'],
  },

  routeRules: {
    ...cachedRouteRules,
    // Do not attach SWR to `/:city/**`: that wildcard also matches service
    // routes such as /api, /admin, /uploads and /media. City pages remain
    // dynamic so binary responses and mutation endpoints bypass page caching.
    '/api/cities': { swr: 300 },
    '/media/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
    '/uploads/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
    '/admin/**': { robots: 'noindex, nofollow', sitemap: false },
    '/api/**': { robots: 'noindex, nofollow', sitemap: false },
    '/login': { robots: 'noindex, nofollow', sitemap: false },
    '/register': { robots: 'noindex, nofollow', sitemap: false },
    '/health': { robots: 'noindex, nofollow', sitemap: false },
    '/businesses': { sitemap: false },
    '/businesses/**': { sitemap: false },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  $development: {
    routeRules: {
      ...developmentRouteRules,
      '/admin/**': { proxy: 'http://127.0.0.1:5173/admin/**' },
    },
    nitro: {
      // Nitro's dev router treats `:key.txt` as one dynamic parameter and
      // otherwise intercepts `/` and every single-segment public route.
      // Production keeps the IndexNow verification endpoint unchanged.
      ignore: ['routes/[[]key[]].txt.get.ts'],
    },
  },

  nitro: {
    compressPublicAssets: true,
    storage: {
      cache: {
        driver: 'fs',
        base: nitroCacheDir,
      },
    },
    publicAssets: [
      {
        baseURL: 'admin',
        dir: resolve(__dirname, 'dist/admin'),
        fallthrough: true,
      },
    ],
    serverAssets: [
      {
        baseName: 'admin',
        dir: resolve(__dirname, 'dist/admin'),
        pattern: 'index.html',
      },
    ],
  },

  app: {
    head: {
      titleTemplate: '%s',
      htmlAttrs: {
        lang: 'ru',
      },
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'apple-mobile-web-app-title', content: siteName },
        { name: 'yandex-verification', content: 'd15d7d69e47dbfb4' },
        { name: 'google-site-verification', content: 'ugG76OtpW7X-EHnACfPGilxtEPg26YLw6VNkDCd95uk' },
      ],
      script: [
        {
          type: 'text/javascript',
          innerHTML: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=112035140','ym');

            ym(112035140,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:'dataLayer',referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});
          `,
        },
      ],
      noscript: [
        {
          innerHTML: '<div><img src="https://mc.yandex.ru/watch/112035140" style="position:absolute;left:-9999px" alt=""></div>',
          tagPosition: 'bodyOpen',
        },
      ],
      link: [
        { rel: 'preload', href: '/fonts/DexaPro-Condensed-900-Black.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon/favicon-96x96.png' },
        { rel: 'shortcut icon', href: '/favicon/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
      ],
    },
  },

  alias: {
  '@features': resolve(__dirname, 'app/features'),
  '@shared': resolve(__dirname, 'app/shared'),
  '@server': resolve(__dirname, 'server'),
  '@admin': resolve(__dirname, 'src/admin'),
  },
  
  runtimeConfig: {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number.parseInt(process.env.PORT ?? '3000', 10),
    databaseUrl: process.env.DATABASE_URL ?? '',
    sessionSecret: process.env.SESSION_SECRET ?? '',
    uploadDir,
    maxUploadSizeMb: Number.parseInt(process.env.MAX_UPLOAD_SIZE_MB ?? '100', 10),
    maxImageUploadSizeMb: Number.parseInt(process.env.MAX_IMAGE_UPLOAD_SIZE_MB ?? '20', 10),
    imageCacheMaxMb: Number.parseInt(process.env.IMAGE_CACHE_MAX_MB ?? '512', 10),
    smtpHost: process.env.SMTP_HOST ?? '',
    smtpPort: Number.parseInt(process.env.SMTP_PORT ?? '587', 10),
    smtpUser: process.env.SMTP_USER ?? '',
    smtpPass: process.env.SMTP_PASS ?? '',
    fromEmail: process.env.FROM_EMAIL ?? '',
    adminEmail: process.env.ADMIN_EMAIL ?? '',
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
    telegramChatId: process.env.TELEGRAM_CHAT_ID ?? '',
    indexNowKey: process.env.INDEXNOW_KEY ?? '',
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || process.env.SESSION_SECRET || '',
    },
    public: {
      siteUrl,
      siteName,
      siteDescription,
    },
  },
})
