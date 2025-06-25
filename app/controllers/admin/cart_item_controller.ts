import CartItem from '#models/cart_item'
import cache from '@adonisjs/cache/services/main'
import { HttpContext } from '@adonisjs/core/http'

export default class CartItemController {
  async update({ params, request, response }: HttpContext) {
    const orderId = request.input('orderId')
    const cartItem = await CartItem.findOrFail(params.id)
    cartItem.delivered = request.input('delivered')
    await cartItem.save()
    cache.delete({ key: `order:${orderId}` })
    return response.noContent()
  }
}
