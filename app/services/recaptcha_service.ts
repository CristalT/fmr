import config from '@adonisjs/core/services/config'
import logger from '@adonisjs/core/services/logger'
import axios from 'axios'

export default class RecaptchaService {
  async validateRecaptcha(recaptchaToken: string) {
    const params = {
      secret: config.get('app.captcha.providers.recaptcha.secret'),
      response: recaptchaToken,
    }

    const { data, status } = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      {},
      {
        params,
      }
    )

    if (status !== 200) {
      return false
    }

    if (!data.success) {
      logger.error('Invalid recaptcha: %o', data)
    }

    return data.success
  }
}
