import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  async list({ inertia }: HttpContext) {
    return inertia.render('admin/stock/categories')
  }

  async index({ request, response }: HttpContext) {
    const parentId = request.input('parentId', null)
    const results = await Category.query()
      .where('parentId', parentId)
      .withAggregate('products', (builder) => {
        builder.count('products.id').as('productsCount')
      })
      .orderBy('name', 'asc')

    const categories = results.map((category) => ({
      ...category.$attributes,
      productsCount: category.$extras.productsCount,
    }))
    return response.json(categories)
  }

  async show({ request, response }: HttpContext) {
    const category = await Category.query()
      .preload('products')
      .where('id', request.param('id'))
      .firstOrFail()

    return response.json(category)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['parentId', 'name', 'slug', 'description'])
    const productIds = request.input('productIds', [])
    const category = await Category.create(data)
    await category.related('products').sync(productIds)
    return response.status(201).json(category)
  }

  async update({ request, response }: HttpContext) {
    const category = await Category.findOrFail(request.param('id'))
    const productIds = request.input('productIds', [])
    const data = request.only(['parentId', 'name', 'slug', 'description'])
    category.merge(data)
    await category.save()
    await category.related('products').sync(productIds)
    return response.json(category)
  }

  async destroy({ request, response }: HttpContext) {
    const category = await Category.findOrFail(request.param('id'))
    await category.delete()
    return response.status(204)
  }
}
