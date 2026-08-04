import prisma from '~~/lib/prisma'

interface ShootingRequestBody {
  name?: unknown
  company?: unknown
  email?: unknown
  phone?: unknown
  message?: unknown
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ShootingRequestBody>(event)

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''

  if (name.length < 2 || phone.length < 5) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }

  const data = await prisma.shootingRequest.create({
    data: {
      name,
      phone,
      company: typeof body.company === 'string' ? body.company.trim() || null : null,
      email: typeof body.email === 'string' ? body.email.trim() || null : null,
      message: typeof body.message === 'string' ? body.message.trim() || null : null,
    },
  })

  // TODO: notifyAdmin + sendTelegramMessage после переноса mailer/telegram из migration_old.

  return { success: true, id: data.id }
})
