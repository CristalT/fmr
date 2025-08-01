import { HttpContext } from '@adonisjs/core/http'
import { OrderStatus } from '#types/order_status'

import Product from '#models/product'
import CartItem from '#models/cart_item'
import cache from '@adonisjs/cache/services/main'

export default class CartItemController {
  async view({ inertia }: HttpContext) {
    return inertia.render('cart/current')
  }

  async index({ response }: HttpContext) {
    const items = await CartItem.query()
      .withScopes((scopes) => scopes.getItemsByStatus(OrderStatus.InCart))
      .preload('product')

    return response.json(items)
  }

  async store({ request, auth, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized()
    }

    const { id, quantity } = request.all()

    const product = await Product.findOrFail(id)

    const exists = await CartItem.query()
      .where('productId', product.id)
      .where('customerId', auth.user.id)
      .where('status', OrderStatus.InCart)
      .first()

    if (exists) {
      return response.conflict('El producto ya se encuentra en el carrito')
    }

    const cart = await CartItem.create({
      customerId: auth.user?.id,
      quantity,
    })

    await cart.related('product').associate(product)

    return response.created()
  }

  async update({ request, response }: HttpContext) {
    const orderId = request.input('orderId', null)

    const { id } = request.params()

    const cartItem = await CartItem.findOrFail(id)

    cartItem.merge(request.all())
    await cartItem.save()

    if (orderId) {
      cache.delete({ key: `order:${orderId}` })
    }

    return response.json(cartItem)
  }

  async destroy({ request, response }: HttpContext) {
    const id = request.param('id')
    const cartItem = await CartItem.findOrFail(id)
    await cartItem.delete()

    return response.noContent()
  }
}
