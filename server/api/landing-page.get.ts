import { getSiteSettings, getSiteSetting } from '@server/utils/site-settings'

const LANDING_PAGE_KEYS = [
  'HOME_HERO_TITLE',
  'HOME_ABOUT_TITLE',
  'HOME_ABOUT_TEXT',
  'HOME_ABOUT_BOTTOM_TEXT',
  'HOME_ABOUT_VIDEO_TYPE',
  'HOME_ABOUT_VIDEO_URL',
  'HOME_ABOUT_VIDEO_FILE',
  'HOME_ABOUT_HOVER_VIDEO_TYPE',
  'HOME_ABOUT_HOVER_VIDEO_URL',
  'HOME_ABOUT_HOVER_VIDEO_FILE',
  'HOME_AUDIENCE_TITLE',
  'HOME_HEROES_TITLE',
  'HOME_HEROES_TEXT',
  'HOME_PLACES_TITLE',
  'HOME_PLACES_TEXT',
  'HOME_LATEST_NEWS_TITLE',
  'HOME_CTA_TITLE',
  'HOME_CTA_FORM_TITLE',
  'HOME_CTA_FORM_DESCRIPTION',
  'HOME_BANNER_IMAGE',
  'HOME_BANNER_MOBILE_IMAGE',
  'HOME_BANNER_LINK',
] as const

export default defineEventHandler(async () => {
  const settings = await getSiteSettings(LANDING_PAGE_KEYS)
  const aboutVideoFile = getSiteSetting(settings, 'HOME_ABOUT_VIDEO_FILE')
  const aboutHoverVideoFile = getSiteSetting(settings, 'HOME_ABOUT_HOVER_VIDEO_FILE')
  const aboutVideoType = aboutVideoFile || getSiteSetting(settings, 'HOME_ABOUT_VIDEO_TYPE') === 'SELF_HOSTED'
    ? 'SELF_HOSTED'
    : 'EMBED'
  const aboutHoverVideoType = aboutHoverVideoFile || getSiteSetting(settings, 'HOME_ABOUT_HOVER_VIDEO_TYPE') === 'SELF_HOSTED'
    ? 'SELF_HOSTED'
    : 'EMBED'

  return {
    heroTitle: getSiteSetting(settings, 'HOME_HERO_TITLE', 'Кто здесь\nглавный?'),
    aboutTitle: getSiteSetting(settings, 'HOME_ABOUT_TITLE', 'О проекте'),
    aboutText: getSiteSetting(
      settings,
      'HOME_ABOUT_TEXT',
      'Мы рассказываем личные истории предпринимателей через их дело. За каждым рестораном, магазином, студией, производством или компанией стоит человек со своим путем, идеями, победами и трудностями. Именно эти истории мы показываем честно и без прикрас.\n\nНаши интервью, биографии, статьи и репортажи помогают увидеть не только успешный бизнес, но и людей, которые стоят за ним. Потому что главное не вывеска, а человек, который ее создал.',
    ),
    aboutBottomText: getSiteSetting(
      settings,
      'HOME_ABOUT_BOTTOM_TEXT',
      'Мы убеждены, что каждый успешный бизнес начинается с человека. Поэтому рассказываем не только о компаниях и проектах, но прежде всего о людях, которые их создали.',
    ),
    aboutVideoType,
    aboutVideoUrl: getSiteSetting(settings, 'HOME_ABOUT_VIDEO_URL'),
    aboutVideoFile,
    aboutHoverVideoType,
    aboutHoverVideoUrl: getSiteSetting(settings, 'HOME_ABOUT_HOVER_VIDEO_URL'),
    aboutHoverVideoFile,
    audienceTitle: getSiteSetting(settings, 'HOME_AUDIENCE_TITLE', 'ДЛЯ\nКОГО'),
    heroesTitle: getSiteSetting(settings, 'HOME_HEROES_TITLE', 'Наши герои'),
    heroesText: getSiteSetting(
      settings,
      'HOME_HEROES_TEXT',
      'Главные герои проекта — предприниматели, которые своим трудом, идеями и решениями создают бизнес и меняют окружающий мир. У каждого из них свой путь, свои ценности и своя история. Мы знакомим вас с людьми, которые стоят за известными компаниями, предприятиями, ресторанами, магазинами и другими успешными проектами.',
    ),
    placesTitle: getSiteSetting(settings, 'HOME_PLACES_TITLE', 'Места'),
    placesText: getSiteSetting(
      settings,
      'HOME_PLACES_TEXT',
      'Компании и проекты наших героев: места, бренды и команды, за которыми стоят реальные предпринимательские истории.',
    ),
    latestNewsTitle: getSiteSetting(settings, 'HOME_LATEST_NEWS_TITLE', 'Главные статьи'),
    ctaTitle: getSiteSetting(settings, 'HOME_CTA_TITLE', 'Стать\nучастником'),
    ctaFormTitle: getSiteSetting(
      settings,
      'HOME_CTA_FORM_TITLE',
      'Заполните ваши данные\nдля связи',
    ),
    ctaFormDescription: getSiteSetting(
      settings,
      'HOME_CTA_FORM_DESCRIPTION',
      'Отправьте нам заявку и мы перезвоним.',
    ),
    bannerImage: getSiteSetting(settings, 'HOME_BANNER_IMAGE'),
    bannerMobileImage: getSiteSetting(settings, 'HOME_BANNER_MOBILE_IMAGE'),
    bannerLink: getSiteSetting(settings, 'HOME_BANNER_LINK', '/entrepreneurs'),
  }
})
