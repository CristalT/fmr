import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'slides'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('order').unsigned().notNullable().defaultTo(0)
      table.string('title', 160).notNullable()
      table.string('tagline', 255).notNullable()
      table.string('cta_text', 100).notNullable()
      table.string('cta_href', 255).notNullable()
      table.string('badge', 100).nullable()
      table.string('theme', 20).notNullable().defaultTo('primary')
      table.string('background_image', 160).nullable()
      table.string('product_image', 160).nullable()
      table.boolean('public').notNullable().defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
