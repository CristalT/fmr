import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class ProductController {
  async index({ inertia }: HttpContext) {
    return inertia.render('products/index')
  }

  async list({ request, auth }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 12)
    const terms = request.input('terms', null)

    let columns = ['id', 'name', 'image', 'code']

    if (await auth.check()) columns = columns.concat(['price', 'stock', 'brand', 'provider'])

    const query = Product.query().withScopes((scope) => scope.publicSearch({ terms })).select(columns)

    return await query.paginate(page, limit)
  }
}
