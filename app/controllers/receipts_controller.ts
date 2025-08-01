import Order from '#models/order'
import Receipt from '#models/receipt'
import { createReceiptvalidation } from '#validators/receipt'
import type { HttpContext } from '@adonisjs/core/http'
import { sumBy } from 'lodash-es'

export default class ReceiptsController {
  async index({ inertia, request }: HttpContext) {
    const search = request.input('search', '')
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const query = Receipt.query()
      .preload('author')
      .whereHas('customer', (builder) => {
        if (search) {
          builder.where('firstName', 'LIKE', `%${search}%`)
          builder.orWhere('lastName', 'LIKE', `%${search}%`)
        }
      })
      .preload('customer')
      .orderBy('createdAt', 'desc')

    const results = await query.paginate(page, limit)

    return inertia.render('admin/receipts/list', { results })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('admin/receipts/create')
  }

  async store({ inertia, request, response, auth }: HttpContext) {
    const orderIds = request.input('orderIds', [])
    let orders: Order[] = []
    let minAmount = 1

    if (orderIds.length) {
      orders = await Order.byIds(orderIds)

      if (!orders.length) {
        return inertia.render('admin/receipts/create', {
          errors: {
            orderIds: ['Debe seleccionar al menos un pedido para crear un recibo.'],
          },
        })
      }

      minAmount = sumBy(orders, (order) =>
        sumBy(order.cartItems, (item) => item.delivered * item.product.price)
      )
    }

    await request.validateUsing(createReceiptvalidation(minAmount))

    const receiptData = request.only([
      'customerId',
      'paymentDate',
      'paymentMethods',
      'amount',
      'description',
    ])

    const receipt = await Receipt.create({
      ...receiptData,
      createdBy: auth.user?.id,
      paymentMethods: JSON.stringify(receiptData.paymentMethods),
    })

    if (orders.length) {
      receipt.related('orders').saveMany(orders)
    }

    return response.redirect().toRoute('admin.receipts.index')
  }
}
