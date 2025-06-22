import CustomerUser from '#models/customer_user'
import appUrl from '#helpers/app_url'
import logger from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'

export default class SendWelcomeEmail {
  handle(data: { user: CustomerUser }) {
    const to = data.user.email
    const name = data.user.firstName
    const token = data.user.resetPasswordToken
    const passwordResetUrl = `${appUrl()}/auth/password-reset?token=${token}`

    mail
      .sendLater((message) => {
        message
          .from('forclazmr.com <no-responder@forclazmr.com>')
          .to(to)
          .subject('Bienvenido a forclazmr.com')
          .htmlView('emails/customer_user_welcome', { name, passwordResetUrl, to })
      })
      .catch((error) => {
        logger.error('Error sending welcome email ' + error.message)
      })
      .finally(() => {
        logger.info('Welcome email sent to ' + to)
      })
  }
}
