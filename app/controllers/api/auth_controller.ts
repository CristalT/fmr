import PasswordForgot from '#events/password_forgot'
import PasswordReset from '#events/password_reset'
import Customer from '#models/customer'
import CustomerResource from '#resources/customer_resource'
import {
  customerLoginValidator,
  customerProfileValidator,
  customerSignupValidator,
  forgotPasswordValidator,
  passwordResetValidator,
} from '#validators/login'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async me({ request, response, auth }: HttpContext) {
    const token = request.header('authorization')
    if (!token) {
      return response.status(401).json({ message: 'Missing authorization token' })
    }

    const user = auth.use('api').getUserOrFail()

    if (!user) {
      return response.status(401).json({ message: 'Invalid authorization token' })
    }

    return response.json(new CustomerResource(user))
  }

  async signup({ request, response }: HttpContext) {
    await request.validateUsing(customerSignupValidator)
    const { firstName, lastName, email, password } = request.all()

    const user = await Customer.create({
      firstName,
      lastName,
      email,
      password,
    })

    return response.json(new CustomerResource(user))
  }

  async login({ request, response }: HttpContext) {
    await request.validateUsing(customerLoginValidator)
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await Customer.verifyCredentials(email, password)
      const token = await Customer.accessTokens.create(user)

      return response.json({ token, user })
    } catch (error) {
      return response.status(401).json({ message: error.message })
    }
  }

  async logout({ auth, response }: HttpContext) {
    auth.use('api').invalidateToken()
    return response.json({ message: 'Logged out successfully' })
  }

  async refresh({ auth, response }: HttpContext) {
    const user = auth.use('api').getUserOrFail()
    if (!user) {
      return response.status(401).json({ message: 'Invalid authorization token' })
    }
    const token = await Customer.accessTokens.create(user)
    return token
  }

  async updateProfile({ request, response, auth }: HttpContext) {
    const user = auth.use('api').getUserOrFail()

    if (!user) {
      return response.status(401).json({ message: 'Invalid authorization token' })
    }

    const data = await request.validateUsing(customerProfileValidator)

    user.merge(data)
    await user.save()

    return response.json(new CustomerResource(user))
  }

  async forgotPassword({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPasswordValidator)

    const user = await Customer.query().where('email', email).firstOrFail()

    user.generateResetPasswordToken()

    await user.save()

    PasswordForgot.dispatch(user)

    return response.json({ message: 'Password reset link sent to your email.' })
  }

  async passwordReset({ request, response }: HttpContext) {
    const { token, email, password } = await request.validateUsing(passwordResetValidator)

    const user = await Customer.query()
      .where('reset_password_token', token)
      .where('email', email)
      .firstOrFail()

    user.password = password

    user.generateResetPasswordToken()

    await user.save()

    PasswordReset.dispatch(user)

    return response.json(new CustomerResource(user))
  }
}
