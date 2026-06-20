// import type { HttpContext } from '@adonisjs/core/http'

import Provider from '#models/provider'
import Product from '#models/product'
import { updateProductsPublicationValidator, updateProviderValidator } from '#validators/provider'
import { HttpContext } from '@adonisjs/core/http'

export default class ProviderController {
  async list({ inertia }: HttpContext) {
    return inertia.render('admin/providers/list')
  }
  async index({ response, request }: HttpContext) {
    const page = request.input('page', 0)
    const size = request.input('size', 10)
    const terms = request.input('terms', '')

    const query = Provider.query().orderBy('alias', 'asc')

    if (terms) {
      query.where('alias', terms).orWhereILike('name', `%${terms}%`)
    }

    let data
    if (page) {
      data = await query.paginate(page, size)
    } else {
      data = await query.exec()
    }

    return response.json(data)
  }

  async edit({ inertia, params }: HttpContext) {
    const provider = await Provider.findByOrFail({ alias: params.id })

    const counts = await Product.query()
      .where('provider', provider.alias)
      .select('public')
      .count('* as total')
      .groupBy('public')

    const productCounts = {
      published: Number(counts.find((c) => c.public === 1)?.$extras.total ?? 0),
      unpublished: Number(counts.find((c) => c.public === 0)?.$extras.total ?? 0),
    }

    return inertia.render('admin/providers/edit', { provider, productCounts })
  }

  async update({ request, params, response }: HttpContext) {
    const provider = await Provider.findByOrFail({ alias: params.id })

    await request.validateUsing(updateProviderValidator)

    provider.fill(request.all())
    await provider.save()

    return response.redirect().toRoute('admin.providers.list')
  }

  async updateProductsPublication({ request, params, response }: HttpContext) {
    const provider = await Provider.findByOrFail({ alias: params.id })

    const data = await request.validateUsing(updateProductsPublicationValidator)

    const total = await Product.query()
      .where('provider', provider.alias)
      .update({ public: data.public ? 1 : 0 })

    return response.json({
      total: total[0] ?? 0,
      published: data.public ? total[0] ?? 0 : 0,
      unpublished: data.public ? 0 : total[0] ?? 0,
    })
  }
}
