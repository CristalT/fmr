import env from '#start/env'
import { createReadStream } from 'node:fs'
import parser from 'csv-parser'
import Product from '#models/product'
import Provider from '#models/provider'
import Category from '#models/category'
import StockUpdateRun, { StockUpdateTrigger } from '#models/stock_update_run'
import { truncate } from 'lodash-es'
import { Transform } from 'node:stream'
import { DateTime } from 'luxon'

export type StockUpdateProgress = { type: 'info' | 'error'; text: string }

type Options = {
  trigger: StockUpdateTrigger
  onProgress?: (progress: StockUpdateProgress) => void
}

/**
 * Removes double quotes from the CSV stream content
 */
function replaceStreamContent() {
  return new Transform({
    transform(chunk, _, callback) {
      const modifiedChunk = Buffer.from(chunk.toString().replace(/"/g, ''))
      callback(null, modifiedChunk)
    },
  })
}

export async function runStockUpdate({ trigger, onProgress }: Options) {
  const info = (text: string) => onProgress?.({ type: 'info', text })
  const error = (text: string) => onProgress?.({ type: 'error', text })

  const run = await StockUpdateRun.create({
    trigger,
    startedAt: DateTime.now(),
  })

  const products: any = []
  const providerAliases = new Map<string, string>()
  const categories = new Set<string>()
  const source = env.get('STOCK_LIST_UTF8')

  try {
    if (!source) throw new Error('STOCK_LIST_UTF8 is not defined')
    info('Actualizando stock...')

    await new Promise<void>((resolve, reject) => {
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
        .on('error', (err) => {
          error('Error al leer el archivo de origen. ' + err.message)
          reject(err)
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
          providerAliases.set(row.providerAlias, row.providerName)
        })
        .on('end', () => resolve())
    })

    // Collect all IDs from CSV
    const productIds = products.map((p: any) => p.id)

    // Figure out which products are new vs existing, before upserting
    const existingProducts = await Product.query().whereIn('id', productIds).select('id')
    const existingIds = new Set(existingProducts.map((p) => p.id))
    const createdCount = productIds.filter((id: string) => !existingIds.has(id)).length
    const updatedCount = productIds.length - createdCount

    // Update or create products
    info('Actualizando artículos...')
    await Product.updateOrCreateMany('id', products)
    info('Artículos actualizados correctamente.')

    // Delete products not in CSV
    const deleteResult = await Product.query().whereNotIn('id', productIds).delete()
    const deletedCount = Array.isArray(deleteResult)
      ? Number(deleteResult[0] ?? 0)
      : Number(deleteResult)
    info(`${deletedCount} artículo(s) eliminados que no están presentes en el archivo de origen.`)

    // Update or create providers
    info('Actualizando proveedores ...')
    await Provider.updateOrCreateMany(
      'alias',
      Array.from(providerAliases).map(([alias, name]) => ({
        alias,
        name,
      }))
    )
    info('Proveedores actualizados correctamente.')

    // Update or create categories
    info('Actualizando categorías ...')
    await Category.updateOrCreateMany(
      'slug',
      Array.from(categories).map((name) => ({
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        name,
      }))
    )
    info('Categorías actualizadas correctamente.')

    info('El proceso de actualización de stock ha sido completado.')

    run.merge({
      finishedAt: DateTime.now(),
      success: true,
      createdCount,
      updatedCount,
      deletedCount,
    })
    await run.save()

    return run
  } catch (err: any) {
    error('Error durante el proceso de actualización: ' + err.message)

    run.merge({
      finishedAt: DateTime.now(),
      success: false,
      errorMessage: err.message,
    })
    await run.save()

    return run
  }
}
