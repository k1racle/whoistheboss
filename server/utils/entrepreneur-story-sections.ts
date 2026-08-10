import type { Entrepreneur, Prisma } from '@prisma/client'
import type { AdditionalSectionData } from '@shared/types/additional-section'

const FIXED_SECTION_ORDER = [
  'hero',
  'about',
  'shorts',
  'more',
  'featuredInterview',
  'articles',
  'cta',
  'banner',
  'interviewList',
] as const

const LEGACY_SECTION_IDS = {
  biography: 'legacy-biography',
  childhood: 'legacy-childhood',
  education: 'legacy-education',
  turnover: 'legacy-turnover',
} as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function nullableText(value: unknown, fallback: string | null = null): string | null {
  return typeof value === 'string' ? value : fallback
}

function boolean(value: unknown, fallback = true): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function splitLines(value: string | null | undefined): string[] {
  return (value || '').split(/\r?\n/).map(item => item.trim())
}

function normalizeStoredSection(
  value: unknown,
  index: number,
  entrepreneurName: string,
  fallbackImage: string | null,
): AdditionalSectionData | null {
  if (!isRecord(value) || typeof value.id !== 'string') return null

  const base = {
    id: value.id,
    isVisible: boolean(value.isVisible),
    menuLabel: text(value.menuLabel, `Раздел ${index + 1}`),
    menuDescription: text(value.menuDescription),
    menuImage: nullableText(value.menuImage, fallbackImage),
  }

  switch (value.type) {
    case 'BIOGRAPHY':
      return {
        ...base,
        type: 'BIOGRAPHY',
        eyebrow: text(value.eyebrow, 'Биография'),
        title: text(value.title, entrepreneurName.toUpperCase()),
        textOne: text(value.textOne),
        textTwo: text(value.textTwo),
        textThree: text(value.textThree),
        image: nullableText(value.image, fallbackImage),
      }
    case 'ACCENT':
      return {
        ...base,
        type: 'ACCENT',
        title: text(value.title),
        textOne: text(value.textOne),
        textTwo: text(value.textTwo),
      }
    case 'PORTRAIT':
      return {
        ...base,
        type: 'PORTRAIT',
        title: text(value.title),
        text: text(value.text),
        asideText: text(value.asideText),
        image: nullableText(value.image, fallbackImage),
      }
    case 'WIDE':
      return {
        ...base,
        type: 'WIDE',
        title: text(value.title),
        text: text(value.text),
        bottomText: text(value.bottomText),
        image: nullableText(value.image, fallbackImage),
      }
    default:
      return null
  }
}

export function normalizeEntrepreneurStorySections(
  entrepreneur: Entrepreneur,
  sectionVisibility: Record<string, boolean>,
  galleryImages: string[],
  biographyFallback: string[],
  bodyFallback: string,
): AdditionalSectionData[] {
  const raw = entrepreneur.storySections as Prisma.JsonValue | null
  const fallbackImage = entrepreneur.photo || galleryImages[0] || null

  if (Array.isArray(raw)) {
    return raw
      .map((item, index) => normalizeStoredSection(item, index, entrepreneur.name, fallbackImage))
      .filter((item): item is AdditionalSectionData => item !== null)
  }

  const labels = splitLines(entrepreneur.aboutMenuLabels)
  const descriptions = splitLines(entrepreneur.aboutMenuDescriptions)
  const biographyTexts = [
    entrepreneur.biographyTextOne,
    entrepreneur.biographyTextTwo,
    entrepreneur.biographyTextThree,
  ].map(item => (item || '').trim()).filter(Boolean)
  const biographyBlocks = biographyTexts.length ? biographyTexts : biographyFallback

  return [
    {
      id: LEGACY_SECTION_IDS.biography,
      type: 'BIOGRAPHY',
      isVisible: sectionVisibility.biography !== false,
      menuLabel: labels[0] || `Who's the ${entrepreneur.name}?`,
      menuDescription: descriptions[0] || 'Краткая информация и навигация по странице героя.',
      menuImage: galleryImages[0] || fallbackImage,
      eyebrow: 'Биография',
      title: entrepreneur.name.toUpperCase(),
      textOne: biographyBlocks[0] || '',
      textTwo: biographyBlocks[1] || '',
      textThree: biographyBlocks[2] || '',
      image: entrepreneur.biographyPhoto || fallbackImage,
    },
    {
      id: LEGACY_SECTION_IDS.childhood,
      type: 'ACCENT',
      isVisible: sectionVisibility.childhood !== false,
      menuLabel: labels[1] || 'Краткая биография',
      menuDescription: descriptions[1] || 'Детство, интересы и обстоятельства, которые сформировали взгляд на дело.',
      menuImage: galleryImages[1] || fallbackImage,
      title: entrepreneur.childhoodTitle || 'Детство, среда и первые ориентиры',
      textOne: entrepreneur.childhoodTextOne || bodyFallback || entrepreneur.quote || '',
      textTwo: entrepreneur.childhoodTextTwo || '',
    },
    {
      id: LEGACY_SECTION_IDS.education,
      type: 'PORTRAIT',
      isVisible: sectionVisibility.education !== false,
      menuLabel: labels[2] || 'Начало карьеры',
      menuDescription: descriptions[2] || 'Образование, первые роли и профессиональный опыт.',
      menuImage: galleryImages[2] || fallbackImage,
      title: entrepreneur.educationTitle || 'Образование\nи опыт\nработы',
      text: entrepreneur.educationText || bodyFallback || entrepreneur.title,
      asideText: entrepreneur.educationAsideText || '',
      image: entrepreneur.educationPhoto || fallbackImage,
    },
    {
      id: LEGACY_SECTION_IDS.turnover,
      type: 'WIDE',
      isVisible: sectionVisibility.turnover !== false,
      menuLabel: labels[3] || 'Первые успехи в бизнесе',
      menuDescription: descriptions[3] || 'Решения, которые привели к первым заметным результатам.',
      menuImage: galleryImages[3] || fallbackImage,
      title: entrepreneur.turnoverTitle || 'Первые успехи\nв бизнесе',
      text: entrepreneur.turnoverText || bodyFallback || entrepreneur.title,
      bottomText: entrepreneur.turnoverBottomText || '',
      image: entrepreneur.turnoverPhoto || fallbackImage,
    },
  ]
}

export function normalizeEntrepreneurSectionOrder(
  raw: string | null | undefined,
  storySections: AdditionalSectionData[],
): string[] {
  const storyKeys = storySections.map(section => `story:${section.id}`)
  const defaults = [
    'hero',
    'about',
    ...storyKeys.slice(0, 3),
    'shorts',
    ...storyKeys.slice(3),
    'more',
    'featuredInterview',
    'articles',
    'cta',
    'banner',
    'interviewList',
  ]
  const allowed = new Set<string>([...FIXED_SECTION_ORDER, ...storyKeys])
  const legacyKeyMap = Object.fromEntries(
    Object.entries(LEGACY_SECTION_IDS).map(([key, id]) => [key, `story:${id}`]),
  )

  let saved: string[] = []
  try {
    const parsed = JSON.parse(raw || '[]') as unknown
    if (Array.isArray(parsed)) {
      saved = parsed
        .filter((item): item is string => typeof item === 'string')
        .map(item => legacyKeyMap[item] || item)
        .filter((item, index, items) => allowed.has(item) && items.indexOf(item) === index)
    }
  }
  catch {
    saved = []
  }

  return [...saved, ...defaults.filter(key => !saved.includes(key))]
}
