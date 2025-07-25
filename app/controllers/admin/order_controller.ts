import Order from '#models/order'
import { HttpContext } from '@adonisjs/core/http'
import OrderPrint from '#services/doc_prints/order'
import logger from '@adonisjs/core/services/logger'
import cache from '@adonisjs/cache/services/main'
import { OrderStatus } from '#types/order_status'

export default class OrderController {
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 16)
    const status = request.input('status', null)

    const query = Order.query()
      .whereHas('customer', (q) => {
        q.where('firstName', 'LIKE', `%${request.input('terms', '')}%`).orWhere(
          'lastName',
          'LIKE',
          `%${request.input('terms', '')}%`
        )
      })
      .preload('customer', (builder) => {
        builder
          .where('firstName', 'LIKE', `%${request.input('terms', '')}%`)
          .orWhere('lastName', 'LIKE', `%${request.input('terms', '')}%`)
        builder.select(['id', 'firstName', 'lastName'])
      })
      .preload('cartItems')
      .orderBy('createdAt', 'asc')

    if (status) {
      query.where('status', status)
    }

    const data = await query.paginate(page, limit)

    return inertia.render('admin/orders/index', { data })
  }

  async show({ inertia, params, response }: HttpContext) {
    const order = await Order.byId(params.id)
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
    const order = await Order.byId(params.id)

    if (!order) {
      return response.notFound('Order not found')
    }

    const print = new OrderPrint(order.id)

    const doc = await print
      .customer(order.customer)
      .items(
        order.cartItems.map((item) => ({
          ...item.product,
          quantity: item.quantity,
        }))
      )
      .generatePDF()

    response.header('content-type', 'application/pdf')
    response.stream(doc)
  }
}
