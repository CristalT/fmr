import { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import CartItem from '#models/cart_item'
import { CartItemStatus } from '#types/cart_item_status'

export default class CartItemController {
  async view({ inertia }: HttpContext) {
    return inertia.render('cart/current')
  }
  
  async index({ response }: HttpContext) {
    const items = await CartItem.query()
      .withScopes((scopes) => scopes.getItemsByStatus(CartItemStatus.Pending))
      .preload('product')

    return response.json(items)
  }

  async store({ request, auth, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized()
    }

    const { id, quantity } = request.all()

    const product = await Product.findOrFail(id)

    const cartItem = await CartItem.query()
      .withScopes((scopes) => scopes.getItemByCode(product.code))
      .first()

    if (cartItem) {
      return response.conflict('El producto ya se encuentra en el carrito')
    }

    const cart = await CartItem.create({
      customerUserId: auth.user?.id,
      quantity,
      code: product.code,
      name: product.name,
    })

    await cart.related('product').associate(product)

    return response.created()
  }

  async update({ request, response }: HttpContext) {
    const { quantity } = request.only(['quantity'])
    const { id } = request.params()

    const cartItem = await CartItem.findOrFail(id)
    cartItem.quantity = quantity
    await cartItem.save()

    return response.json(cartItem)
  }

  async destroy({ request, response }: HttpContext) {
    const id = request.param('id')
    const cartItem = await CartItem.findOrFail(id)
    await cartItem.delete()

    return response.noContent()
  }
}
