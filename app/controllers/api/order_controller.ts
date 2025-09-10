import CartItem from '#models/cart_item'
import Newsletter from '#models/newsletter'
import Order from '#models/order'
import { OrderStatus } from '#types/order_status'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class OrderController {
  async index({ request, response, auth }: HttpContext) {
    const page = request.input('page', 1)
    const order = request.input('order', 'asc')
    const orderBy = request.input('orderBy', 'createdAt')

    const data = await Order.query()
      .preload('customer', (builder) => {
        builder.select(['id', 'firstName', 'lastName'])
        builder.where('id', auth.user?.id!)
      })
      .preload('cartItems', (builder) => {
        builder.preload('product')
      })
      .preload('deliveryInfo')
      .orderBy(orderBy, order)
      .paginate(page, 10)
    return response.json(data)
  }

  async store({ request, response, auth }: HttpContext) {
    const isSubscribed = request.input('newsletter', false)
    const deliveryInfo = request.input('deliveryInfo')

    if (isSubscribed) {
      const { email } = deliveryInfo
      Newsletter.updateOrCreate({ email }, { email })
    }

    const customer = auth.use('api').getUserOrFail()

    await db.transaction(async (trx) => {
      const cartItems = await CartItem.query({ client: trx })
        .where('customerId', customer.id)
        .where('status', OrderStatus.InCart)

      const order = new Order()
      order.customerId = customer.id
      order.status = OrderStatus.Pending
      order.useTransaction(trx)
      await order.save()

      await order.related('cartItems').saveMany(cartItems)
      await order.related('deliveryInfo').create(deliveryInfo)

      await CartItem.query({ client: trx })
        .where('customerId', customer.id)
        .where('status', OrderStatus.InCart)
        .update({ status: OrderStatus.Pending })
    })

    return response.json({ success: true, message: 'Order placed successfully' })
  }
}
