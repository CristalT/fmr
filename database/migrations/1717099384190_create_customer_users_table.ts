import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customer_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('phone', 20)
      table.string('email', 254).notNullable().unique()
      table.string('password').nullable()
      table.string('dni', 11).unique()
      table.string('address', 100)
      table.string('city', 100)
      table.string('province', 100)
      table.string('postal_code', 10)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
