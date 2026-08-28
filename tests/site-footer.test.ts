import { describe, expect, it } from 'vitest'
import {
  ensurePrivacyPolicyLink,
  parseFooterMetaItems,
} from '../server/utils/site-footer'

describe('site footer meta links', () => {
  it('adds the privacy policy route to legacy footer data without a link', () => {
    const items = parseFooterMetaItems(JSON.stringify([
      { text: 'Политика конф-ти', href: '' },
    ]))

    expect(ensurePrivacyPolicyLink(items)).toEqual([
      { text: 'Политика конф-ти', href: '/privacy-policy' },
    ])
  })

  it('keeps a custom privacy policy link', () => {
    expect(ensurePrivacyPolicyLink([
      { text: 'Политика конфиденциальности', href: '/documents/privacy' },
    ])).toEqual([
      { text: 'Политика конфиденциальности', href: '/documents/privacy' },
    ])
  })
})
