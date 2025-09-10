import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Product from '#models/product'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Customer from './customer.js'

export default class Favorite extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'customer_id' })
  declare customerId: number

  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>

  @column()
  declare productId: string

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
