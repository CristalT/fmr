import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/api/auth_controller')
const ProductController = () => import('#controllers/api/product_controller')
const CartController = () => import('#controllers/api/cart_controller')
const MessageController = () => import('#controllers/api/message_controller')
const ContactInfoController = () => import('#controllers/api/contact_info_controller')
const CaptchaController = () => import('#controllers/api/captcha_controller')
const OrderController = () => import('#controllers/api/order_controller')
const SettingController = () => import('#controllers/api/setting_controller')
const FavoriteController = () => import('#controllers/api/favorite_controller')

export default function apiRoutes() {
  /**
   * Auth Routes
   */
  router
    .group(() => {
      router.post('login', [AuthController, 'login']).as('login')
      router.post('signup', [AuthController, 'signup']).as('signup')
    })
    .prefix('auth')

  router
    .group(() => {
      router.get('me', [AuthController, 'me']).as('me')
      router.post('logout', [AuthController, 'logout']).as('logout')
      router.post('refresh', [AuthController, 'refresh']).as('refresh')
      router.put('profile', [AuthController, 'updateProfile']).as('profile')
      router.put('password-reset', [AuthController, 'passwordReset']).as('password-reset')
      router.post('forgot-password', [AuthController, 'forgotPassword']).as('forgot-password')
    })
    .use(middleware.auth({ guards: ['api'] }))
    .prefix('auth')

  /**
   * Product Routes
   */
  router.resource('products', ProductController).only(['index', 'show']).as('products')

  /**
   * Cart Routes
   */
  router
    .group(() => {
      router.resource('cart', CartController).as('cart')
      router.post('cart-sync', [CartController, 'sync']).as('cart.sync')
    })
    .use(middleware.auth({ guards: ['api'] }))

  /**
   * Favorites Routes
   */
  router
    .group(() => {
      router.resource('favorites', FavoriteController).as('favorites')
      router.post('favorites-sync', [FavoriteController, 'sync']).as('favorites.sync')
    })
    .use(middleware.auth({ guards: ['api'] }))

  /**
   * Order routes
   */
  router
    .group(() => {
      router.resource('orders', OrderController).as('orders')
    })
    .use(middleware.auth({ guards: ['api'] }))

  /**
   * Contact Routes
   */
  router.post('messages', [MessageController, 'store']).as('messages')
  router.get('contact-info', [ContactInfoController, 'index']).as('contact-info')
  router.get('captcha', [CaptchaController, 'index']).as('captcha')

  /**
   * Settings
   */
  router.get('settings', [SettingController, 'index']).as('settings')
}
