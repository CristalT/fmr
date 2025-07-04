import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_showcase'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('product_id', 25).references('id').inTable('products')
      table.integer('showcase_id').unsigned().references('id').inTable('showcases')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
