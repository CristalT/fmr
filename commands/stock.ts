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
      .on('end', async () => {
        try {
          // Collect all IDs from CSV
          const productIds = products.map((p: any) => p.id)

          // Update or create products
          this.logger.info('Updating products...')
          await Product.updateOrCreateMany('id', products)
          this.logger.info('Products updated')

          // Delete products not in CSV
          const deletedProducts = await Product.query().whereNotIn('id', productIds).delete()
          this.logger.info(`Deleted ${deletedProducts} products not in CSV`)

          // Update or create providers
          this.logger.info('Updating providers...')
          await Provider.updateOrCreateMany(
            'alias',
            Array.from(providerAliases).map(([alias, name]) => ({
              alias,
              name,
            }))
          )
          this.logger.info('Providers updated')

          // Update or create Categories
          this.logger.info('Updating categories...')
          await Category.updateOrCreateMany(
            'slug',
            Array.from(categories).map((name) => ({
              slug: name.toLowerCase().replace(/\s+/g, '-'),
              name,
            }))
          )
          this.logger.info('Categories updated')

          this.logger.info('Stock update process completed')
        } catch (error) {
          this.logger.error('Error during update process: ' + error.message)
        } finally {
          exit()
        }
      })
  }
}
