import AdminUser from '#models/admin_user'
import { adminLoginValidator } from '#validators/login'
import { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async loginView({ inertia }: HttpContext) {
    return inertia.render('auth/admin_login')
  }

  async login({ request, auth, response }: HttpContext) {
    await request.validateUsing(adminLoginValidator)
    const { email, password } = request.only(['email', 'password'])
    const user = await AdminUser.verifyCredentials(email, password)
    await auth.use('admin').login(user)
    response.redirect('/admin')
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('admin').logout()
    response.redirect('/auth/login')
  }
}
