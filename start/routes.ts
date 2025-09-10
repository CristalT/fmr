import { middleware } from '#start/kernel'
import { sep, normalize } from 'node:path'
import app from '@adonisjs/core/services/app'

import router from '@adonisjs/core/services/router'
import { eshopRoutes, adminRoutes, webhookRoutes, apiRoutes } from '#start/routes/index'
import env from '#start/env'

// eShop routes
router.group(eshopRoutes)

// eShop API routes
router.group(apiRoutes).as('api.v1').prefix('api/v1')

// Webhook routes
router.group(webhookRoutes).as('webhook')

// Admin routes
router
  .group(adminRoutes)
  .prefix('/admin')
  .as('admin')
  .use(middleware.auth({ guards: ['admin'] }))

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

router.get('/uploads/*', ({ request, response }) => {
  const uploadsFolder = env.get('UPLOADS_FOLDER', 'uploads')
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed path')
  }

  const absolutePath = app.makePath(uploadsFolder, normalizedPath)
  return response.download(absolutePath)
})
