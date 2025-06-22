import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare code: string

  @column()
  declare provider: string

  @column()
  declare name: string

  @column()
  declare fob: number

  @column()
  declare price: number

  @computed()
  get roundedPrice(): number {
    return Math.round(this.price / 100) * 100
  }

  @column()
  declare stock: number

  @column()
  declare location: string

  @column()
  declare public?: 0 | 1

  @column()
  declare brand?: string

  @column()
  declare category?: string

  @column()
  declare subcategory?: string

  @column()
  declare origin?: string

  @column()
  declare details?: string

  @column()
  declare image?: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
