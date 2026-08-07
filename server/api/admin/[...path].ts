import {
  handleArticles,
  handleBusinesses,
  handleEntrepreneurs,
  handleInterviews,
  handleReels,
} from '@server/utils/admin-content-handlers'
import {
  handleAudienceCards,
  handleComments,
  handleSettings,
  handleShootingRequests,
  handleSubscribers,
  handleUsers,
} from '@server/utils/admin-operations-handlers'
import { requireAdminUser, throwAdminError } from '@server/utils/admin-api'
import { handleUploads } from '@server/utils/admin-upload-handler'

export default defineEventHandler(async (event) => {
  const routePath = getRouterParam(event, 'path') || ''
  const [resource, ...path] = routePath.split('/').filter(Boolean)

  if (!resource) throwAdminError(404, 'Not found')

  await requireAdminUser(event, resource === 'users' ? ['ADMIN'] : ['ADMIN', 'EDITOR'])

  switch (resource) {
    case 'users':
      return handleUsers(event, path)
    case 'entrepreneurs':
      return handleEntrepreneurs(event, path)
    case 'interviews':
      return handleInterviews(event, path)
    case 'reels':
      return handleReels(event, path)
    case 'articles':
      return handleArticles(event, path)
    case 'businesses':
      return handleBusinesses(event, path)
    case 'audience-cards':
      return handleAudienceCards(event, path)
    case 'comments':
      return handleComments(event, path)
    case 'shooting-requests':
      return handleShootingRequests(event, path)
    case 'subscribers':
      return handleSubscribers(event, path)
    case 'settings':
      return handleSettings(event, path)
    case 'upload':
      return handleUploads(event, path)
    default:
      throwAdminError(404, 'Not found')
  }
})
