import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, scope } from '@adonisjs/lucid/orm'
import Product from '#models/product'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Customer from './customer.js'
import Order from './order.js'
import { HttpContext } from '@adonisjs/core/http'
import { OrderStatus } from '#types/order_status'

export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'customer_user_id' })
  declare customerId: number

  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>

  @column()
  declare productId: string

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

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

  static readonly customer = () => {
    const ctx = HttpContext.getOrFail()
    const user = ctx.auth.user as Customer
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  static readonly getItemsByStatus = scope((query, status: OrderStatus) => {
    const user = this.customer()

    query
      .where('customerId', user.id)
      .where('status', status)
      .select('id', 'delivered', 'orderId', 'quantity', 'status', 'productId')
  })
}
