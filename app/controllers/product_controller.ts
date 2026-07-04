import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import setting from '#helpers/setting'

export default class ProductController {
  async index({ inertia }: HttpContext) {
    return inertia.render('products/index')
  }

  async show({ params, auth, inertia }: HttpContext) {
    const queryOptions = {
      hideZeroStock: await setting('stock_hide_products_with_zero_stock'),
      hideZeroPrice: await setting('stock_hide_products_with_zero_price'),
      interval: await setting('stock_round_interval'),
    }

    let fields = ['id', 'name', 'image', 'code', 'description', 'details']

    if (await auth.check()) fields = fields.concat(['price', 'stock', 'brand', 'provider'])

    const product = await Product.query()
      .where('id', params.id)
      .withScopes((scope) => scope.eshopSearch(queryOptions))
      .select(fields)
      .firstOrFail()

    const firstWord = product.name.split(' ')[0]

    const relatedProducts = await Product.query()
      .where('name', 'LIKE', `${firstWord}%`)
      .where('id', '!=', product.id)
      .withScopes((scope) => scope.eshopSearch(queryOptions))
      .select(fields)
      .orderByRaw('RAND()')
      .limit(8)

    return inertia.render('products/show', { product, relatedProducts })
  }

  async list({ request, auth }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 12)

    const queryOptions = {
      search: request.input('terms', null),
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
