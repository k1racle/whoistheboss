import {
  handleArticles,
  handleBusinesses,
  handleEntrepreneurs,
  handleInterviews,
  handleReels,
} from '@server/utils/admin-content-handlers'
import {
  handleAudienceCards,
  handleCities,
  handleComments,
  handleSettings,
  handleShootingRequests,
  handleSubscribers,
  handleUsers,
} from '@server/utils/admin-operations-handlers'
import { requireAdminUser, throwAdminError } from '@server/utils/admin-api'
import { handleUploads } from '@server/utils/admin-upload-handler'
import { invalidatePublicCache } from '@server/utils/public-cache'
import { toHttpPrismaError } from '@server/utils/prisma-errors'
import { assertSameOriginMutation } from '@server/utils/request-security'

export default defineEventHandler(async (event) => {
  const routePath = getRouterParam(event, 'path') || ''
  const [resource, ...path] = routePath.split('/').filter(Boolean)

  if (!resource) throwAdminError(404, 'Not found')

  const adminUser = await requireAdminUser(event, resource === 'users' ? ['ADMIN'] : ['ADMIN', 'EDITOR'])
  assertSameOriginMutation(event)

  try {
    let result: unknown
    switch (resource) {
      case 'users':
        result = await handleUsers(event, path, adminUser)
        break
      case 'entrepreneurs':
        result = await handleEntrepreneurs(event, path)
        break
      case 'interviews':
        result = await handleInterviews(event, path)
        break
      case 'reels':
        result = await handleReels(event, path)
        break
      case 'articles':
        result = await handleArticles(event, path)
        break
      case 'businesses':
        result = await handleBusinesses(event, path)
        break
      case 'audience-cards':
        result = await handleAudienceCards(event, path)
        break
      case 'cities':
        result = await handleCities(event, path)
        break
      case 'comments':
        result = await handleComments(event, path)
        break
      case 'shooting-requests':
        result = await handleShootingRequests(event, path)
        break
      case 'subscribers':
        result = await handleSubscribers(event, path)
        break
      case 'settings':
        result = await handleSettings(event, path, adminUser)
        break
      case 'upload':
        result = await handleUploads(event, path)
        break
      default:
        throwAdminError(404, 'Not found')
    }

    if (!['GET', 'HEAD'].includes(event.method.toUpperCase())) {
      await invalidatePublicCache()
    }
    return result
  }
  catch (error) {
    const mapped = toHttpPrismaError(error)
    if (mapped) throw mapped
    throw error
  }
})
