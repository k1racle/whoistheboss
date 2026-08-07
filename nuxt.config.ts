import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@vueuse/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  routeRules: {
    '/admin': { redirect: '/admin/' },
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
    uploadDir: process.env.UPLOAD_DIR ?? './public/uploads',
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
      siteUrl: process.env.SITE_URL ?? 'http://localhost:3000',
      siteName: process.env.SITE_NAME ?? 'Кто здесь главный?',
      siteDescription: process.env.SITE_DESCRIPTION ?? 'Интервью с основателями бизнеса. Видео, рилсы, фото.',
    },
  },
})
