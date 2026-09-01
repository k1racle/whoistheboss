import { describe, expect, it } from 'vitest'
import {
  normalizeSeoBrand,
  SEO_SITE_NAME,
  withSeoSiteName,
} from '../app/shared/seo/brand'
import {
  buildArticleSeoDescription,
  buildCompanySeoDescription,
  buildCompanySeoTitle,
  buildEntrepreneurSeoDescription,
  buildEntrepreneurSeoTitle,
} from '../app/shared/seo/content'
import { STATIC_PAGE_SEO } from '../app/shared/seo/static-page-seo'

describe('SEO metadata', () => {
  it('keeps the approved static metadata unchanged', () => {
    expect(STATIC_PAGE_SEO.home.title).toBe('МАРШРУТ ПОСТРОЕН МЕДИАГИД — предприниматели и бизнес России')
    expect(STATIC_PAGE_SEO.entrepreneurs.title).toBe('Предприниматели России | МАРШРУТ ПОСТРОЕН МЕДИАГИД')
    expect(STATIC_PAGE_SEO.companies.title).toBe('Компании и бизнес-проекты | МАРШРУТ ПОСТРОЕН МЕДИАГИД')
    expect(STATIC_PAGE_SEO.blog.title).toBe('Журнал о предпринимателях и бизнесе | МАРШРУТ ПОСТРОЕН МЕДИАГИД')
  })

  it('normalizes and deduplicates every SEO brand mention', () => {
    expect(normalizeSeoBrand('Товарный знак «Маршрут построен»')).toBe(`Товарный знак ${SEO_SITE_NAME}`)
    expect(withSeoSiteName('Big Baby Burger — Маршрут построен — Маршрут построен')).toBe(`Big Baby Burger — ${SEO_SITE_NAME}`)
  })

  it('does not mechanically append the brand to an overly long title', () => {
    const title = 'Очень длинный редакционный заголовок о предпринимателе, компании и развитии проекта в России'
    expect(withSeoSiteName(title)).toBe(title)
  })

  it('builds intent-based entrepreneur metadata from factual profile fields', () => {
    const entrepreneur = {
      name: 'Вячеслав Марковский',
      title: '',
      metaTitle: null,
      metaDesc: null,
      heroRightTeaser: 'РОССИЙСКИЙ ШЕФ-ПОВАР И ПРЕДПРИНИМАТЕЛЬ',
      heroBottomRightTeaser: 'ПУБЛИЧНОЕ ЛИЦО И ПРОДУКТОВЫЙ ЧЕЛОВЕК BIG BABY BURGER',
    }

    expect(buildEntrepreneurSeoTitle(entrepreneur)).toBe('Вячеслав Марковский — шеф-повар и предприниматель')
    const description = buildEntrepreneurSeoDescription(entrepreneur)
    expect(description).toContain('Вячеслав Марковский')
    expect(description.length).toBeGreaterThanOrEqual(120)
    expect(description.length).toBeLessThanOrEqual(165)
  })

  it('builds unique company metadata from the project type and owner', () => {
    const company = {
      name: 'Big Baby Burger',
      type: 'Смэш-бургерная Вячеслава Марковского в Краснодаре',
      description: null,
      metaTitle: null,
      metaDesc: null,
      owner: { name: 'Вячеслав Марковский' },
    }

    expect(buildCompanySeoTitle(company)).toBe('Big Baby Burger — смэш-бургерная в Краснодаре')
    const description = buildCompanySeoDescription(company)
    expect(description).toContain('Big Baby Burger')
    expect(description.length).toBeGreaterThanOrEqual(120)
    expect(description.length).toBeLessThanOrEqual(165)
  })

  it('expands short article metadata without replacing its factual subject', () => {
    const description = buildArticleSeoDescription({
      title: 'Как найти свою нишу в 2026 году',
      subtitle: null,
      metaTitle: null,
      metaDesc: 'Разбираем стратегии поиска и проверки ниши на реальных кейсах.',
      entrepreneur: { name: 'Эленика Корелова' },
    })

    expect(description).toContain('стратегии поиска и проверки ниши')
    expect(description).toContain('Эленика Корелова')
    expect(description.length).toBeGreaterThanOrEqual(120)
    expect(description.length).toBeLessThanOrEqual(165)
  })

  it('restores proper-name casing in an uppercase editorial subtitle', () => {
    const description = buildArticleSeoDescription({
      title: 'Кто такой Вячеслав Марковский?',
      subtitle: 'ВЯЧЕСЛАВ МАРКОВСКИЙ ОТКРЫЛ BIG BABY BURGER В КРАСНОДАРЕ',
      entrepreneur: { name: 'Вячеслав Марковский' },
    })

    expect(description).toContain('Big Baby Burger')
    expect(description).toContain('Вячеслав Марковский')
    expect(description).toContain('Краснодаре')
    expect(description).not.toContain('big baby burger')
  })
})
