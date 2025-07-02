import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Product from '#models/product'
import { readdirSync, unlinkSync } from 'node:fs'
import sharp from 'sharp'
import app from '@adonisjs/core/services/app'
import { UPLOADS_FOLDER } from '#config/constants'

export default class StockImageUpdateCommand extends BaseCommand {
  static readonly commandName = 'stock:images:update'
  static readonly description = 'Update product images according the storage.'

  static readonly options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const path = app.makePath(UPLOADS_FOLDER, 'images')
    const files = readdirSync(path)

    for (const file of files) {
      const [id, extension] = file.split('.')
      const imageName = `${id}.webp`

      if (extension !== 'webp') {
        sharp(app.makePath(UPLOADS_FOLDER, 'images', file))
          .webp({ quality: 80 })
          .toFile(app.makePath(UPLOADS_FOLDER, 'images', imageName))
          .then(() => {
            unlinkSync(app.makePath(UPLOADS_FOLDER, 'images', file))
          })
      }
      const item = await Product.findBy({ id })
      if (item && !item?.image) {
        this.logger.info(`Updating product ${item.code}`)
        item.image = imageName
        item?.save()
      }
    }

    this.logger.info('Products updated with the available images')
  }
}
