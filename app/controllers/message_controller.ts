import Message from '#models/message'
import Product from '#models/product'
import RecaptchaService from '#services/recaptcha_service'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class MessageController {
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 12)
    const terms = request.input('terms', '')

    const messages = await Message.query()
      .select('id', 'name', 'from', 'read', 'created_at')
      .where('name', 'LIKE', `%${terms.replaceAll(' ', '%')}%`)
      .orWhere('from', 'LIKE', `%${terms.replaceAll(' ', '%')}%`)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return inertia.render('admin/messages/index', { messages })
  }

  async create({ inertia, params }: HttpContext) {
    const { productId } = params

    const product = productId
      ? await Product.query().where('id', productId).select(['id', 'name', 'code']).firstOrFail()
      : null

    return inertia.render('contact/index', { product })
  }

  async store({ request, response }: HttpContext) {
    const { name, email, phone, message, subject, recaptchaToken } = request.all()

    const recaptchaService = new RecaptchaService()
    const isValid = await recaptchaService.validateRecaptcha(recaptchaToken)

    if (!isValid) {
      return response.status(400).send({ success: false })
    }

    const data = {
      name,
      from: `${email} | ${phone}`,
      subject,
      content: message,
    }

    try {
      Message.create(data)
      return response.status(201).send({ success: true })
    } catch (error) {
      return response.status(500).send({ success: false })
    }
  }

  async show({ inertia, request, response }: HttpContext) {
    try {
      const message = await Message.query().where('id', request.param('id')).firstOrFail()

      if (!message.read) {
        await Message.query().where('id', message.id).update({ read: true })
      }

      return inertia.render('admin/messages/show', { message })
    } catch (error) {
      logger.error(error)
      return response.redirect().toRoute('/admin/messages')
    }
  }

  async destroy({ request, response }: HttpContext) {
    const message = await Message.query().where('id', request.param('id')).firstOrFail()
    await message.delete()
    return response.redirect().toRoute('/admin/messages')
  }
}
