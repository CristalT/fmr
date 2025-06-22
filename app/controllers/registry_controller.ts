import Registry from '#models/registry'
import RecaptchaService from '#services/recaptcha_service'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class RegistryController {
  async index({ inertia }: HttpContext) {
    const registries = await Registry.query().paginate(1, 25)
    return inertia.render('registry/index', { registries })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('registry/create_user')
  }

  async store({ request, response }: HttpContext) {
    const data = request.except(['captchaToken'])

    const { captchaToken } = request.only(['captchaToken'])

    const recaptchaService = new RecaptchaService()
    const isValid = await recaptchaService.validateRecaptcha(captchaToken)

    if (!isValid) {
      return response.badRequest()
    }

    const registry = await Registry.findBy('dni', data.dni)

    if (registry) {
      return response.created()
    }

    try {
      await Registry.create(data)
      return response.created()
    } catch (error) {
      logger.error(error)
      return response.badRequest()
    }
  }

  async edit({ inertia, request }: HttpContext) {
    const registry = await Registry.findOrFail(request.param('id'))
    return inertia.render('registry/edit', { registry })
  }
}
