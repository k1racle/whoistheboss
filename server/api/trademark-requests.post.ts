import { createHash, randomBytes } from 'node:crypto'
import { promises as fs } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import sharp from 'sharp'
import { z } from 'zod'
import type { Prisma } from '@prisma/client'
import prisma from '~~/lib/prisma'
import { enforceRateLimit } from '@server/utils/rate-limit'
import { assertSameOriginMutation, readLimitedRawBody } from '@server/utils/request-security'

const MAX_FILES = 5
const MAX_FILE_BYTES = 10 * 1024 * 1024
const MAX_BODY_BYTES = MAX_FILES * MAX_FILE_BYTES + 256 * 1024
const allowedExtensions = new Set(['.pdf', '.jpg', '.jpeg', '.png', '.webp'])

const commonSchema = z.object({
  type: z.enum(['LICENSE', 'INFRINGEMENT']),
  applicantName: z.string().trim().min(2).max(200),
  organization: z.string().trim().max(200).optional().default(''),
  contactName: z.string().trim().max(160).optional().default(''),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().default(''),
})

const licenseSchema = commonSchema.extend({
  type: z.literal('LICENSE'),
  contactName: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(5).max(40),
  projectName: z.string().trim().min(2).max(200),
  projectDescription: z.string().trim().min(10).max(5000),
  useDescription: z.string().trim().min(10).max(5000),
  truthConfirmed: z.literal('on'),
  noAutomaticRightConfirmed: z.literal('on'),
  noUseBeforeActivationConfirmed: z.literal('on'),
  currentUseDisclosed: z.literal('on'),
  privacyConfirmed: z.literal('on'),
}).passthrough()

const infringementSchema = commonSchema.extend({
  type: z.literal('INFRINGEMENT'),
  objectUrl: z.string().trim().min(3).max(1000),
  description: z.string().trim().min(10).max(6000),
  privacyConfirmed: z.literal('on'),
}).passthrough()

type StoredAttachment = { name: string; url: string; size: number; type: string }

function textFields(parts: Awaited<ReturnType<typeof readMultipartFormData>>): Record<string, string> {
  return Object.fromEntries((parts || [])
    .filter(part => !part.filename && part.name)
    .map(part => [part.name!, part.data.toString('utf8').trim()]))
}

async function validateAndStoreFiles(
  parts: NonNullable<Awaited<ReturnType<typeof readMultipartFormData>>>,
): Promise<StoredAttachment[]> {
  const files = parts.filter(part => part.name === 'files' && part.filename)
  if (files.length > MAX_FILES) throw createError({ statusCode: 400, statusMessage: 'Too many files' })

  const uploadDir = resolve(useRuntimeConfig().uploadDir)
  await fs.mkdir(uploadDir, { recursive: true })

  return await Promise.all(files.map(async (file) => {
    const originalName = file.filename || 'file'
    const extension = extname(originalName).toLowerCase()
    if (!allowedExtensions.has(extension) || file.data.byteLength > MAX_FILE_BYTES) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid attachment' })
    }

    if (extension === '.pdf') {
      if (file.data.subarray(0, 5).toString('ascii') !== '%PDF-') {
        throw createError({ statusCode: 400, statusMessage: 'Invalid PDF attachment' })
      }
    }
    else {
      try {
        const metadata = await sharp(file.data, { failOn: 'error' }).metadata()
        if (!metadata.format || !['jpeg', 'png', 'webp'].includes(metadata.format)) throw new Error()
      }
      catch {
        throw createError({ statusCode: 400, statusMessage: 'Invalid image attachment' })
      }
    }

    const hash = createHash('sha256').update(file.data).digest('hex').slice(0, 24)
    const storedName = `trademark-${hash}${extension}`
    const destination = join(uploadDir, storedName)
    const exists = await fs.access(destination).then(() => true).catch(() => false)
    if (!exists) await fs.writeFile(destination, file.data)
    return {
      name: originalName,
      url: `/uploads/${storedName}`,
      size: file.data.byteLength,
      type: file.type || 'application/octet-stream',
    }
  }))
}

function requestNumber(type: 'LICENSE' | 'INFRINGEMENT'): string {
  const prefix = type === 'LICENSE' ? 'LIC' : 'TM'
  return `MP-${prefix}-${new Date().getFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`
}

export default defineEventHandler(async (event) => {
  assertSameOriginMutation(event)
  enforceRateLimit(event, { id: 'trademark-request', limit: 5, windowMs: 60 * 60 * 1000 })
  await readLimitedRawBody(event, MAX_BODY_BYTES)
  const parts = await readMultipartFormData(event)
  if (!parts) throw createError({ statusCode: 400, statusMessage: 'Invalid form data' })
  const fields = textFields(parts)

  if (fields.websiteUrl) return { success: true, requestNumber: 'ACCEPTED' }

  const schema = fields.type === 'LICENSE' ? licenseSchema : infringementSchema
  const parsed = schema.safeParse(fields)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid input' })

  const data = parsed.data
  const attachments = await validateAndStoreFiles(parts)
  const number = requestNumber(data.type)
  const { type, applicantName, organization, contactName, email, phone, ...details } = data
  await prisma.trademarkRequest.create({
    data: {
      requestNumber: number,
      type,
      applicantName,
      organization: organization || null,
      contactName: contactName || null,
      email: email || null,
      phone: phone || null,
      details: JSON.parse(JSON.stringify(details)) as Prisma.InputJsonValue,
      attachments: JSON.parse(JSON.stringify(attachments)) as Prisma.InputJsonValue,
    },
  })

  return { success: true, requestNumber: number }
})
