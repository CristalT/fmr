import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Product from '#models/product'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Showcase extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @manyToMany(() => Product, {
    pivotTable: 'product_showcase'
  })
  declare products: ManyToMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
