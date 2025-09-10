import Registry from '#models/registry'
import RecaptchaService from '#services/recaptcha_service'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class RegistryController {
  async index({ request, inertia }: HttpContext) {
    const terms = request.input('terms', '').replace(' ', '%')
    const page = request.input('page', 1)
    const registries = await Registry.query()
      .where('firstName', 'like', `%${terms}%`)
      .orWhere('lastName', 'like', `%${terms}%`)
      .orWhere('dni', terms)
      .paginate(page, 25)
    return inertia.render('registry/index', { registries })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('registry/ask')
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

  async destroy({ request, response }: HttpContext) {
    const registry = await Registry.findOrFail(request.param('id'))

    try {
      await registry.delete()
      return response.redirect().toRoute('admin.registries.index')
    } catch (error) {
      logger.error(error)
      return response.badRequest()
    }
  }
}
