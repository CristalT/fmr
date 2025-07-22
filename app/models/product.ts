import { DateTime } from 'luxon'
import { afterFetch, BaseModel, column, manyToMany, scope } from '@adonisjs/lucid/orm'
import setting from '#helpers/setting'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Showcase from '#models/showcase'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare code: string

  @column()
  declare factoryCode: string | null

  @column()
  declare provider: string

  @column()
  declare name: string

  @column()
  declare fob: number

  @column()
  declare price: number

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

  @manyToMany(() => Showcase, {
    pivotTable: 'product_showcase',
  })
  declare showcases: ManyToMany<typeof Showcase>

  @afterFetch()
  static async afterFetchHook(products: Product[]) {
    const interval = Number(await setting('stock_round_interval', 0))

    if (interval > 0) {
      products.forEach((product) => {
        product.price = Math.round(product.price / interval) * interval
      })
    }
  }

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
        'factoryCode',
      ])
      .where('id', id)
  })

  /**
   * Scope for search
   * This search criteria is used for listing products for Admin Users
   */
  static readonly search = scope((query, { terms, filter, onlyPublic }) => {
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value) query.where(key, String(value))
      }
    }

    if (onlyPublic === 'true') {
      query.where('public', 1)
    }

    if (terms) {
      query.where('name', 'LIKE', `%${terms.replaceAll(' ', '%')}%`)
      query.orWhere('code', 'LIKE', terms)
      query.orWhere('factoryCode', 'LIKE', terms)
    }
  })

  /**
   * Scope for public search
   * This search criteria is used for listing products for Customer Users
   */
  static readonly publicSearch = scope(
    (query, { terms, hideZeroStock, hideZeroPrice, interval }) => {
      query.where(async (q) => {
        if (hideZeroStock) {
          q.where('stock', '>', 0)
        }

        if (hideZeroPrice) {
          q.where('price', '>=', interval)
        }

        q.where('public', 1)
      })

      if (terms) {
        query.where((q) => {
          q.where('name', 'LIKE', `%${terms.replaceAll(' ', '%')}%`)
          q.orWhere('code', 'LIKE', terms)
        })
      }
    }
  )
}
