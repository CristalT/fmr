import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Product from '#models/product'
import { readdirSync } from 'node:fs'

export default class ProductCommand extends BaseCommand {
  static readonly commandName = 'product:image:update:all'
  static readonly description = 'Update product images according the storage.'

  static readonly options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const files = readdirSync('uploads/images')

    for (const file of files) {
      const [id] = file.split('.')
      const item = await Product.findBy({ id })
      if (item && !item?.image) {
        this.logger.info(`Updating product ${item.code}`)
        item.image = file
        item?.save()
      }
    }

    this.logger.info('Products updated with the available images')
  }
}
