import Order from '#models/order'
import cache from '@adonisjs/cache/services/main'

export default class OrderService {
  getById(id: number): Promise<Order> {
    return cache.getOrSet({
      key: `order:${id}`,
      ttl: '1 hour',
      factory: () =>
        Order.query()
          .preload('cartItems', (query) => query.preload('product'))
          .preload('customerUser')
          .where('id', id)
          .firstOrFail(),
    })
  }
}
