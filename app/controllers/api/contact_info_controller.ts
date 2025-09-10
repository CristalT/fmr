import Setting from '#models/setting'
import { HttpContext } from '@adonisjs/core/http'

export default class ContactInfoController {
  async index({ response }: HttpContext) {
    const settings = await Setting.all()

    const contactInfo = settings.filter((item) => item.key.startsWith('company_'))

    return response.json(contactInfo)
  }
}
