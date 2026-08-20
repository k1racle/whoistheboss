import { requestWantsJson } from '@server/utils/request-flow'
import { clearPublicUserSession } from '@server/utils/auth-session'

export default defineEventHandler(async (event) => {
  setHeader(event, 'deprecation', 'true')
  setHeader(event, 'sunset', 'Thu, 31 Dec 2026 23:59:59 GMT')
  await clearPublicUserSession(event)

  if (requestWantsJson(event)) {
    return { ok: true }
  }

  return sendRedirect(event, '/', 303)
})
