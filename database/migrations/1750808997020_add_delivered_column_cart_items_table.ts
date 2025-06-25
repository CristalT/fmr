import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cart_items'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('delivered').defaultTo(0).after('quantity')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('delivered')
    })
  }
}
