import PasswordForgot from '#events/password_forgot'
import CustomerUser from '#models/customer_user'
import { forgotPasswordValidator } from '#validators/login'
import { HttpContext } from '@adonisjs/core/http'

export default class PasswordRecoveryController {
  async index({ inertia }: HttpContext) {
    return inertia.render('auth/password_recovery')
  }

  async success({ inertia }: HttpContext) {
    return inertia.render('auth/password_recovery_success')
  }

  async store({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPasswordValidator)

    const user = await CustomerUser.query().where('email', email).firstOrFail()

    user.generateResetPasswordToken()

    await user.save()

    PasswordForgot.dispatch(user)

    response.redirect().toRoute('password_recovery.success')
  }
}
