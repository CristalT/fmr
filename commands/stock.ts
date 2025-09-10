import env from '#start/env'
import { BaseCommand } from '@adonisjs/core/ace'
import { createReadStream } from 'node:fs'
import parser from 'csv-parser'
import Product from '#models/product'
import { CommandOptions } from '@adonisjs/core/types/ace'
import { exit } from 'node:process'
import { Transform } from 'node:stream'
import Provider from '#models/provider'
import { truncate } from 'lodash-es'
import Category from '#models/category'

/**
 * Creates a transform stream that removes double quotes from the data
 */
function replaceStreamContent() {
  return new Transform({
    transform(chunk, _, callback) {
      // Convert buffer to string, replace double quotes, and convert back to buffer
      const modifiedChunk = Buffer.from(chunk.toString().replace(/"/g, ''))
      callback(null, modifiedChunk)
    },
  })
}

export default class StockCommand extends BaseCommand {
  static readonly commandName = 'stock:update'
  static readonly description = 'Update stock'

  static readonly options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const products: any = []
    const providerAliases = new Map<string, string>()
    const categories = new Set<string>()
    const subcategories = new Map<string, string>()
    const source = env.get('STOCK_LIST_UTF8')
    if (!source) throw new Error('STOCK_LIST_UTF8 is not defined')
    this.logger.info('Updating stock...')
    createReadStream(source)
      .pipe(replaceStreamContent())
      .pipe(
        parser({
          separator: ';',
          headers: [
            'code',
            'providerAlias',
            'providerName',
            'name',
            'fob',
            'price',
            'stock',
            'location',
            'brandCode',
            'brandName',
            'subcategoryCode',
            'subcategoryName',
            'categoryCode',
            'categoryName',
            'originCode',
            'originName',
            'factoryCode',
          ],
        })
      )
      .on('error', (error) => {
        this.logger.error('Error reading file. ' + error.message)
      })
      .on('data', (row) => {
        products.push({
          id: `${row.code}${row.providerAlias}`,
          code: row.code,
          provider: row.providerAlias,
          location: row.location,
          name: row.name,
          fob: Number(row.fob?.replace(',', '.') ?? 0),
          price: Number(row.price?.replace(',', '.') ?? 0),
          stock: Number.parseInt(row.stock, 10),
          brand: row.brandName,
          origin: row.originName,
          factoryCode: truncate(row.factoryCode, { length: 20 }),
        })
        categories.add(row.categoryName)
        subcategories.set(row.subcategoryName, row.categoryName)
        providerAliases.set(row.providerAlias, row.providerName)
      })
      .on('end', () => {
        const promises = []

        // Update or create products
        promises.push(
          Product.updateOrCreateMany('id', products)
            .then(() => {
              this.logger.info('Stock updated')
            })
            .catch((error) => {
              this.logger.error('Error updating stock ' + error.message)
            })
        )

        // Update or create providers
        promises.push(
          Provider.updateOrCreateMany(
            'alias',
            Array.from(providerAliases).map(([alias, name]) => ({
              alias,
              name,
            }))
          )
            .then(() => {
              this.logger.info('Providers updated')
            })
            .catch((error) => {
              this.logger.error('Error updating providers', error.message)
            })
        )

        // Update or create Categories
        promises.push(
          Category.updateOrCreateMany(
            'slug',
            Array.from(categories).map((name) => ({
              slug: name.toLowerCase().replace(/\s+/g, '-'),
              name,
            }))
          )
            .then(() => {
              this.logger.info('Categories updated')
            })
            .catch((error) => {
              this.logger.error('Error updating categories', error.message)
            })
        )

        Promise.all(promises).finally(() => {
          this.logger.info('Stock update process completed')
          exit()
        })
      })
  }
}
