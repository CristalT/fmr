import router from '@adonisjs/core/services/router'

// controllers
const CartItemController = () => import('#controllers/cart_item_controller')
const OrderController = () => import('#controllers/order_controller')

export default function customerRoutes() {
  router.get('/cart-items/view', [CartItemController, 'view'])
  router.resource('/cart-items', CartItemController)
  router.resource('/orders', OrderController)
}
