// import type { HttpContext } from '@adonisjs/core/http'

import Provider from '#models/provider'
import { HttpContext } from '@adonisjs/core/http'

export default class ProviderController {
  async index({ response }: HttpContext) {
    const results = await Provider.query().orderBy('alias')

    return response.json(results)
  }
}
