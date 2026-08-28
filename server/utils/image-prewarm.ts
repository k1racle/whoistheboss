import {
  DEFAULT_IMAGE_QUALITY,
  HOT_IMAGE_WIDTHS,
} from '~~/app/shared/image/image-variants'
import { resolveImageVariant } from '@server/utils/image-variant'

export async function prewarmImageVariants(filename: string): Promise<void> {
  await Promise.all(HOT_IMAGE_WIDTHS.map(width =>
    resolveImageVariant({ filename, width, quality: DEFAULT_IMAGE_QUALITY }).catch(() => undefined)))
}
