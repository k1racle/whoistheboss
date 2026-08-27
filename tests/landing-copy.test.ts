import { describe, expect, it } from 'vitest'
import {
  landingAudienceIntro,
  landingPageFallback,
} from '../app/features/landing/model/landing.data'

describe('landing page copy', () => {
  it('uses the approved three-line hero title', () => {
    expect(landingPageFallback.heroTitle).toBe('МЕДИА ГИД\nМАРШРУТ\nПОСТРОЕН')
  })

  it('does not end the audience introduction with a period', () => {
    expect(landingAudienceIntro.endsWith('.')).toBe(false)
  })
})
