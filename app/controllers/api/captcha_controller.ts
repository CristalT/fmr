import { HttpContext } from '@adonisjs/core/http'
import config from '@adonisjs/core/services/config'

export default class CaptchaController {
  async index({ response }: HttpContext) {
    const challengeProvider = config.get('app.captcha.default')
    const { key } = config.get('app.captcha.providers.' + challengeProvider) as { key: string }

    return response.json({ key })
  }
}
