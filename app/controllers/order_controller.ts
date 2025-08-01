import CartItem from '#models/cart_item'
import Customer from '#models/customer'
import Order from '#models/order'
import { PaymentService } from '#services/payment_service'
import { OrderStatus } from '#types/order_status'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class OrderController {
  async index({ request, inertia, auth }: HttpContext) {
    const page = request.input('page', 1)

    const data = await Order.query()
      .where('customer_user_id', auth.user?.id!)
      .preload('cartItems')
      .orderBy('created_at', 'desc')
      .paginate(page, 10)

    return inertia.render('order/list', { data })
  }
  async show({ params, auth, inertia }: HttpContext) {
    const order = await Order.query()
      .where('customer_user_id', auth.user?.id!)
      .where('id', params.id)
      .preload('cartItems', (query) => {
        query.preload('product', (productQuery) => {
          productQuery.select(['id', 'code', 'name', 'price'])
        })
      })
      .preload('customer', (query) => {
        query.select(['id', 'firstName', 'lastName'])
      })
      .firstOrFail()

    return inertia.render('order/show', { order })
  }

  async edit({ inertia, params }: HttpContext) {
    const order = await Order.byId(params.id)

    const renderProps: Record<string, any> = { order }

    const payment = new PaymentService(order)

    renderProps.paymentMethods = await payment.methods()

    return inertia.render('order/edit', renderProps)
  }

  async store({ response, auth }: HttpContext) {
    const customer = await Customer.findOrFail(auth.user?.id!)

    // create order
    const order = new Order()
    await order.related('customer').associate(customer)

    // associate cart items with the order
    await CartItem.query()
      .where('customer_user_id', auth.user?.id!)
      .where('status', OrderStatus.InCart)
      .update({
        order_id: order.id,
        status: OrderStatus.Pending,
      })

    if (customer.paymentOnDelivery) {
      return response.redirect().toRoute('orders.show', { id: order.id })
    }

    return response.redirect(`/orders/${order.id}/edit`)
  }
}
