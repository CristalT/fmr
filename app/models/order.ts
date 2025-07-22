import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import CartItem from './cart_item.js'
import CustomerUser from './customer_user.js'
import { OrderStatus } from '#types/order_status'
import cache from '@adonisjs/cache/services/main'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare customerUserId: number

  @belongsTo(() => CustomerUser)
  declare customerUser: BelongsTo<typeof CustomerUser>

  @hasMany(() => CartItem)
  declare cartItems: HasMany<typeof CartItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare status: OrderStatus

  static readonly getPendingOrders = scope((query) => {
    query.where('status', OrderStatus.Pending)
  })

  static readonly byId = (id: number | string) => {
    const factory = () =>
      this.query()
        .preload('cartItems', (query) => query.preload('product'))
        .preload('customerUser')
        .where('id', id)
        .firstOrFail()

    return cache.getOrSet({
      key: `order:${id}`,
      ttl: '1 hour',
      factory,
    })
  }
}
