import setting from '#helpers/setting'
import Product from '#models/product'
import { HttpContext } from '@adonisjs/core/http'

export default class ProductController {
  async index({ request, auth }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 12)
    const search = request.input('search', null)

    const queryOptions = {
      search,
      hideZeroStock: await setting('stock_hide_products_with_zero_stock'),
      hideZeroPrice: await setting('stock_hide_products_with_zero_price'),
      interval: await setting('stock_round_interval'),
    }

    let fields = ['id', 'name', 'image', 'code', 'provider']

    const isAuthenticated = await auth.use('api').check()

    if (isAuthenticated) {
      fields = fields.concat(['price', 'stock', 'brand', 'provider'])
    }

    const query = Product.query()
      .withScopes((scope) => scope.eshopSearch(queryOptions))
      .preload('categories')
      .select(fields)
      .orderBy('name')

    return await query.paginate(page, limit)
  }

  async show({ request, response }: HttpContext) {
    const productId = request.param('id')

    try {
      const product = await Product.query()
        .where('id', productId)
        .preload('categories')
        .firstOrFail()

      return response.json(product)
    } catch {
      return response.status(404).json({ message: 'Product not found' })
    }
  }
}
