import { requestWantsJson } from '@server/utils/request-flow'
import { clearPublicUserSession } from '@server/utils/auth-session'

export default defineEventHandler(async (event) => {
  await clearPublicUserSession(event)

  if (requestWantsJson(event)) {
    return { ok: true }
  }

  return sendRedirect(event, '/', 303)
})
