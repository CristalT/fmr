import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'showcases'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('order').defaultTo(0).unsigned().after('id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('order')
    })
  }
}
