import { describe, expect, it } from 'vitest'
import { localizeRussianServiceHeading } from '../app/shared/lib/typography'
import { getChangedIndexNowPaths, getIndexNowPath } from '../server/utils/index-now'

describe('technical SEO helpers', () => {
  it('localizes confirmed English service headings without changing entity names', () => {
    expect(localizeRussianServiceHeading('What is Big Baby Burger?')).toBe('Что такое Big Baby Burger?')
    expect(localizeRussianServiceHeading('What is Стереопикник?')).toBe('Что такое Стереопикник?')
    expect(localizeRussianServiceHeading("Who's the Эленика Корелова?")).toBe('Кто такая Эленика Корелова?')
  })

  it('builds canonical IndexNow paths for every content type', () => {
    expect(getIndexNowPath('entrepreneur', 'anna-test')).toBe('/entrepreneurs/anna-test')
    expect(getIndexNowPath('company', 'test-company')).toBe('/companies/test-company')
    expect(getIndexNowPath('article', 'test-article')).toBe('/blog/test-article')
    expect(getIndexNowPath('interview', 'test-interview')).toBe('/interviews/test-interview')
    expect(getIndexNowPath('reel', 'test-reel')).toBe('/reels/test-reel')
  })

  it('notifies both old and new URLs after a published slug change', () => {
    expect(getChangedIndexNowPaths(
      'company',
      { slug: 'old-slug', isPublished: true },
      { slug: 'new-slug', isPublished: true },
    )).toEqual(['/companies/old-slug', '/companies/new-slug'])
  })

  it('does not notify IndexNow for drafts', () => {
    expect(getChangedIndexNowPaths(
      'article',
      null,
      { slug: 'draft', isPublished: false },
    )).toEqual([])
  })
})
