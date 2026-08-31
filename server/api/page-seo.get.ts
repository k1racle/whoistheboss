import type { PageSeoData, PageSeoKey } from '@shared/seo/page-seo'
import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'

const PAGE_SEO: Record<PageSeoKey, {
  prefix: string
  title: (siteName: string) => string
  description: string
}> = {
  home: {
    prefix: 'HOME',
    title: siteName => siteName,
    description: 'Медиа-гид о предпринимателях, компаниях и людях, которые создают и развивают бизнес в России.',
  },
  entrepreneurs: {
    prefix: 'ENTREPRENEURS',
    title: siteName => `Предприниматели — ${siteName}`,
    description: 'Истории предпринимателей, руководителей и основателей компаний: их путь, решения, проекты и опыт развития бизнеса.',
  },
  companies: {
    prefix: 'COMPANIES',
    title: siteName => `Бизнес — ${siteName}`,
    description: 'Компании, рестораны, магазины и другие проекты героев «Маршрут Построен»: история создания, команда и ключевые факты.',
  },
  blog: {
    prefix: 'BLOG',
    title: siteName => `Журнал — ${siteName}`,
    description: 'Статьи, новости и разборы о предпринимателях, российских компаниях, продуктах и развитии бизнеса.',
  },
  interviews: {
    prefix: 'INTERVIEWS',
    title: siteName => `Интервью — ${siteName}`,
    description: 'Видеоинтервью с предпринимателями и основателями бизнеса о решениях, трудностях, командах и развитии проектов.',
  },
  reels: {
    prefix: 'REELS',
    title: siteName => `Рилсы — ${siteName}`,
    description: 'Короткие видео с предпринимателями: практический опыт, быстрые ответы и главные мысли героев проекта.',
  },
  contacts: {
    prefix: 'CONTACTS',
    title: siteName => `Контакты — ${siteName}`,
    description: 'Контакты редакции проекта «Маршрут Построен»: адрес, телефон, электронная почта и форма обратной связи.',
  },
}

const ALL_KEYS = [
  'SITE_NAME',
  'SEO_DEFAULT_IMAGE',
  ...Object.values(PAGE_SEO).flatMap(({ prefix }) => [
    `SEO_${prefix}_TITLE`,
    `SEO_${prefix}_DESCRIPTION`,
    `SEO_${prefix}_IMAGE`,
  ]),
] as const

export default defineEventHandler(async (event): Promise<PageSeoData> => {
  const requestedPage = String(getQuery(event).page || '') as PageSeoKey
  const definition = PAGE_SEO[requestedPage]
  if (!definition) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported SEO page' })
  }

  const config = useRuntimeConfig(event)
  const settings = await getSiteSettings(ALL_KEYS)
  const siteName = getSiteSetting(settings, 'SITE_NAME', config.public.siteName)
  const key = `SEO_${definition.prefix}`

  return {
    title: getSiteSetting(settings, `${key}_TITLE`, definition.title(siteName)),
    description: getSiteSetting(settings, `${key}_DESCRIPTION`, definition.description),
    image: getSiteSetting(
      settings,
      `${key}_IMAGE`,
      getSiteSetting(settings, 'SEO_DEFAULT_IMAGE', '/favicon/web-app-manifest-512x512.png'),
    ),
  }
})
