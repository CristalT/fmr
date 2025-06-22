import Order from '#models/order'
import { HttpContext } from '@adonisjs/core/http'
import OrderPrinter from '#actions/order_printer'
import OrderService from '#services/order_service'
import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import cache from '@adonisjs/cache/services/main'

@inject()
export default class OrderController {
  constructor(private orderService: OrderService) {}

  async index({ inertia, request }: HttpContext) {
    const query = Order.query()
      .preload('cartItems')
      .preload('customerUser')
      .orderBy('createdAt', 'asc')

    const { status } = request.qs()

    if (status) {
      query.where('status', status)
    }

    const orders = await query.exec()

    return inertia.render('admin/orders/index', { orders })
  }

  async show({ inertia, params, response }: HttpContext) {
    const order = await this.orderService.getById(params.id)
    if (!order) {
      return response.notFound('Order not found')
    }
    return inertia.render('admin/orders/show', { order })
  }

  async update({ params, request, response }: HttpContext) {
    const order = await Order.findOrFail(params.id)

    Object.assign(order, request.all())

    await order
      .save()
      .then(() => {
        cache.delete({ key: `order:${order.id}` }) // Invalidate cache for this order
        return response.noContent()
      })
      .catch((error) => {
        logger.error('Failed to update order:', error)
        return response.internalServerError('Failed to update order')
      })
  }

  async print({ params, response }: HttpContext) {
    const order = await this.orderService.getById(params.id)
    if (!order) {
      return response.notFound('Order not found')
    }

    const printer = new OrderPrinter()
    const doc = await printer.setData(order).generatePDF()

    response.header('content-type', 'application/pdf')
    response.stream(doc)
  }
}
