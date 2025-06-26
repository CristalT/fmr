import { DateTime } from 'luxon'
import { BaseModel, column, computed, scope } from '@adonisjs/lucid/orm'

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

  static readonly getForEdit = scope((query, id: string) => {
    return query
      .select([
        'id',
        'code',
        'provider',
        'public',
        'name',
        'price',
        'fob',
        'image',
        'stock',
        'location',
      ])
      .where('id', id)
  })

  static readonly search = scope((query, { terms, filter }) => {
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value) query.where(key, '=', String(value))
      }
    }

    if (terms) {
      query.where('name', 'LIKE', `%${terms.replaceAll(' ', '%')}%`)
      query.orWhere('code', 'LIKE', terms)
    }
  })

  static readonly publicSearch = scope((query, { terms }) => {
    query.where((query) => {
      query.where('stock', '>', 0)
      query.where('public', 1)
      query.where('price', '>=', 100)
    })

    if (terms) {
      query.where((query) => {
        query.where('name', 'LIKE', `%${terms.replaceAll(' ', '%')}%`)
        query.orWhere('code', 'LIKE', terms)
      })
    }
  })
}
