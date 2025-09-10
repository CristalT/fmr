import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import setting from '#helpers/setting'

export default class ProductController {
  async index({ inertia }: HttpContext) {
    return inertia.render('products/index')
  }

  async list({ request, auth }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 12)

    const queryOptions = {
      terms: request.input('terms', null),
      hideZeroStock: await setting('stock_hide_products_with_zero_stock'),
      hideZeroPrice: await setting('stock_hide_products_with_zero_price'),
      interval: await setting('stock_round_interval'),
    }

    let fields = ['id', 'name', 'image', 'code']

    if (await auth.check()) fields = fields.concat(['price', 'stock', 'brand', 'provider'])

    const query = Product.query()
      .withScopes((scope) => scope.eshopSearch(queryOptions))
      .select(fields)
      .orderBy('name')

    return await query.paginate(page, limit)
  }
}
