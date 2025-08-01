import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'receipts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('customer_id').unsigned().references('id').inTable('customers').notNullable()
      table.date('payment_date').notNullable()
      table.json('payment_methods').notNullable()
      table.float('amount', 12, 2).notNullable()
      table.string('description').nullable()
      table
        .integer('created_by')
        .unsigned()
        .references('id')
        .inTable('administrators')
        .notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
