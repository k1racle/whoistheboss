import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import type { H3Event } from 'h3'
import { requireAdminMethod, throwAdminError } from '@server/utils/admin-api'

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg'])
const videoExtensions = new Set(['.mp4', '.webm', '.mov', '.m4v'])

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
  const parts = await readMultipartFormData(event)
  const file = parts?.find(part => part.name === 'file' && part.filename)
  if (!file?.filename) throwAdminError(400, 'No file uploaded')

  const expectedMimePrefix = `${kind}/`
  if (!file.type?.startsWith(expectedMimePrefix)) {
    throwAdminError(400, kind === 'image'
      ? 'Only image files are allowed'
      : 'Only video files are allowed')
  }

  const config = useRuntimeConfig()
  const maxSizeMb = kind === 'image' ? config.maxImageUploadSizeMb : config.maxUploadSizeMb
  const maxSize = maxSizeMb * 1024 * 1024
  if (file.data.byteLength > maxSize) throwAdminError(413, 'File too large')

  const originalName = normalizeOriginalName(file.filename)
  const extension = extname(originalName).toLowerCase()
  const allowedExtensions = kind === 'image' ? imageExtensions : videoExtensions
  if (!allowedExtensions.has(extension)) {
    throwAdminError(400, `Unsupported ${kind} file extension`)
  }

  const contentHash = createHash('sha256').update(file.data).digest('hex').slice(0, 24)
  const filename = `${kind}-${contentHash}${extension}`
  const uploadDir = getUploadDirectory()
  const destination = join(uploadDir, filename)

  await fs.mkdir(uploadDir, { recursive: true })
  const alreadyExists = await fs.access(destination).then(() => true).catch(() => false)
  if (!alreadyExists) await fs.writeFile(destination, file.data)
  return { url: `/uploads/${filename}` }
}
