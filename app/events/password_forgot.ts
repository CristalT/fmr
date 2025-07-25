import Customer from '#models/customer'
import { BaseEvent } from '@adonisjs/core/events'

export default class PasswordForgot extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(public user: Customer) {
    super()
  }
}
