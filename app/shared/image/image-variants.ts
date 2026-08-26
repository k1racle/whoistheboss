const IMAGE_WIDTH_STEPS = [180, 320, 480, 640, 768, 960, 1280, 1600, 1920, 2560] as const
const IMAGE_QUALITY_STEPS = [68, 76, 82] as const

const UPLOAD_IMAGE_PATTERN = /^\/uploads\/[^/?#]+\.(avif|jpe?g|png|webp)$/i

export const DEFAULT_IMAGE_WIDTH = 960
export const DEFAULT_IMAGE_QUALITY = 76
export const HOT_IMAGE_WIDTHS = [320, 640, 960, 1280, 1600] as const

export function clampImageWidth(value: number | undefined): number | undefined {
  if (!Number.isFinite(value) || (value ?? 0) <= 0) return undefined
  const normalized = Math.round(value!)
  return IMAGE_WIDTH_STEPS.find(width => width >= normalized)
    ?? IMAGE_WIDTH_STEPS[IMAGE_WIDTH_STEPS.length - 1]
}

export function clampImageQuality(value: number | undefined): number {
  if (!Number.isFinite(value) || (value ?? 0) <= 0) return DEFAULT_IMAGE_QUALITY
  const normalized = Math.round(value!)
  return IMAGE_QUALITY_STEPS.reduce((best, current) => (
    Math.abs(current - normalized) < Math.abs(best - normalized) ? current : best
  ), DEFAULT_IMAGE_QUALITY)
}

export function isOptimizableUploadImage(src: string): boolean {
  return UPLOAD_IMAGE_PATTERN.test(src.split(/[?#]/, 1)[0] ?? '')
}
