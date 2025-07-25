import { HttpContext } from '@adonisjs/core/http'
import { customerLoginValidator } from '#validators/login'
import Customer from '#models/customer'

export default class CustomerAuthController {
  async show({ inertia }: HttpContext) {
    return inertia.render('auth/customer_login')
  }

  async store({ inertia, request, auth, response }: HttpContext) {
    await request.validateUsing(customerLoginValidator)
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await Customer.verifyCredentials(email, password)

      await auth.use('customer').login(user)
      return response.redirect('/')
    } catch (error) {
      return inertia.render(
        'auth/customer_login',
        { errors: { message: error.message } },
        { status: 401 }
      )
    }
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('customer').logout()
    return response.noContent()
  }
}
