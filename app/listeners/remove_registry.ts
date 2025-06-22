import CustomerUser from '#models/customer_user'
import Registry from '#models/registry'
import logger from '@adonisjs/core/services/logger'

export default class RemoveRegistry {
  async handle(data: { user: CustomerUser }) {
    try {
      const registry = await Registry.findBy('email', data.user.email)
      registry?.delete()
    } catch (error) {
      logger.error(error)
    }
  }
}
