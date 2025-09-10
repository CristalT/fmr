import Favorite from '#models/favorite'
import Product from '#models/product'
import { HttpContext } from '@adonisjs/core/http'

export default class FavoriteController {
  async index({ response, auth }: HttpContext) {
    if (!auth.user) {
      return response.status(401).json({ message: 'Unauthorized' })
    }
    const results = await Favorite.query()
      .preload('product', (query) =>
        query.preload('categories').select('name', 'image', 'price', 'code')
      )
      .where('customerId', auth.user.id)
      .select('id', 'productId', 'customerId', 'createdAt')

    return response.json(results)
  }

  async store({ request, auth, response }: HttpContext) {
    if (!auth.user) {
      return response.status(401).json({ message: 'Unauthorized' })
    }

    const existingFavorite = await Favorite.query()
      .where('customerId', auth.user.id)
      .where('productId', request.input('id'))
      .first()

    if (existingFavorite) {
      return response.status(409).json({ message: 'Favorite already exists' })
    }

    const product = await Product.findOrFail(request.input('id'))

    const favoriteItem = await Favorite.create({
      customerId: auth.user.id,
    })

    favoriteItem.related('product').associate(product)

    return response.status(201).json(favoriteItem)
  }

  async update({ auth, request, response, params }: HttpContext) {
    if (!auth.user) {
      return response.status(401).json({ message: 'Unauthorized' })
    }

    const favoriteItem = await Favorite.findOrFail(params.id)
    const product = await Product.findOrFail(request.input('productId'))

    favoriteItem.related('product').associate(product)

    return response.status(200).json(favoriteItem)
  }

  async destroy({ auth, response, params }: HttpContext) {
    if (!auth.user) {
      return response.status(401).json({ message: 'Unauthorized' })
    }

    const favoriteItem = await Favorite.query().where('productId', params.id).firstOrFail()
    await favoriteItem.delete()

    return response.noContent()
  }

  async sync({ auth, request, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized()
    }

    const { favorites } = request.all()

    console.log(favorites)

    // Validate and sync favorite items
    for (const key in favorites) {
      const item = favorites[key]

      delete item.id

      const { productId } = item

      const product = await Product.findOrFail(productId)

      const favoriteItem = await Favorite.query()
        .where('productId', product.id)
        .where('customerId', auth.user.id)
        .first()

      if (favoriteItem) {
        favoriteItem.merge(item)
        await favoriteItem.save()
      } else {
        const favorite = await Favorite.create({
          customerId: auth.user.id,
          productId: product.id,
        })
        await favorite.related('product').associate(product)
      }
    }

    return response.json({ success: true })
  }
}
