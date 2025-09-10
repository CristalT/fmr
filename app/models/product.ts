import { DateTime } from 'luxon'
import { afterFetch, afterFind, BaseModel, column, manyToMany, scope } from '@adonisjs/lucid/orm'
import setting from '#helpers/setting'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Showcase from '#models/showcase'
import Category from './category.js'

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
  declare description: string

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
  declare categoryId?: string

  @manyToMany(() => Category, {
    pivotTable: 'product_categories',
  })
  declare categories: ManyToMany<typeof Category>

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

  @afterFind()
  static async afterFindHook(product: Product) {
    const interval = Number(await setting('stock_round_interval', 0))

    if (interval > 0) {
      product.price = Math.round(product.price / interval) * interval
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
        'description',
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
   * Scope for eshop public search
   * This search criteria is used for listing products for Customer Users
   */
  static readonly eshopSearch = scope(
    (query, { search, hideZeroStock, hideZeroPrice, interval }) => {
      query.where(async (q) => {
        if (hideZeroStock) {
          q.where('stock', '>', 0)
        }

        if (hideZeroPrice) {
          q.where('price', '>=', interval)
        }

        q.where('public', 1)
      })

      if (search) {
        query.where((q) => {
          q.where('name', 'LIKE', `%${search.replaceAll(' ', '%')}%`)
          q.orWhere('code', 'LIKE', search)
        })
      }
    }
  )
}
