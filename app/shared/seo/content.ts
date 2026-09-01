interface EntrepreneurSeoSource {
  name: string
  title?: string | null
  metaTitle?: string | null
  metaDesc?: string | null
  heroRightTeaser?: string | null
  heroBottomRightTeaser?: string | null
}

interface CompanySeoSource {
  name: string
  type?: string | null
  description?: string | null
  metaTitle?: string | null
  metaDesc?: string | null
  heroTeaser?: string | null
  aboutText?: string | null
  city?: string | null
  owner?: {
    name?: string | null
  } | null
}

interface EditorialSeoSource {
  title: string
  subtitle?: string | null
  summary?: string | null
  description?: string | null
  metaTitle?: string | null
  metaDesc?: string | null
  entrepreneur?: {
    name?: string | null
  } | null
}

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&nbsp;': ' ',
  '&quot;': '"',
  '&#39;': "'",
  '&laquo;': '«',
  '&raquo;': '»',
}

export function normalizeSeoText(value: string | null | undefined) {
  if (!value) {
    return ''
  }

  return value
    .replace(/<[^>]*>/gu, ' ')
    .replace(/&(amp|nbsp|quot|#39|laquo|raquo);/giu, entity => HTML_ENTITIES[entity.toLocaleLowerCase('en-US')] || entity)
    .replace(/\s+/gu, ' ')
    .trim()
}

function sentence(value: string) {
  const normalized = normalizeSeoText(value).replace(/[,:;\s]+$/u, '')

  if (!normalized) {
    return ''
  }

  return /[.!?…]$/u.test(normalized) ? normalized : `${normalized}.`
}

function naturalCase(value: string) {
  const normalized = normalizeSeoText(value)
  const letters = normalized.replace(/[^a-zа-яё]+/giu, '')

  if (letters && letters === letters.toLocaleUpperCase('ru-RU')) {
    return normalized.toLocaleLowerCase('ru-RU')
  }

  return normalized
}

function upperFirst(value: string) {
  const normalized = naturalCase(value)
  return normalized ? `${normalized.charAt(0).toLocaleUpperCase('ru-RU')}${normalized.slice(1)}` : ''
}

function capitalizeMatch(value: string) {
  return value ? `${value.charAt(0).toLocaleUpperCase('ru-RU')}${value.slice(1)}` : value
}

function restoreNameCase(value: string, name: string) {
  return normalizeSeoText(name)
    .split(/\s+/u)
    .filter(word => word.length >= 4)
    .reduce((result, word) => {
      const stemLength = Math.max(4, word.length - 2)
      const stem = word.slice(0, stemLength).replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
      return result.replace(new RegExp(`(?<![\\p{L}\\p{N}])${stem}[а-яё-]*`, 'giu'), match => capitalizeMatch(match))
    }, value)
}

function restoreEditorialCase(value: string, entrepreneurName: string) {
  const restored = value
    .replace(/\bbig\s+baby\s+burger\b/giu, 'Big Baby Burger')
    .replace(/(?<![\p{L}\p{N}])краснодар([а-яё-]*)/giu, (_, ending: string) => `Краснодар${ending.toLocaleLowerCase('ru-RU')}`)
    .replace(/(?<![\p{L}\p{N}])ооо(?![\p{L}\p{N}])/giu, 'ООО')
    .replace(/мидия\s+групп/giu, 'Мидия Групп')

  return restoreNameCase(restored, entrepreneurName)
}

function lowerFirst(value: string) {
  const normalized = naturalCase(value)
  return normalized ? `${normalized.charAt(0).toLocaleLowerCase('ru-RU')}${normalized.slice(1)}` : ''
}

function truncateAtWord(value: string, maxLength = 165) {
  if (value.length <= maxLength) {
    return value
  }

  const shortened = value.slice(0, maxLength - 1)
  const lastSpace = shortened.lastIndexOf(' ')
  const safeValue = lastSpace >= 100 ? shortened.slice(0, lastSpace) : shortened

  return `${safeValue.replace(/[,:;\s]+$/u, '')}…`
}

function fitDescription(primary: string, details: Array<string | null | undefined>) {
  let result = sentence(primary)

  for (const detail of details) {
    const normalizedDetail = sentence(detail || '')

    if (!normalizedDetail) {
      continue
    }

    const candidate = `${result} ${normalizedDetail}`.trim()

    if (candidate.length <= 165 || result.length < 120) {
      result = candidate
    }
  }

  if (result.length < 120) {
    result = `${result} Подробности и факты — в материале.`
  }

  return truncateAtWord(result)
}

function compactRole(value: string | null | undefined) {
  const source = value
    ?.split(/\r?\n/gu)
    .map(part => normalizeSeoText(part))
    .filter(Boolean)
    .join(', ') || ''
  const firstClause = source.split(/[,.;]/u)[0]?.trim() || source
  const normalized = lowerFirst(firstClause)

  return truncateAtWord(normalized, 78).replace(/…$/u, '')
}

function companyCategory(data: CompanySeoSource) {
  const source = `${data.type || ''} ${data.heroTeaser || ''} ${data.aboutText || ''}`

  if (/смэш-бургер|бургерн/iu.test(source)) return 'смэш-бургерная'
  if (/морепродукт/iu.test(source)) return 'ресторан морепродуктов'
  if (/круассан/iu.test(source)) return 'круассантерия'
  if (/здоровых\s+привычек/iu.test(source)) return 'бар здоровых привычек'
  if (/фестивал/iu.test(source)) return 'музыкальный и гастрономический фестиваль'

  return 'российский бизнес-проект'
}

function companyLocation(data: CompanySeoSource) {
  const source = `${data.city || ''} ${data.type || ''} ${data.heroTeaser || ''} ${data.aboutText || ''}`

  if (/в\s+Краснодаре/iu.test(source)) return 'в Краснодаре'
  if (/в\s+парке\s+[«"]?Краснодар[»"]?/iu.test(source)) return 'в парке «Краснодар»'

  return ''
}

export function buildEntrepreneurSeoTitle(data: EntrepreneurSeoSource) {
  const customTitle = normalizeSeoText(data.metaTitle)

  if (customTitle) {
    return customTitle
  }

  const roleSource = `${data.heroRightTeaser || ''} ${data.heroBottomRightTeaser || ''} ${data.title || ''}`

  if (/шеф-повар/iu.test(roleSource)) {
    return `${data.name} — шеф-повар и предприниматель`
  }

  if (/продюсер/iu.test(roleSource)) {
    return `${data.name} — продюсер культурных проектов`
  }

  if (/ресторан/iu.test(roleSource)) {
    return `${data.name} — предприниматель и ресторанный бизнес`
  }

  return `${data.name} — биография и бизнес`
}

export function buildEntrepreneurSeoDescription(data: EntrepreneurSeoSource) {
  const customDescription = normalizeSeoText(data.metaDesc)

  if (customDescription) {
    return fitDescription(customDescription, [
      `Биография, проекты и ключевые факты о предпринимателе ${data.name}`,
    ])
  }

  const role = compactRole(data.heroRightTeaser || data.title)
  const primary = role ? `${data.name} — ${role}` : `${data.name} — российский предприниматель`

  return fitDescription(primary, [
    'Биография, профессиональный путь, проекты и ключевые факты о предпринимателе',
  ])
}

export function buildCompanySeoTitle(data: CompanySeoSource) {
  const customTitle = normalizeSeoText(data.metaTitle)

  if (customTitle) {
    return customTitle
  }

  const category = companyCategory(data)
  const location = companyLocation(data)
  return `${data.name} — ${category}${location ? ` ${location}` : ''}`
}

export function buildCompanySeoDescription(data: CompanySeoSource) {
  const customDescription = normalizeSeoText(data.metaDesc || data.description)

  if (customDescription) {
    return fitDescription(customDescription, [
      `История создания, концепция и ключевые факты о проекте ${data.name}`,
    ])
  }

  const category = companyCategory(data)
  const location = companyLocation(data)
  const ownerName = normalizeSeoText(data.owner?.name)
  const ownerDetail = ownerName ? `Владелец проекта — ${ownerName}` : null

  return fitDescription(`${data.name} — ${category}${location ? ` ${location}` : ''}`, [
    ownerDetail,
    'История создания, концепция и факты о проекте',
  ])
}

export function buildArticleSeoTitle(data: EditorialSeoSource) {
  return normalizeSeoText(data.metaTitle || data.title)
}

export function buildArticleSeoDescription(data: EditorialSeoSource) {
  const customDescription = normalizeSeoText(data.metaDesc)
  const entrepreneurName = normalizeSeoText(data.entrepreneur?.name)
  const subject = restoreEditorialCase(
    customDescription || upperFirst(data.subtitle || data.summary || data.description || data.title),
    entrepreneurName,
  )

  return fitDescription(subject, [
    entrepreneurName ? `Герой материала — ${entrepreneurName}; внутри — контекст и ключевые факты по теме` : 'Контекст и ключевые факты — в редакционном материале',
  ])
}

export function buildInterviewSeoTitle(data: EditorialSeoSource) {
  return normalizeSeoText(data.metaTitle || data.title)
}

export function buildInterviewSeoDescription(data: EditorialSeoSource) {
  const subject = normalizeSeoText(data.metaDesc || data.summary || data.subtitle || data.description || data.title)
  const entrepreneurName = normalizeSeoText(data.entrepreneur?.name)

  return fitDescription(subject, [
    entrepreneurName ? `Герой видеоинтервью — ${entrepreneurName}; в материале — опыт, развитие проекта и ключевые решения` : 'Видеоинтервью об опыте героя, развитии проекта и ключевых решениях',
  ])
}

export function buildReelSeoTitle(data: EditorialSeoSource) {
  return normalizeSeoText(data.metaTitle || data.title)
}

export function buildReelSeoDescription(data: EditorialSeoSource) {
  const subject = normalizeSeoText(data.metaDesc || data.description || data.summary || data.subtitle || data.title)

  return fitDescription(subject, [
    'В коротком видео — практический контекст, опыт и ключевые выводы по теме',
  ])
}
