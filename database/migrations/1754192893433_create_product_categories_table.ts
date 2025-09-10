import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('product_id').notNullable().references('id').inTable('products')
      table.integer('category_id').unsigned().notNullable().references('id').inTable('categories')
      table.index(['product_id', 'category_id'], 'product_category_index')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
