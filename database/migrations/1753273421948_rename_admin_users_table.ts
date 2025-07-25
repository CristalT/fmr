import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected oldTableName = 'admin_users'
  protected newTableName = 'administrators'

  async up() {
    this.schema.renameTable(this.oldTableName, this.newTableName)
  }

  async down() {
    this.schema.renameTable(this.newTableName, this.oldTableName)
  }
}
