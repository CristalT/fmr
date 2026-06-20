import env from '#start/env'
import { createReadStream, existsSync } from 'node:fs'
import parser from 'csv-parser'
import Product from '#models/product'
import Provider from '#models/provider'
import Category from '#models/category'
import StockUpdateRun, { StockUpdateTrigger } from '#models/stock_update_run'
import db from '@adonisjs/lucid/services/db'
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
    if (!existsSync(source)) {
      throw new Error(`No se encontró el archivo de stock en la ruta configurada: ${source}`)
    }
    info('Actualizando stock...')

    await new Promise<void>((resolve, reject) => {
      const onSourceError = (err: Error) => {
        error('Error al leer el archivo de origen. ' + err.message)
        reject(err)
      }

      createReadStream(source)
        .on('error', onSourceError)
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
        .on('error', onSourceError)
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

    // Update or create products, counting only the ones that actually changed.
    // Note: fetched directly via the query builder (not the Product model), since
    // Product's afterFetch hook rounds `price` for display and would make every
    // row look "changed" when compared against the unrounded CSV value.
    info('Actualizando artículos...')

    const exactFields = [
      'code',
      'provider',
      'location',
      'name',
      'stock',
      'brand',
      'origin',
    ] as const
    // `price`/`fob` are FLOAT columns: MySQL stores them as binary floats, so the
    // round-tripped value can be off by a tiny amount that scales with magnitude
    // (e.g. ~0.05 off on a value in the millions). Tolerance combines a fixed
    // floor with a relative margin so it scales the same way.
    const numericFields = ['fob', 'price'] as const
    const isNumericallyEqual = (a: number, b: number) =>
      Math.abs(a - b) <= Math.max(0.01, Math.abs(a) * 1e-6)

    const existingProducts = await db
      .from('products')
      .select('id', ...exactFields, ...numericFields, 'factory_code')
      .whereIn('id', productIds)
    const existingById = new Map(existingProducts.map((p) => [p.id, p]))

    let createdCount = 0
    let updatedCount = 0
    const productsToPersist: any[] = []

    for (const data of products) {
      const existing = existingById.get(data.id)
      if (!existing) {
        productsToPersist.push(data)
        createdCount++
        continue
      }
      const hasChanges =
        exactFields.some((field) => existing[field] !== data[field]) ||
        numericFields.some((field) => !isNumericallyEqual(existing[field], data[field])) ||
        existing.factory_code !== data.factoryCode
      if (hasChanges) {
        productsToPersist.push(data)
        updatedCount++
      }
    }

    if (productsToPersist.length > 0) {
      await Product.updateOrCreateMany('id', productsToPersist)
    }

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
