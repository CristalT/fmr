import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'delivery_infos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE')

      table.string('email').notNullable()

      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('address').notNullable()
      table.string('address_2').nullable()
      table.string('city').notNullable()
      table.string('province').notNullable()
      table.string('postal_code').notNullable()
      table.string('phone').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // create order_id index
    this.schema.alterTable(this.tableName, (table) => {
      table.index('order_id')
    })
  }

  async down() {
    // remove order_id index
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex('order_id')
    })

    this.schema.dropTable(this.tableName)
  }
}
