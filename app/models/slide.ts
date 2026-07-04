import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Slide extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare order: number

  @column()
  declare title: string

  @column()
  declare tagline: string

  @column()
  declare ctaText: string

  @column()
  declare ctaHref: string

  @column()
  declare badge: string | null

  @column()
  declare theme: 'primary' | 'secondary'

  @column()
  declare backgroundImage: string | null

  @column()
  declare productImage: string | null

  @column()
  declare public: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
