import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'registries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('dni').notNullable().unique()
      table.string('email').notNullable()
      table.string('phone').notNullable()
      table.string('address').notNullable()
      table.string('postal_code', 10)
      table.string('city').notNullable()
      table.string('province').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
