import { UPLOADS_FOLDER } from '#config/constants'
import Product from '#models/product'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import sharp from 'sharp'

export default class ProductController {
  async index({ inertia, request }: HttpContext) {
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

    const data = await query.paginate(page, limit)
    return inertia.render('admin/products/index', { data })
  }

  async show({ inertia, request }: HttpContext) {
    const product = await Product.query()
      .select([
        'id',
        'code',
        'provider',
        'public',
        'name',
        'price',
        'fob',
        'image',
        'stock',
        'location',
      ])
      .where('id', request.param('id'))
      .firstOrFail()
    return inertia.render('admin/products/edit', { product })
  }

  async update({ request, params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    const imageFile = request.file('imageFile')
    const imageName = `${params.id}.webp`

    if (imageFile) {
      sharp(imageFile.tmpPath)
        .webp({ quality: 80 })
        .toFile(app.makePath(UPLOADS_FOLDER, 'images', imageName))
    }

    const data = request.all()

    product.fill(data)
    product.image = imageName

    await product.save()

    response.redirect('/admin/products?reload')
  }
}
