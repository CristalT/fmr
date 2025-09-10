import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'favorites'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('customer_id').unsigned().references('id').inTable('customers')
      table.string('product_id', 25).references('id').inTable('products')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // create product id index
    this.schema.table(this.tableName, (table) => {
      table.index('product_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)

    // drop index
    this.schema.table(this.tableName, (table) => {
      table.dropIndex('product_id')
    })
  }
}
