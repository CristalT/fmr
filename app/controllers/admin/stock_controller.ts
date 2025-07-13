import { UPLOADS_FOLDER } from '#config/constants'
import Product from '#models/product'
import Provider from '#models/provider'
import { createStockItemValidator } from '#validators/stock'
import { MultipartFile } from '@adonisjs/core/bodyparser'
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
    const onlyPublic = request.input('onlyPublic', false)

    const data = await Product.query()
      .withScopes((scope) => scope.search({ terms, filter, onlyPublic }))
      .select(
        'id',
        'name',
        'image',
        'code',
        'price',
        'stock',
        'location',
        'public',
        'provider',
        'factoryCode'
      )
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

  async create({ inertia }: HttpContext) {
    const providers = await Provider.all()
    console.log(providers)
    return inertia.render('admin/stock/create', { providers })
  }

  async store({ request, response }: HttpContext) {
    const data = request.all()
    data.id = `${data.code}${data.provider}`

    await createStockItemValidator.validate(data)

    const product = await Product.create(data)

    const imageFile = request.file('image')
    const imageName = `${data.id}.webp`

    if (imageFile) {
      await sharp(imageFile.tmpPath)
        .webp({ quality: 80 })
        .toFile(app.makePath(UPLOADS_FOLDER, 'images', imageName))
      product.image = imageName
      await product.save()
    }
    return response.redirect().toRoute('admin.stock.view')
  }

  async uploadImage({ request, params, response, logger }: HttpContext) {
    const imageFile = request.file('imageFile')
    const imageName = `${params.id}.webp`

    if (imageFile instanceof MultipartFile) {
      const product = await Product.findOrFail(params.id)

      try {
        await sharp(imageFile.tmpPath)
          .webp({ quality: 80 })
          .toFile(app.makePath(UPLOADS_FOLDER, 'images', imageName))

        product.image = imageName
        await product.save()
        return response.json(product)
      } catch (error) {
        logger.error('Failed to process image. ' + error.message)
        return response.status(500).json({ error: 'Failed to process image' })
      }
    }
  }

  async update({ request, params }: HttpContext) {
    const data = request.all()
    const product = await Product.findOrFail(params.id)
    product.fill(data)
    await product.save()
  }
}
