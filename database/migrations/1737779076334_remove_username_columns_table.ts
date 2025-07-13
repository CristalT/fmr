import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customer_users'

  async up() {
    if (await this.schema.hasColumn(this.tableName, 'username')) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('username')
      })
    }
  }
}
