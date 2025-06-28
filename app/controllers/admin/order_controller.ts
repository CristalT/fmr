import Order from '#models/order'
import { HttpContext } from '@adonisjs/core/http'
import OrderPrinter from '#actions/order_printer'
import OrderService from '#services/order_service'
import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import cache from '@adonisjs/cache/services/main'
import { OrderStatus } from '#types/order_status'

@inject()
export default class OrderController {
  constructor(private orderService: OrderService) {}

  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 12)
    const status = request.input('status', null)

    const query = Order.query()
      .whereHas('customerUser', (q) => {
        q
          .where('firstName', 'LIKE', `%${request.input('terms', '')}%`)
          .orWhere('lastName', 'LIKE', `%${request.input('terms', '')}%`)
      })
      .preload('customerUser')
      .preload('cartItems')
      .orderBy('createdAt', 'asc')


    if (status) {
      query.where('status', status)
    }

    const data = await query.paginate(page, limit)

    return inertia.render('admin/orders/index', { data })
  }

  async show({ inertia, params, response }: HttpContext) {
    const order = await this.orderService.getById(params.id)
    if (!order) {
      return response.notFound('Order not found')
    }

    if (order.status === OrderStatus.Processing) {
      return inertia.render('admin/orders/processing', { order })
    }
    if (order.status === OrderStatus.Completed) {
      return inertia.render('admin/orders/completed', { order })
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
      })
      .catch((error) => {
        logger.error('Failed to update order: ' + error.message)
        return response.internalServerError('Failed to update order.')
      })

    return response.noContent()
  }

  async destroy({ params, response }: HttpContext) {
    const order = await Order.findOrFail(params.id)

    try {
      await order.related('cartItems').query().delete()
      await order.delete()
      await cache.delete({ key: `order:${order.id}` }) // Invalidate cache for this order
    } catch (error) {
      logger.error('Failed to delete order: ' + error.message)
      return response.internalServerError('Failed to delete order.')
    }

    return response.noContent()
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
