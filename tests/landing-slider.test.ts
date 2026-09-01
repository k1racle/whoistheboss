import { describe, expect, it } from 'vitest'
import {
  getCenteredSlideScrollLeft,
  getClosestSlideIndex,
} from '../app/features/landing/model/slider-navigation'

const slides = [
  { offsetLeft: 0, offsetWidth: 280 },
  { offsetLeft: 296, offsetWidth: 280 },
  { offsetLeft: 592, offsetWidth: 280 },
]

describe('landing slider navigation', () => {
  it('uses the slide closest to the viewport center', () => {
    expect(getClosestSlideIndex(slides, 532, 400)).toBe(2)
  })

  it('calculates the scroll position needed to center a slide', () => {
    expect(getCenteredSlideScrollLeft(slides[2]!, 400)).toBe(532)
  })
})
