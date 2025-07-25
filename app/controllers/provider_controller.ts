// import type { HttpContext } from '@adonisjs/core/http'

import Provider from '#models/provider'
import { updateProviderValidator } from '#validators/provider'
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
    return inertia.render('admin/providers/edit', { provider })
  }

  async update({ request, params, response }: HttpContext) {
    const provider = await Provider.findByOrFail({ alias: params.id })

    await request.validateUsing(updateProviderValidator)

    provider.fill(request.all())
    await provider.save()

    return response.redirect().toRoute('admin.providers.list')
  }
}
