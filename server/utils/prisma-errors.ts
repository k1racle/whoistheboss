import { Prisma } from '@prisma/client'

export function isPrismaUniqueError(error: unknown, field?: string): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') return false
  if (!field) return true
  const target = error.meta?.target
  return Array.isArray(target) ? target.includes(field) : String(target || '').includes(field)
}

export function toHttpPrismaError(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return null
  if (error.code === 'P2002') {
    return createError({ statusCode: 409, statusMessage: 'Record already exists' })
  }
  if (error.code === 'P2025') {
    return createError({ statusCode: 404, statusMessage: 'Record not found' })
  }
  if (error.code === 'P2003') {
    return createError({ statusCode: 409, statusMessage: 'Record is still in use' })
  }
  return null
}

