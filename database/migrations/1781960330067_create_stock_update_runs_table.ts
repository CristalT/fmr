import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stock_update_runs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('trigger', ['scheduled', 'manual']).notNullable()
      table.timestamp('started_at').notNullable()
      table.timestamp('finished_at').nullable()
      table.boolean('success').nullable()
      table.integer('created_count').unsigned().nullable()
      table.integer('updated_count').unsigned().nullable()
      table.integer('deleted_count').unsigned().nullable()
      table.text('error_message').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
