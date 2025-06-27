import router from '@adonisjs/core/services/router'

const AdminController = () => import('#controllers/admin_controller')
const ProductController = () => import('#controllers/admin/product_controller')
const ProviderController = () => import('#controllers/provider_controller')
const OrderController = () => import('#controllers/admin/order_controller')
const CustomerController = () => import('#controllers/customer_controller')
const MessageController = () => import('#controllers/message_controller')
const RegistryController = () => import('#controllers/registry_controller')
const CartItemController = () => import('#controllers/admin/cart_item_controller')
const SettingController = () => import('#controllers/setting_controller')

export default function adminRoutes() {
  router.get('/', [AdminController, 'index']).as('home')
  router.get('/products/view', [ProductController, 'view']).as('products.view')
  router.resource('/products', ProductController).as('products')
  router.get('/customers/view', [CustomerController, 'view']).as('customers.view')
  router.resource('/customers', CustomerController).as('customers')
  router
    .resource('/messages', MessageController)
    .only(['index', 'show', 'destroy'])
    .as('messages')
  router.get('/providers', [ProviderController, 'index']).as('providers')
  router.resource('/registries', RegistryController).only(['index', 'edit']).as('registries')
  router.resource('/orders', OrderController).as('orders')
  router.get('/orders/:id/print', [OrderController, 'print']).as('orders.print')
  router.resource('/cart-items', CartItemController)
  router.get('/settings/view', [SettingController, 'view']).as('settings.view')
  router.resource('/settings', SettingController).as('settings')
}
