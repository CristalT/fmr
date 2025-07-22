import CartItem from '#models/cart_item'
import Order from '#models/order'
import { OrderStatus } from '#types/order_status'
import { HttpContext } from '@adonisjs/core/http'

export default class OrderController {
  async index({ request, inertia, auth }: HttpContext) {
    const page = request.input('page', 1)

    const data = await Order.query()
      .where('customer_user_id', auth.user?.id!)
      .preload('cartItems')
      .orderBy('created_at', 'desc')
      .paginate(page, 10)

    return inertia.render('cart/orders', { data })
  }
  async show({ params, auth, inertia }: HttpContext) {
    const order = await Order.query()
      .where('customer_user_id', auth.user?.id!)
      .where('id', params.id)
      .preload('cartItems', (query) => {
        query.preload('product', (productQuery) => {
          productQuery.select(['id', 'code', 'name'])
        })
      })
      .preload('customerUser', (query) => {
        query.select(['id', 'firstName', 'lastName'])
      })
      .firstOrFail()

    return inertia.render('cart/order', { order })
  }
  async store({ response, auth }: HttpContext) {
    // create order
    const order = await Order.create({
      customerUserId: auth.user?.id!,
    })

    // associate cart items with the order
    await CartItem.query()
      .where('customer_user_id', auth.user?.id!)
      .where('status', OrderStatus.InCart)
      .update({
        order_id: order.id,
        status: OrderStatus.Pending,
      })

    await order.load('cartItems')

    return response.created(order)
  }
}
