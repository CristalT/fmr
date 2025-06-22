const PasswordRecoveryController = () => import('#controllers/password_recovery_controller')
import router from '@adonisjs/core/services/router'

const HomeController = () => import('#controllers/home_controller')
const ProductController = () => import('#controllers/product_controller')
const SessionController = () => import('#controllers/session_controller')
const CustomerAuthController = () => import('#controllers/customer_auth_controller')
const MessageController = () => import('#controllers/message_controller')
const CaptchaController = () => import('#controllers/captcha_controller')
const RegistryController = () => import('#controllers/registry_controller')
const PasswordResetController = () => import('#controllers/password_reset_controller')

export default function publicRoutes() {
  router.get('/', [HomeController, 'index'])
  router.get('/products', [ProductController, 'index'])
  router.get('/products/list', [ProductController, 'list'])
  router.resource('/auth/customers', CustomerAuthController).only(['store', 'show', 'destroy'])
  router.get('/auth/password-reset', [PasswordResetController, 'view'])
  router.post('/auth/password-reset', [PasswordResetController, 'reset'])
  router.resource('/auth/password-recovery', PasswordRecoveryController)
  router
    .get('/auth/password-recovery-success', [PasswordRecoveryController, 'success'])
    .as('password_recovery.success')
  router.get('/auth/login', [SessionController, 'loginView'])
  router.post('/auth/login', [SessionController, 'login'])
  router.get('/auth/logout', [SessionController, 'logout'])
  router.get('/contact/:productId?', [MessageController, 'create'])
  router.resource('/captcha', CaptchaController)
  router.resource('/registries', RegistryController).only(['create', 'store'])
  router.post('/contact', [MessageController, 'store'])
}
