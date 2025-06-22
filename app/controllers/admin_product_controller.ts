import { UPLOADS_FOLDER } from '#config/constants'
import Product from '#models/product'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
export default class AdminProductsController {
  async view({ inertia }: HttpContext) {
    return inertia.render('admin/products/index')
  }

  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 12)
    const terms = request.input('terms', null)
    const queryFilter = request.input('filter')

    const query = Product.query().orderBy('name')

    if (queryFilter) {
      for (const [key, value] of Object.entries(queryFilter)) {
        if (value) query.where(key, '=', String(value))
      }
    }

    if (terms) {
      query.where('name', 'LIKE', `%${terms.replaceAll(' ', '%')}%`)
      query.orWhere('code', 'LIKE', terms)
    }

    return await query.paginate(page, limit)
  }

  async show({ inertia, request }: HttpContext) {
    const product = await Product.query()
      .select(['id', 'code', 'provider', 'public', 'name', 'price', 'image', 'stock'])
      .where('id', request.param('id'))
      .firstOrFail()
    return inertia.render('admin/products/edit', { product })
  }

  async update({ request, params }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    const imageFile = request.file('image')
    const imageName = `${params.id}.png`

    await imageFile?.move(app.makePath(UPLOADS_FOLDER, 'images'), {
      name: imageName,
    })

    product.fill(request.all())
    product.image = imageName

    product.save()
  }
}
