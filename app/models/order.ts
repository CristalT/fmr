import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import CartItem from './cart_item.js'
import Customer from './customer.js'
import { OrderStatus } from '#types/order_status'
import cache from '@adonisjs/cache/services/main'
import Receipt from './receipt.js'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'customer_user_id' })
  declare customerId: number

  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>

  @hasMany(() => CartItem)
  declare cartItems: HasMany<typeof CartItem>

  @column()
  declare status: OrderStatus

  @column()
  declare receiptId: number | null

  @belongsTo(() => Receipt)
  declare receipt: BelongsTo<typeof Receipt>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static readonly getPendingOrders = scope((query) => {
    query.where('status', OrderStatus.Pending)
  })

  static readonly byId = (id: number | string) => {
    const factory = () =>
      this.query()
        .preload('cartItems', (query) => query.preload('product'))
        .preload('customer')
        .where('id', id)
        .firstOrFail()

    return cache.getOrSet({
      key: `order:${id}`,
      ttl: '1 hour',
      factory,
    })
  }

  static readonly byIds = (ids: Array<number>) => {
    return this.query()
      .whereIn('id', ids)
      .preload('cartItems', (builder) => builder.preload('product'))
  }
}
