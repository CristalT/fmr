import { UPLOADS_FOLDER } from '#config/constants'
import Product from '#models/product'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import sharp from 'sharp'

export default class StockController {
  async view({ inertia }: HttpContext) {
    return inertia.render('admin/stock/index')
  }
  async index({ response, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 12)
    const terms = request.input('terms', null)
    const filter = request.input('filter')

    const data = await Product.query()
      .withScopes((scope) => scope.search({ terms, filter }))
      .select('id', 'name', 'image', 'code', 'price', 'stock', 'location', 'public', 'provider', 'factoryCode')
      .orderBy('name')
      .paginate(page, limit)

    return response.json(data)
  }

  async show({ inertia, request }: HttpContext) {
    const product = await Product.query()
      .withScopes((scopes) => scopes.getForEdit(request.param('id')))
      .firstOrFail()
    return inertia.render('admin/stock/edit', { product })
  }

  async update({ request, params, response, logger }: HttpContext) {
    const data = request.all()
    const product = await Product.findOrFail(params.id)
    const imageFile = request.file('imageFile')
    const imageName = `${params.id}.webp`

    if (imageFile) {
      try {
        await sharp(imageFile.tmpPath)
          .webp({ quality: 80 })
          .toFile(app.makePath(UPLOADS_FOLDER, 'images', imageName))
      } catch (error) {
        logger.error('Failed to process image. ' + error.message)
      }
      data.image = imageName
    } else {
      delete product.image
    }

    product.fill(data)

    await product.save()

    response.redirect().toRoute('admin.stock.view')
  }
}
