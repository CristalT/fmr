import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected oldTableName = 'users'
  protected newTableName = 'admin_users'

  async up() {
    this.schema.renameTable(this.oldTableName, this.newTableName)
    this.schema.alterTable(this.newTableName, (table) => {
      table.dropColumn('admin')
    })
  }

  async down() {
    this.schema.renameTable(this.newTableName, this.oldTableName)
    this.schema.alterTable(this.oldTableName, (table) => {
      table.boolean('admin').notNullable().defaultTo(false)
    })
  }
}
