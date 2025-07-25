import type Customer from '#models/customer'
import Registry from '#models/registry'
import logger from '@adonisjs/core/services/logger'

export default class RemoveRegistry {
  async handle(data: { user: Customer }) {
    try {
      const registry = await Registry.findBy('email', data.user.email)
      registry?.delete()
    } catch (error) {
      logger.error(error)
    }
  }
}
