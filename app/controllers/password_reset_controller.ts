import PasswordReset from '#events/password_reset'
import CustomerUser from '#models/customer_user'

import { passwordResetValidator } from '#validators/login'
import { HttpContext } from '@adonisjs/core/http'

export default class PasswordResetController {
  async view({ inertia }: HttpContext) {
    return inertia.render('auth/password_reset')
  }

  async reset({ request, response }: HttpContext) {
    const { token, email, password } = await request.validateUsing(passwordResetValidator)

    const user = await CustomerUser.query()
      .where('reset_password_token', token)
      .where('email', email)
      .firstOrFail()

    user.password = password

    user.generateResetPasswordToken()

    await user.save()

    PasswordReset.dispatch(user)

    return response.redirect('/auth/customers/show')
  }
}
