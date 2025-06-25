import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.alterTable(this.tableName, async (table) => {
      table
        .enum('status', ['pending', 'processing', 'completed', 'delivered', 'cancelled'])
        .defaultTo('pending')
        .alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
        .defaultTo('pending')
        .alter()
    })
  }
}
