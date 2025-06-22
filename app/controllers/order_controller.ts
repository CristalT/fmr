import CartItem from '#models/cart_item'
import Order from '#models/order'
import { HttpContext } from '@adonisjs/core/http'

export default class OrderController {
  async index({ inertia, auth }: HttpContext) {
    const orders = await Order.query()
      .where('customer_user_id', auth.user?.id!)
      .preload('cartItems')

    return inertia.render('cart/orders', { orders })
  }
  async store({ response, auth }: HttpContext) {
    // create order
    const order = await Order.create({
      customerUserId: auth.user?.id!,
    })

    await CartItem.query().where('customer_user_id', auth.user?.id!).where('status', 0).update({
      order_id: order.id,
      status: 1,
    })

    return response.created()
  }
}
