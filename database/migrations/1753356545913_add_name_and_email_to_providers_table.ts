import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'providers'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('name').after('alias').nullable()
      table.string('email', 50).after('name').nullable().unique()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('alias')
    })
  }
}
