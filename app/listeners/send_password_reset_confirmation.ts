import appUrl from '#helpers/app_url'
import type Customer from '#models/customer'
import logger from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'

export default class SendWelcomeEmail {
  handle(data: { user: Customer }) {
    const to = data.user.email
    const name = data.user.firstName
    const subject = 'Problema de seguridad con la contraseña de la cuenta.'
    const contactLink = `${appUrl()}/contact?subject=${encodeURI(subject)}`

    mail
      .sendLater((message) => {
        message
          .from('forclazmr.com <no-responder@forclazmr.com>')
          .to(to)
          .subject('Cambio de contraseña forclazmr.com')
          .htmlView('emails/customer_user_password_reset_confirmation', { name, contactLink })
      })
      .catch((error) => {
        logger.error('Error sending welcome email ' + error.message)
      })
      .finally(() => {
        logger.info('Welcome email sent to ' + to)
      })
  }
}
