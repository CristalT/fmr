import UserCreated from '#events/user_created'
import CustomerUser from '#models/customer_user'
import { createCustomerValidator } from '#validators/customer'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import string from '@adonisjs/core/helpers/string'

import { DateTime } from 'luxon'

export default class CustomerController {
  async view({ inertia }: HttpContext) {
    return inertia.render('admin/customers/index')
  }

  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 12)
    const terms = request.input('terms', null)

    const query = CustomerUser.query().select(['id', 'firstName', 'lastName', 'phone', 'email'])

    if (terms) {
      query.where('firstName', 'LIKE', `%${terms.replaceAll(' ', '%')}%`)
      query.orWhere('lastName', 'LIKE', `%${terms.replaceAll(' ', '%')}%`)
    }

    return await query.paginate(page, limit)
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('admin/customers/create')
  }

  async store({ request, response }: HttpContext) {
    await request.validateUsing(createCustomerValidator)

    const data = request.except(['id', 'createdAt', 'updatedAt'])

    const user = new CustomerUser()

    const resetPasswordToken = string.generateRandom(64)
    const resetPasswordTokenExpirationDate = DateTime.now().plus({ days: 1 }).toString()

    try {
      user.fill({ ...data, resetPasswordToken, resetPasswordTokenExpirationDate })
      await user.save()
      UserCreated.dispatch(user)
      return response.redirect('/admin/customers/view')
    } catch (error) {
      logger.error(error)
      return response.badRequest()
    }
  }
}
