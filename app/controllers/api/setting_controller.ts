import Setting from '#models/setting'
import { HttpContext } from '@adonisjs/core/http'

export default class SettingController {
  async index({ response }: HttpContext) {
    return response.json({
      eshopGuestEnabled: await Setting.get('eshop_guest_enabled'),
    })
  }
}
