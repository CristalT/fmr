import router from '@adonisjs/core/services/router'

const AdminController = () => import('#controllers/admin_controller')
const ProductController = () => import('#controllers/admin/product_controller')
const ProviderController = () => import('#controllers/provider_controller')
const OrderController = () => import('#controllers/admin/order_controller')
const CustomerController = () => import('#controllers/customer_controller')
const MessageController = () => import('#controllers/message_controller')
const RegistryController = () => import('#controllers/registry_controller')
const CartItemController = () => import('#controllers/admin/cart_item_controller')

export default function adminRoutes() {
  router.get('/', [AdminController, 'index']).as('admin.index')
  router.resource('/products', ProductController).as('admin.products')
  router.get('/customers/view', [CustomerController, 'view']).as('admin.customers.view')
  router.resource('/customers', CustomerController).as('admin.customers')
  router
    .resource('/messages', MessageController)
    .only(['index', 'show', 'destroy'])
    .as('admin.messages')
  router.get('/providers', [ProviderController, 'index']).as('admin.providers')
  router.resource('/registries', RegistryController).only(['index', 'edit']).as('admin.registries')
  router.resource('/orders', OrderController).as('admin.orders')
  router.get('/orders/:id/print', [OrderController, 'print']).as('admin.orders.print')
  router.resource('/cart-items', CartItemController)
}
