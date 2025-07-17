import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, scope } from '@adonisjs/lucid/orm'
import Product from '#models/product'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import CustomerUser from './customer_user.js'
import Order from './order.js'
import { HttpContext } from '@adonisjs/core/http'
import { OrderStatus } from '#types/order_status'

export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare customerUserId: number

  @belongsTo(() => CustomerUser)
  declare customerUser: BelongsTo<typeof CustomerUser>

  @column()
  declare productId: string

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  // @column()
  // declare code: string

  @column()
  declare quantity: number

  @column()
  declare delivered: number

  @column()
  declare status: OrderStatus

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @column()
  declare orderId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static readonly getCustomerUser = () => {
    const ctx = HttpContext.getOrFail()
    const user = ctx.auth.user as CustomerUser
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  static readonly getItemsByStatus = scope((query, status: OrderStatus) => {
    const user = this.getCustomerUser()

    query
      .where('customerUserId', user.id)
      .where('status', status)
      .select('id', 'delivered', 'orderId', 'quantity', 'status', 'productId')
  })
}
