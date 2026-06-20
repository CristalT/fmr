import Showcase from '#models/showcase'
import { createShowcaseValidator, updateShowcaseValidator } from '#validators/showcase'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ShowcaseController {
  async create({ inertia }: HttpContext) {
    return inertia.render('admin/showcases/create')
  }

  async list({ inertia }: HttpContext) {
    return inertia.render('admin/showcases/index')
  }

  async edit({ inertia, params }: HttpContext) {
    const showcase = await Showcase.query().where('id', params.id).preload('products').firstOrFail()
    return inertia.render('admin/showcases/edit', { showcase })
  }

  async index({ response, auth }: HttpContext) {
    const isCustomerLoggedIn = await auth.use('customer').check()
    const showcases = await Showcase.query()
      .preload('products', async (query) => {
        const fields = ['id', 'name', 'code', 'image']
        if (isCustomerLoggedIn) {
          fields.push('price')
        }
        query.select(fields)
      })
      .orderBy('order', 'asc')
    return response.send(showcases)
  }

  async store({ request, response }: HttpContext) {
    const { name, description, products } = await request.validateUsing(createShowcaseValidator)
    const showcase = await Showcase.create({ name, description })
    await showcase.related('products').attach(products)
    return response.redirect().toRoute('admin.showcases.list')
  }

  async update({ request, response, params }: HttpContext) {
    const { products, ...data } = await request.validateUsing(updateShowcaseValidator)
    const showcase = await Showcase.findOrFail(params.id)
    showcase.merge(data)
    await showcase.save()
    await showcase.related('products').sync(products)
    return response.redirect().toRoute('admin.showcases.list')
  }

  async order({ request, response }: HttpContext) {
    const { showcasesOrder } = request.all()

    const trx = await db.transaction()
    for (const order of showcasesOrder) {
      // Update the order of each showcase
      await Showcase.query({ client: trx }).where('id', order.id).update({ order: order.order })
    }

    await trx.commit()

    const newOrder = await Showcase.query().orderBy('order', 'asc')
    return response.json(newOrder)
  }

  async destroy({ params, response }: HttpContext) {
    const showcase = await Showcase.findOrFail(params.id)
    await showcase.related('products').detach()
    await showcase.delete()
    return response.redirect().toRoute('admin.showcases.list')
  }
}
