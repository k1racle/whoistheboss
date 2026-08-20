import prisma from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return {
      ok: true,
      database: 'up',
      timestamp: new Date().toISOString(),
    }
  }
  catch {
    setResponseStatus(event, 503)
    return {
      ok: false,
      database: 'down',
      timestamp: new Date().toISOString(),
    }
  }
})
