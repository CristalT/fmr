import { middleware } from '#start/kernel'
import { sep, normalize } from 'node:path'
import app from '@adonisjs/core/services/app'

const CartController = () => import('#controllers/cart_controller')
const OrderController = () => import('#controllers/order_controller')

import router from '@adonisjs/core/services/router'
import { publicRoutes, adminRoutes } from '#start/routes/index'

// Public routes
router.group(() => publicRoutes())

// Admin routes
router
  .group(() => adminRoutes())
  .prefix('/admin')
  .as('admin')
  .use(middleware.auth({ guards: ['admin'] }))

// Customer routes
router
  .group(() => {
    router.resource('/carts', CartController)
    router.get('/cart/items', [CartController, 'getCartItems'])
    router.get('/pdfs/current-cart', [CartController, 'print'])
    router.resource('/orders', OrderController).only(['store', 'index'])
  })
  .use(middleware.auth({ guards: ['customer', 'admin'] }))

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

router.get('/uploads/*', ({ request, response }) => {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed path')
  }

  const absolutePath = app.makePath('uploads', normalizedPath)
  return response.download(absolutePath)
})
