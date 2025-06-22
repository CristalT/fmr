import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cart_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('customer_user_id').unsigned().references('id').inTable('customer_users')
      table.integer('order_id').unsigned().references('id').inTable('orders')
      table.string('product_id', 25).references('id').inTable('products')
      table.string('code').notNullable()
      table.integer('quantity').notNullable()
      table.string('name').notNullable()
      table.tinyint('status', 1).notNullable().defaultTo(0) // 0 = pending, 1 = processing, 2 = delivered
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
