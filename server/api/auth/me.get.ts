import { getPublicSessionUser } from '@server/utils/auth-session'

export default defineEventHandler(async (event) => {
  const user = await getPublicSessionUser(event)

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  return user
})
