import {
  DEFAULT_TRADEMARK_PAGE,
  TRADEMARK_FOOTER_LEGAL_TEXT,
} from '@features/trademark/model/trademark-page.defaults'
import type {
  TrademarkFaqItem,
  TrademarkMktuClass,
  TrademarkPageData,
  TrademarkProcessStep,
  TrademarkRegistrationRow,
  TrademarkRuleSection,
} from '@features/trademark/model/trademark-page.types'
import { safeJsonParse } from '@server/utils/json'

type UnknownRecord = Record<string, unknown>
const PUBLIC_RULE_ORDER = ['license', 'no-consent', 'approval', 'prohibited']

const LEGACY_TRADEMARK_HERO_TITLE = 'ТОВАРНЫЙ ЗНАК\n«МАРШРУТ ПОСТРОЕН»'
const LEGACY_FOOTER_LEGAL_TEXT = '«МАРШРУТ ПОСТРОЕН»® — зарегистрированный товарный знак ООО «МАРИКО». Свидетельство РФ № 1177775.'
const LEGACY_SEO_TITLE = 'Товарный знак «Маршрут построен» № 1177775 — ООО «МАРИКО»'
const LEGACY_SEO_DESCRIPTION = 'ООО «МАРИКО» — правообладатель товарного знака «Маршрут построен» № 1177775. Свидетельство, классы МКТУ, правила использования, заявка на лицензию и сообщение о возможном нарушении.'

function record(value: unknown): UnknownRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as UnknownRecord : {}
}

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function footerLegalText(value: unknown): string {
  const normalized = text(value).trim()
  return !normalized || normalized === LEGACY_FOOTER_LEGAL_TEXT
    ? TRADEMARK_FOOTER_LEGAL_TEXT
    : normalized
}

function trademarkHeroTitle(value: unknown, fallback: string): string {
  const title = text(value, fallback)
  return title === LEGACY_TRADEMARK_HERO_TITLE ? fallback : title
}

function trademarkSeoText(value: unknown, legacyValue: string, fallback: string): string {
  const normalized = text(value).trim()
  return !normalized || normalized === legacyValue ? fallback : normalized
}

function textList(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback
  return value.map(item => text(item).trim()).filter(Boolean).slice(0, 100)
}

function registrationRows(value: unknown): TrademarkRegistrationRow[] {
  if (!Array.isArray(value)) return DEFAULT_TRADEMARK_PAGE.registration.rows
  const rows = value.map((item) => {
    const source = record(item)
    return { label: text(source.label).trim(), value: text(source.value).trim() }
  }).filter(item => item.label || item.value).slice(0, 50)
  return rows.length ? rows : DEFAULT_TRADEMARK_PAGE.registration.rows
}

function mktuClasses(value: unknown): TrademarkMktuClass[] {
  if (!Array.isArray(value)) return DEFAULT_TRADEMARK_PAGE.protection.classes
  const classes = value.map((item) => {
    const source = record(item)
    return {
      number: text(source.number).trim(),
      title: text(source.title).trim(),
      summary: text(source.summary).trim(),
      officialText: text(source.officialText).trim(),
    }
  }).filter(item => item.number || item.title).slice(0, 20)
  return classes.length ? classes : DEFAULT_TRADEMARK_PAGE.protection.classes
}

function ruleSections(value: unknown): TrademarkRuleSection[] {
  if (!Array.isArray(value)) {
    return PUBLIC_RULE_ORDER.flatMap((id) => DEFAULT_TRADEMARK_PAGE.rules.filter(rule => rule.id === id))
  }
  const rules = value.map((item, index) => {
    const source = record(item)
    const fallback = DEFAULT_TRADEMARK_PAGE.rules[index]
    const tone = source.tone === 'accent' || source.tone === 'warning' ? source.tone : 'neutral'
    return {
      id: text(source.id, fallback?.id || `rule-${index + 1}`).trim(),
      eyebrow: text(source.eyebrow, fallback?.eyebrow).trim(),
      title: text(source.title, fallback?.title).trim(),
      intro: text(source.intro, fallback?.intro).trim(),
      points: textList(source.points, fallback?.points),
      note: text(source.note, fallback?.note).trim(),
      tone,
    } satisfies TrademarkRuleSection
  }).filter(item => item.title).slice(0, 20)
  const source = rules.length ? rules : DEFAULT_TRADEMARK_PAGE.rules
  return PUBLIC_RULE_ORDER.flatMap((id) => source.filter(rule => rule.id === id))
}

function processSteps(value: unknown): TrademarkProcessStep[] {
  if (!Array.isArray(value)) return DEFAULT_TRADEMARK_PAGE.licensing.steps
  const steps = value.map((item, index) => {
    const source = record(item)
    return {
      number: text(source.number, String(index + 1).padStart(2, '0')).trim(),
      title: text(source.title).trim(),
      text: text(source.text).trim(),
    }
  }).filter(item => item.title || item.text).slice(0, 30)
  return steps.length ? steps : DEFAULT_TRADEMARK_PAGE.licensing.steps
}

function faqItems(value: unknown): TrademarkFaqItem[] {
  if (!Array.isArray(value)) return DEFAULT_TRADEMARK_PAGE.faqItems
  const items = value.map((item) => {
    const source = record(item)
    return { question: text(source.question).trim(), answer: text(source.answer).trim() }
  }).filter(item => item.question || item.answer).slice(0, 50)
  return items.length ? items : DEFAULT_TRADEMARK_PAGE.faqItems
}

export function normalizeTrademarkPage(value?: string): TrademarkPageData {
  const source = record(safeJsonParse<unknown>(value || '', {}))
  const hero = record(source.hero)
  const registration = record(source.registration)
  const protection = record(source.protection)
  const licensing = record(source.licensing)
  const quality = record(source.quality)
  const violation = record(source.violation)
  const contacts = record(source.contacts)
  const application = record(source.application)
  const fallback = DEFAULT_TRADEMARK_PAGE

  return {
    seoTitle: trademarkSeoText(source.seoTitle, LEGACY_SEO_TITLE, fallback.seoTitle),
    seoDescription: trademarkSeoText(source.seoDescription, LEGACY_SEO_DESCRIPTION, fallback.seoDescription),
    lastUpdated: text(source.lastUpdated, fallback.lastUpdated),
    hero: {
      eyebrow: text(hero.eyebrow, fallback.hero.eyebrow),
      title: trademarkHeroTitle(hero.title, fallback.hero.title),
      subtitle: text(hero.subtitle, fallback.hero.subtitle),
      intro: text(hero.intro, fallback.hero.intro),
      primaryButton: text(hero.primaryButton, fallback.hero.primaryButton),
      certificateButton: text(hero.certificateButton, fallback.hero.certificateButton),
      reportButton: text(hero.reportButton, fallback.hero.reportButton),
    },
    registration: {
      title: text(registration.title, fallback.registration.title),
      rows: registrationRows(registration.rows),
      certificateUrl: text(registration.certificateUrl, fallback.registration.certificateUrl),
      appendixUrl: text(registration.appendixUrl, fallback.registration.appendixUrl),
      certificateAlt: text(registration.certificateAlt, fallback.registration.certificateAlt),
    },
    protection: {
      title: text(protection.title, fallback.protection.title),
      intro: text(protection.intro, fallback.protection.intro),
      notice: text(protection.notice, fallback.protection.notice),
      classes: mktuClasses(protection.classes),
    },
    rules: ruleSections(source.rules),
    licensing: {
      title: text(licensing.title, fallback.licensing.title),
      intro: text(licensing.intro, fallback.licensing.intro),
      points: textList(licensing.points, fallback.licensing.points),
      processTitle: text(licensing.processTitle, fallback.licensing.processTitle),
      steps: processSteps(licensing.steps),
      disclaimer: text(licensing.disclaimer, fallback.licensing.disclaimer),
    },
    quality: {
      title: text(quality.title, fallback.quality.title),
      text: text(quality.text, fallback.quality.text),
      points: textList(quality.points, fallback.quality.points),
    },
    violation: {
      title: text(violation.title, fallback.violation.title),
      text: text(violation.text, fallback.violation.text),
      requirements: textList(violation.requirements, fallback.violation.requirements),
      button: text(violation.button, fallback.violation.button),
      disclaimer: text(violation.disclaimer, fallback.violation.disclaimer),
    },
    faqTitle: text(source.faqTitle, fallback.faqTitle),
    faqItems: faqItems(source.faqItems),
    contacts: {
      title: text(contacts.title, fallback.contacts.title),
      rightsHolder: text(contacts.rightsHolder, fallback.contacts.rightsHolder),
      ogrn: text(contacts.ogrn),
      inn: text(contacts.inn),
      legalAddress: text(contacts.legalAddress, fallback.contacts.legalAddress),
      postalAddress: text(contacts.postalAddress),
      licenseEmail: text(contacts.licenseEmail),
      violationEmail: text(contacts.violationEmail),
      phone: text(contacts.phone),
      disclaimer: text(contacts.disclaimer, fallback.contacts.disclaimer),
    },
    application: {
      title: text(application.title, fallback.application.title),
      intro: text(application.intro, fallback.application.intro),
      successText: text(application.successText, fallback.application.successText),
    },
    footerLegalText: footerLegalText(source.footerLegalText),
  }
}
