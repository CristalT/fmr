import UserCreated from '#events/user_created'
import CustomerUser from '#models/customer_user'
import { createCustomerValidator, updateCustomerValidator } from '#validators/customer'
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

    return await query.orderBy('firstName', 'asc').paginate(page, limit)
  }

  async edit({ inertia, params }: HttpContext) {
    const user = await CustomerUser.findOrFail(params.id)
    return inertia.render('admin/customers/edit', { user })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('admin/customers/create')
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createCustomerValidator)

    const user = new CustomerUser()

    const resetPasswordToken = string.generateRandom(64)
    const resetPasswordTokenExpirationDate = DateTime.now().plus({ days: 1 }).toString()

    try {
      Object.assign(user, { ...data, resetPasswordToken, resetPasswordTokenExpirationDate })
      await user.save()
      UserCreated.dispatch(user)
      return response.redirect('/admin/customers/view')
    } catch (error) {
      logger.error(error)
      return response.badRequest()
    }
  }

  async update({ request, response, params }: HttpContext) {
    const data = await request.validateUsing(updateCustomerValidator, {
      meta: { customerId: params.id },
    })

    const user = await CustomerUser.findOrFail(params.id)

    Object.assign(user, data)
    await user.save()
    return response.redirect().toRoute('admin.customers.view')
  }

  async destroy({ response, params }: HttpContext) {
    const user = await CustomerUser.findOrFail(params.id)
    user.deletedAt = DateTime.now()
    await user.save()
    return response.noContent()
  }
}
