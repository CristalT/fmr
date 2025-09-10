import CartItem from '#models/cart_item'
import Product from '#models/product'
import { OrderStatus } from '#types/order_status'
import { HttpContext } from '@adonisjs/core/http'

export default class CartController {
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
    const { productId, quantity } = request.all()

    const product = await Product.findOrFail(productId)

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

    return response.created(cart)
  }

  async update({ auth, request, response, params }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized()
    }

    const productId = params.id
    const { quantity } = request.all()
    const cartItem = await CartItem.query()
      .where('productId', productId)
      .where('customerId', auth.user.id)
      .where('status', OrderStatus.InCart)
      .firstOrFail()

    cartItem.merge({ quantity })
    await cartItem.save()

    return response.json(cartItem)
  }

  async destroy({ auth, response, params }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized()
    }

    const productId = params.id

    const cartItem = await CartItem.query()
      .where('productId', productId)
      .where('customerId', auth.user.id)
      .where('status', OrderStatus.InCart)
      .firstOrFail()

    await cartItem.delete()

    return response.noContent()
  }

  async sync({ auth, request, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized()
    }

    const { cart } = request.all()

    // Validate and sync cart items
    for (const key in cart) {
      const item = cart[key]

      const { productId, quantity } = item

      const product = await Product.findOrFail(productId)

      const cartItem = await CartItem.query()
        .where('productId', product.id)
        .where('customerId', auth.user.id)
        .where('status', OrderStatus.InCart)
        .first()

      if (cartItem) {
        cartItem.merge({ quantity })
        await cartItem.save()
      } else {
        await CartItem.create({
          customerId: auth.user.id,
          productId: product.id,
          quantity,
          status: OrderStatus.InCart,
        })
      }
    }

    return response.json({ success: true })
  }
}
