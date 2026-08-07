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

export type LandingPlaceCard = {
  slug: string
  name: string
  type: string
  coverImage: string | null
  description: string | null
}


export const landingAboutParagraphs = [
  'Мы рассказываем личные истории предпринимателей через их дело. За каждым рестораном, магазином, студией, производством или компанией стоит человек со своим путем, идеями, победами и трудностями. Именно эти истории мы показываем честно и без прикрас.',
  'Наши интервью, биографии, статьи и репортажи помогают увидеть не только успешный бизнес, но и людей, которые стоят за ним. Потому что главное не вывеска, а человек, который ее создал.',
] as const

export const landingHeroesDescription = 'Главные герои проекта — предприниматели, которые своим трудом, идеями и решениями создают бизнес и меняют окружающий мир. У каждого из них свой путь, свои ценности и своя история. Мы знакомим вас с людьми, которые стоят за известными компаниями, предприятиями, ресторанами, магазинами и другими успешными проектами.'

export const landingFeaturedHero = {
  name: 'Андрей Шевченко',
  role: 'Мидийное место',
  image: '/uploads/frame-1321315980-1785315691463.png',
  imageHover: undefined,
  imageAlt: 'Промо-баннер с Андреем Шевченко',
} as const

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

export const landingHeroes: LandingHeroCard[] = [
  {
    id: 'andrey-shevchenko',
    name: 'Андрей Шевченко',
    role: 'Управляющий партнер',
    company: 'Мидийное место',
    image: '/uploads/property-1-default-1784802691081.png',
    imageHover: '/uploads/property-1-hover-1784802691081.png',
    imageAlt: 'Карточка героя Андрея Шевченко',
  },
  {
    id: 'elenika-korelova',
    name: 'Эленика Корелова',
    role: 'Управляющий партнер',
    company: 'Zanoza Open Bar',
    image: '/uploads/property-1-default-1-1784803027388.png',
    imageHover: '/uploads/property-1-hover-1-1784803027388.png',
    imageAlt: 'Карточка героя Эленики Кореловой',
  },
  {
    id: 'vyacheslav-morkovskiy',
    name: 'Вячеслав Морковский',
    role: 'Управляющий партнер',
    company: 'Big Baby Burger',
    image: '/uploads/property-1-default-2-1784803092347.png',
    imageHover: '/uploads/property-1-hover-2-1784803092347.png',
    imageAlt: 'Карточка героя Вячеслава Морковского',
  },
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
  bannerImage: landingFeaturedHero.image,
  bannerMobileImage: '',
  bannerLink: '/entrepreneurs',
}
