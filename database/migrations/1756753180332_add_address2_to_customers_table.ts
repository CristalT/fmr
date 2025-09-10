import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customers'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('address_2').after('address').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('address_2')
    })
  }
}
