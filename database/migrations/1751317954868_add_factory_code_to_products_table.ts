import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('factory_code', 20).nullable()
      table.index('factory_code')
    })
  }

  async down() {
    if (await this.schema.hasColumn(this.tableName, 'factory_code')) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropIndex('factory_code')
        table.dropColumn('factory_code')
      })
    }
  }
}
