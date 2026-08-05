import type {
  ShootingFaqItem,
  ShootingPageData,
  ShootingStageItem,
} from '@features/shooting-request/model/shooting-page.types'
import { parseSectionOrder, parseSectionVisibility } from '@shared/lib/section-config'
import { safeJsonParse } from '@server/utils/json'
import { getSiteSetting, getSiteSettings } from '@server/utils/site-settings'

const SHOOTING_PAGE_KEYS = [
  'SHOOTING_PAGE_HERO_TITLE',
  'SHOOTING_PAGE_TITLE',
  'SHOOTING_PAGE_DESCRIPTION',
  'SHOOTING_PAGE_ABOUT_TITLE',
  'SHOOTING_PAGE_ABOUT_TEXT',
  'SHOOTING_PAGE_ABOUT_BOTTOM_TEXT',
  'SHOOTING_PAGE_ABOUT_VIDEO_TYPE',
  'SHOOTING_PAGE_ABOUT_VIDEO_URL',
  'SHOOTING_PAGE_ABOUT_VIDEO_FILE',
  'SHOOTING_PAGE_FAQ_TITLE',
  'SHOOTING_PAGE_FAQ_JSON',
  'SHOOTING_PAGE_SECTION_ORDER',
  'SHOOTING_PAGE_SECTION_VISIBILITY',
  'HOME_STAGES_TITLE',
  'HOME_STAGES_JSON',
] as const

const DEFAULT_SECTION_ORDER = ['hero', 'about', 'stages', 'faq', 'cta'] as const

const DEFAULT_STAGES: ShootingStageItem[] = [
  {
    index: '01',
    title: 'Подготовка',
    subtitle: 'и сбор материалов',
    eyebrow: '[ как начинается проект ]',
    description: 'Знакомимся с героем и собираем материалы для будущего выпуска.',
  },
  {
    index: '02',
    title: 'Съемочный',
    subtitle: 'процесс',
    eyebrow: '[ фундамент проекта ]',
    description: 'Проводим интервью и съемку бизнеса в согласованной локации.',
  },
  {
    index: '03',
    title: 'Создание',
    subtitle: 'материалов',
    eyebrow: '[ визуализация ]',
    description: 'Готовим видео, фотографии и тексты для публикации.',
  },
  {
    index: '04',
    title: 'Публикация',
    subtitle: 'и продвижение',
    eyebrow: '[ реализация проекта ]',
    description: 'Публикуем готовый материал и усиливаем его в каналах проекта.',
  },
]

const DEFAULT_FAQ: ShootingFaqItem[] = [
  {
    question: 'Кто может стать героем проекта?',
    answer: 'Предприниматели, руководители и создатели проектов с реальным опытом и историей.',
  },
  {
    question: 'Как проходит отбор?',
    answer: 'Команда знакомится с заявкой, связывается с кандидатом и уточняет формат материала.',
  },
  {
    question: 'Что нужно отправить?',
    answer: 'Достаточно заполнить форму и кратко рассказать о себе, компании и теме истории.',
  },
]

function parseStages(value: string): ShootingStageItem[] {
  const parsed = safeJsonParse<unknown[]>(value, [])
  if (!Array.isArray(parsed) || !parsed.length) return DEFAULT_STAGES

  const stages = parsed
    .map((item) => ({
      index: typeof item === 'object' && item && 'index' in item ? String(item.index ?? '').trim() : '',
      title: typeof item === 'object' && item && 'title' in item ? String(item.title ?? '').trim() : '',
      subtitle: typeof item === 'object' && item && 'subtitle' in item ? String(item.subtitle ?? '').trim() : '',
      eyebrow: typeof item === 'object' && item && 'eyebrow' in item ? String(item.eyebrow ?? '').trim() : '',
      description: typeof item === 'object' && item && 'description' in item ? String(item.description ?? '').trim() : '',
    }))
    .filter((item) => item.title || item.description)

  return stages.length ? stages : DEFAULT_STAGES
}

function parseFaq(value: string): ShootingFaqItem[] {
  const parsed = safeJsonParse<unknown[]>(value, [])
  if (!Array.isArray(parsed) || !parsed.length) return DEFAULT_FAQ

  const faqItems = parsed
    .map((item) => ({
      question: typeof item === 'object' && item && 'question' in item ? String(item.question ?? '').trim() : '',
      answer: typeof item === 'object' && item && 'answer' in item ? String(item.answer ?? '').trim() : '',
    }))
    .filter((item) => item.question || item.answer)

  return faqItems.length ? faqItems : DEFAULT_FAQ
}

export default defineEventHandler(async (): Promise<ShootingPageData> => {
  const settings = await getSiteSettings(SHOOTING_PAGE_KEYS)

  const heroTitle = getSiteSetting(settings, 'SHOOTING_PAGE_HERO_TITLE', 'КАК ПРИНЯТЬ\nУЧАСТИЕ')
  const seoTitle = getSiteSetting(settings, 'SHOOTING_PAGE_TITLE', 'Стать героем')
  const seoDescription = getSiteSetting(settings, 'SHOOTING_PAGE_DESCRIPTION')
  const aboutTitle = getSiteSetting(settings, 'SHOOTING_PAGE_ABOUT_TITLE', 'О ПРОЕКТЕ')
  const aboutText = getSiteSetting(settings, 'SHOOTING_PAGE_ABOUT_TEXT')
  const aboutBottomText = getSiteSetting(settings, 'SHOOTING_PAGE_ABOUT_BOTTOM_TEXT')
  const aboutVideoType = getSiteSetting(settings, 'SHOOTING_PAGE_ABOUT_VIDEO_TYPE', 'EMBED') === 'SELF_HOSTED'
    ? 'SELF_HOSTED'
    : 'EMBED'
  const aboutVideoUrl = getSiteSetting(settings, 'SHOOTING_PAGE_ABOUT_VIDEO_URL')
  const aboutVideoFile = getSiteSetting(settings, 'SHOOTING_PAGE_ABOUT_VIDEO_FILE')
  const stagesTitle = getSiteSetting(settings, 'HOME_STAGES_TITLE', 'ЭТАПЫ')
  const faqTitle = getSiteSetting(settings, 'SHOOTING_PAGE_FAQ_TITLE', 'FAQ')

  return {
    heroTitle,
    seoTitle,
    seoDescription,
    aboutTitle,
    aboutText,
    aboutBottomText,
    aboutVideoType,
    aboutVideoUrl,
    aboutVideoFile,
    stagesTitle,
    stages: parseStages(getSiteSetting(settings, 'HOME_STAGES_JSON')),
    faqTitle,
    faqItems: parseFaq(getSiteSetting(settings, 'SHOOTING_PAGE_FAQ_JSON')),
    sectionOrder: parseSectionOrder(
      getSiteSetting(settings, 'SHOOTING_PAGE_SECTION_ORDER'),
      DEFAULT_SECTION_ORDER,
    ),
    sectionVisibility: parseSectionVisibility(
      getSiteSetting(settings, 'SHOOTING_PAGE_SECTION_VISIBILITY'),
    ),
  }
})
