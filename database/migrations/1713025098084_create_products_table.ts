import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 25).unique().primary()
      table.string('code', 20)
      table.string('provider', 3)
      table.string('name', 140)
      table.float('price', 12, 3)
      table.integer('stock')
      table.tinyint('public', 1).defaultTo(1)
      table.string('brand')
      table.string('origin')
      table.string('details')
      table.string('image')
      table.string('shed', 8)
      table.string('box', 8)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
