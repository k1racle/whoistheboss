import type { EntrepreneurListItem } from '@features/entrepreneurs/model/entrepreneur.types'
import type { CompanyCatalogItem } from '@features/companies/model/companies-page.types'

export type LandingHeroCard = {
  id: string
  name: string
  role: string
  company: string
  image: string
  imageHover: string
  imageAlt: string
  href?: string
}

export type LandingArticle = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  entrepreneurName: string | null
  coverImage: string | null
}

export type LandingAudienceCard = {
  id: string
  title: string
  description?: string
  hoverTitle?: string
  hoverDescription?: string
}

export type LandingLatestArticles = {
  articles: LandingArticle[]
  hasMore: boolean
  pageSize: number
}

export const landingAboutParagraphs = [
  'Мы рассказываем личные истории предпринимателей через их дело. За каждым рестораном, магазином, студией, производством или компанией стоит человек со своим путем, идеями, победами и трудностями. Именно эти истории мы показываем честно и без прикрас.',
  'Наши интервью, биографии, статьи и репортажи помогают увидеть не только успешный бизнес, но и людей, которые стоят за ним. Потому что главное не вывеска, а человек, который ее создал.',
] as const

export const landingHeroesDescription = 'Главные герои проекта — предприниматели, которые своим трудом, идеями и решениями создают бизнес и меняют окружающий мир. У каждого из них свой путь, свои ценности и своя история. Мы знакомим вас с людьми, которые стоят за известными компаниями, предприятиями, ресторанами, магазинами и другими успешными проектами.'

export type LandingPageData = {
  heroTitle: string
  aboutTitle: string
  aboutText: string
  aboutBottomText: string
  aboutVideoType: 'EMBED' | 'SELF_HOSTED'
  aboutVideoUrl: string
  aboutVideoFile: string
  aboutHoverVideoType: 'EMBED' | 'SELF_HOSTED'
  aboutHoverVideoUrl: string
  aboutHoverVideoFile: string
  audienceTitle: string
  heroesTitle: string
  heroesText: string
  placesTitle: string
  placesText: string
  latestNewsTitle: string
  ctaTitle: string
  ctaFormTitle: string
  ctaFormDescription: string
  bannerImage: string
  bannerMobileImage: string
  bannerLink: string
  entrepreneurs: EntrepreneurListItem[]
  audienceCards: LandingAudienceCard[]
  places: CompanyCatalogItem[]
  latestArticles: LandingLatestArticles
}


export const landingAudienceIntro =
  'Мы убеждены, что каждый успешный бизнес начинается с человека. Поэтому рассказываем не только о компаниях и проектах, но прежде всего о людях, которые их создали.'

export const landingAudienceFallback: LandingAudienceCard[] = [
  { id: 'entrepreneurs', title: 'Предприниматели', hoverTitle: 'Герои бизнеса' },
  { id: 'managers', title: 'Руководители', hoverTitle: 'Лидеры команд' },
  { id: 'founders', title: 'Основатели компаний', hoverTitle: 'Создатели идей' },
  { id: 'business-owners', title: 'Владельцы собственного бизнеса', hoverTitle: 'Те, кто строит свое' },
  { id: 'managing-partners', title: 'Управляющие партнеры', hoverTitle: 'Лица решений' },
  { id: 'ceos', title: 'Генеральные директора', hoverTitle: 'Те, кто ведет вперед' },
  { id: 'creators', title: 'Создатели чего-то', hoverTitle: 'Авторы нового' },
] as const

export const landingPlacesDescription = 'Компании и проекты наших героев: места, бренды и команды, за которыми стоят реальные предпринимательские истории.'

export const landingPageFallback: LandingPageData = {
  heroTitle: 'Кто здесь\nглавный?',
  aboutTitle: 'О проекте',
  aboutText: landingAboutParagraphs.join('\n\n'),
  aboutBottomText: landingAudienceIntro,
  aboutVideoType: 'EMBED',
  aboutVideoUrl: '',
  aboutVideoFile: '',
  aboutHoverVideoType: 'EMBED',
  aboutHoverVideoUrl: '',
  aboutHoverVideoFile: '',
  audienceTitle: 'ДЛЯ\nКОГО',
  heroesTitle: 'Наши герои',
  heroesText: landingHeroesDescription,
  placesTitle: 'Места',
  placesText: landingPlacesDescription,
  latestNewsTitle: 'Главные статьи',
  ctaTitle: 'Стать\nучастником',
  ctaFormTitle: 'Заполните ваши данные\nдля связи',
  ctaFormDescription: 'Отправьте нам заявку и мы перезвоним.',
  bannerImage: '',
  bannerMobileImage: '',
  bannerLink: '/entrepreneurs',
  entrepreneurs: [],
  audienceCards: [],
  places: [],
  latestArticles: {
    articles: [],
    hasMore: false,
    pageSize: 6,
  },
}
