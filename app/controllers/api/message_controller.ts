import RecaptchaService from '#services/recaptcha_service'
import { HttpContext } from '@adonisjs/core/http'
import Message from '#models/message'

export default class ContactController {
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
}
