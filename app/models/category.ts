import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Product from './product.js'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare parentId: number | null

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string

  @manyToMany(() => Product, {
    pivotTable: 'product_categories',
  })
  declare products: ManyToMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
