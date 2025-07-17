import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cart_items'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enum('status', ['in_cart', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'])
        .notNullable()
        .defaultTo('in_cart')
        .alter()

      table.dropColumn('code')
      table.dropColumn('name')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.tinyint('status', 1).notNullable().defaultTo(0).alter() // 0 = pending, 1 = processing, 2 = delivered
      table.string('code').notNullable()
      table.string('name').notNullable()
    })
  }
}
