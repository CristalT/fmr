import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Customer from '#models/customer'
import Order from '#models/order'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Administrator from './administrator.js'

export default class Receipt extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare customerId: number

  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>

  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>

  @column.date()
  declare paymentDate: DateTime

  @column()
  declare paymentMethods: string

  @column()
  declare amount: number

  @column()
  declare description: string | null

  @column()
  declare createdBy: number

  @belongsTo(() => Administrator, { foreignKey: 'createdBy' })
  declare author: BelongsTo<typeof Administrator>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
