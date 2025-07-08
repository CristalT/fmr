import Showcase from "#models/showcase"
import { createShowcaseValidator, updateShowcaseValidator } from "#validators/showcase"
import { HttpContext } from "@adonisjs/core/http"

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
    const showcases = await Showcase.query().preload('products', async (query) => {
      const fields = ['id', 'name', 'code']
      if (isCustomerLoggedIn) {
        fields.push('price')
      }
      query.select(fields)
    })
    return response.send(showcases)
  }

  async store({ request, response }: HttpContext) {
    const { name, description, products } = await request.validateUsing(createShowcaseValidator)
    const showcase = await Showcase.create({ name, description })
    await showcase.related('products').attach(products)
    return response.redirect().toRoute('admin.showcases.list')
  }

  async update({ request, response, params }: HttpContext) {
    const { name, description, products } = await request.validateUsing(updateShowcaseValidator);
    const showcase = await Showcase.findOrFail(params.id)
    showcase.name = name
    showcase.description = description
    await showcase.save()
    await showcase.related('products').sync(products)
    return response.redirect().toRoute('admin.showcases.list')
  }

  async destroy({ params, response }: HttpContext) {
    const showcase = await Showcase.findOrFail(params.id)
    await showcase.related('products').detach()
    await showcase.delete()
    return response.redirect().toRoute('admin.showcases.list')
  }
}
