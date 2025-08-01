import Order from '#models/order'
import { getCustomerOrdersValidator } from '#validators/customer_order'
import type { HttpContext } from '@adonisjs/core/http'

export default class CustomerOrdersController {
  async index({ request, response, params }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const paid = request.input('paid', false)
    const customerId = params.customerId

    await getCustomerOrdersValidator.validate(params)

    const orders = Order.query().where('customerId', customerId)

    if (paid) {
      orders.where('paid', paid)
    }

    orders
      .whereNull('receiptId')
      .whereHas('cartItems', (query) => {
        query.where('delivered', '>', 0)
      })
      .preload('cartItems', (query) => {
        query.preload('product')
        query.where('delivered', '>', 0)
      })

    return response.json(await orders.paginate(page, limit))
  }
}
