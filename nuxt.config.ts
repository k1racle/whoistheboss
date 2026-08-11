import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000'
const siteName = process.env.SITE_NAME ?? 'Кто здесь главный?'
const siteDescription = process.env.SITE_DESCRIPTION ?? 'Интервью с основателями бизнеса. Видео, рилсы, фото.'
const uploadDir = resolve(process.env.UPLOAD_DIR ?? './public/uploads')
const imageRootDir = resolve(uploadDir, '..')

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxtjs/seo',
  ],

  image: {
    provider: 'ipx',
    dirs: [imageRootDir],
    ipx: {
      fs: {
        dir: imageRootDir,
      },
    },
  },

  ogImage: false,

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
    '/admin/**': { robots: 'noindex, nofollow', sitemap: false },
    '/api/**': { robots: 'noindex, nofollow', sitemap: false },
    '/login': { robots: 'noindex, nofollow', sitemap: false },
    '/register': { robots: 'noindex, nofollow', sitemap: false },
    '/businesses': { sitemap: false },
    '/businesses/**': { sitemap: false },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  $development: {
    routeRules: {
      '/admin/**': { proxy: 'http://127.0.0.1:5173/admin/**' },
    },
  },

  nitro: {
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
      htmlAttrs: {
        lang: 'ru',
      },
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'apple-mobile-web-app-title', content: 'Кто здесь главный?' },
      ],
      link: [
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
    adminSeedPassword: process.env.ADMIN_SEED_PASSWORD ?? 'admin123',
    smtpHost: process.env.SMTP_HOST ?? '',
    smtpPort: Number.parseInt(process.env.SMTP_PORT ?? '587', 10),
    smtpUser: process.env.SMTP_USER ?? '',
    smtpPass: process.env.SMTP_PASS ?? '',
    fromEmail: process.env.FROM_EMAIL ?? '',
    adminEmail: process.env.ADMIN_EMAIL ?? '',
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
    telegramChatId: process.env.TELEGRAM_CHAT_ID ?? '',
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
