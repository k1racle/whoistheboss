import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import sharp from 'sharp'
import type { H3Event } from 'h3'
import { requireAdminMethod, throwAdminError } from '@server/utils/admin-api'
import { prewarmImageVariants } from '@server/utils/image-prewarm'
import { readLimitedRawBody } from '@server/utils/request-security'

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])
const videoExtensions = new Set(['.mp4', '.webm', '.mov', '.m4v'])
const optimizableImageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
const MAX_IMAGE_DIMENSION = 2560
const WEBP_QUALITY = 90

async function optimizeImageUpload(
  data: Buffer,
  extension: string,
): Promise<{ data: Buffer, extension: string }> {
  const probe = sharp(data, { animated: true, failOn: 'error' })
  const metadata = await probe.metadata()
  if (!metadata.format || !['jpeg', 'png', 'webp', 'gif', 'avif'].includes(metadata.format)) {
    throw new Error('Unsupported image content')
  }
  if ((metadata.pages ?? 1) > 1) return { data, extension }
  if (!optimizableImageExtensions.has(extension)) return { data, extension }

  const optimized = await sharp(data, { failOn: 'error' })
    .rotate()
    .resize({
      width: MAX_IMAGE_DIMENSION,
      height: MAX_IMAGE_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality: WEBP_QUALITY,
      alphaQuality: 88,
      effort: 4,
      smartSubsample: true,
    })
    .toBuffer()

  return { data: optimized, extension: '.webp' }
}

function hasValidVideoSignature(data: Buffer, extension: string): boolean {
  if (extension === '.webm') {
    return data.length >= 4
      && data[0] === 0x1A
      && data[1] === 0x45
      && data[2] === 0xDF
      && data[3] === 0xA3
  }
  return data.length >= 12 && data.subarray(4, 8).toString('ascii') === 'ftyp'
}

function normalizeOriginalName(value: string): string {
  if (/[\u0430-\u044f\u0451]/i.test(value)) return value
  if (!/[\u00c0-\u00ff]/.test(value)) return value
  const decoded = Buffer.from(value, 'latin1').toString('utf8')
  return decoded.includes('\uFFFD') ? value : decoded
}

function getUploadDirectory(): string {
  return resolve(useRuntimeConfig().uploadDir)
}

export async function handleUploads(event: H3Event, path: readonly string[]) {
  if (path.length === 0) {
    requireAdminMethod(event, ['GET'])
    const uploadDir = getUploadDirectory()
    const entries = await fs.readdir(uploadDir, { withFileTypes: true }).catch(() => [])
    const files = await Promise.all(entries
      .filter(entry => entry.isFile() && !entry.name.startsWith('.'))
      .map(async (entry) => {
        const stat = await fs.stat(join(uploadDir, entry.name))
        const extension = extname(entry.name).toLowerCase()
        return {
          name: entry.name,
          url: `/uploads/${entry.name}`,
          type: imageExtensions.has(extension)
            ? 'image'
            : videoExtensions.has(extension) ? 'video' : 'file',
          size: stat.size,
          updatedAt: stat.mtime.toISOString(),
        }
      }))

    files.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    return files
  }

  if (path.length !== 1 || (path[0] !== 'image' && path[0] !== 'video')) {
    throwAdminError(404, 'Not found')
  }

  requireAdminMethod(event, ['POST'])
  const kind = path[0]
  const config = useRuntimeConfig()
  const configuredMaxSizeMb = kind === 'image' ? config.maxImageUploadSizeMb : config.maxUploadSizeMb
  await readLimitedRawBody(event, configuredMaxSizeMb * 1024 * 1024 + 64 * 1024)
  const parts = await readMultipartFormData(event)
  const file = parts?.find(part => part.name === 'file' && part.filename)
  if (!file?.filename) throwAdminError(400, 'No file uploaded')

  const expectedMimePrefix = `${kind}/`
  if (!file.type?.startsWith(expectedMimePrefix)) {
    throwAdminError(400, kind === 'image'
      ? 'Only image files are allowed'
      : 'Only video files are allowed')
  }

  const maxSizeMb = kind === 'image' ? config.maxImageUploadSizeMb : config.maxUploadSizeMb
  const maxSize = maxSizeMb * 1024 * 1024
  if (file.data.byteLength > maxSize) throwAdminError(413, 'File too large')

  const originalName = normalizeOriginalName(file.filename)
  const extension = extname(originalName).toLowerCase()
  const allowedExtensions = kind === 'image' ? imageExtensions : videoExtensions
  if (!allowedExtensions.has(extension)) {
    throwAdminError(400, `Unsupported ${kind} file extension`)
  }
  if (kind === 'video' && !hasValidVideoSignature(file.data, extension)) {
    throwAdminError(400, 'Invalid or unsupported video file')
  }

  let outputData = file.data
  let outputExtension = extension
  if (kind === 'image') {
    try {
      const optimized = await optimizeImageUpload(file.data, extension)
      outputData = optimized.data
      outputExtension = optimized.extension
    }
    catch {
      throwAdminError(400, 'Invalid or unsupported image file')
    }
  }

  const contentHash = createHash('sha256').update(outputData).digest('hex').slice(0, 24)
  const filename = `${kind}-${contentHash}${outputExtension}`
  const uploadDir = getUploadDirectory()
  const destination = join(uploadDir, filename)

  await fs.mkdir(uploadDir, { recursive: true })
  const alreadyExists = await fs.access(destination).then(() => true).catch(() => false)
  if (!alreadyExists) await fs.writeFile(destination, outputData)
  if (kind === 'image' && !alreadyExists) {
    void prewarmImageVariants(filename).catch(error => console.error('[images] Prewarm failed', error))
  }
  return { url: `/uploads/${filename}` }
}
