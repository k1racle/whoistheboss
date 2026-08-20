import { describe, expect, it } from 'vitest'
import {
  clampImageQuality,
  clampImageWidth,
  isOptimizableUploadImage,
} from '../app/shared/image/image-variants'

describe('image variants', () => {
  it('rounds widths to the nearest supported step above', () => {
    expect(clampImageWidth(333)).toBe(480)
    expect(clampImageWidth(960)).toBe(960)
    expect(clampImageWidth(5000)).toBe(2560)
  })

  it('rounds quality to the nearest preset', () => {
    expect(clampImageQuality(70)).toBe(68)
    expect(clampImageQuality(79)).toBe(76)
    expect(clampImageQuality(90)).toBe(82)
  })

  it('recognizes only optimizable upload paths', () => {
    expect(isOptimizableUploadImage('/uploads/image.webp')).toBe(true)
    expect(isOptimizableUploadImage('/uploads/icon.svg')).toBe(false)
    expect(isOptimizableUploadImage('/images/image.webp')).toBe(false)
  })
})
