import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import { exit } from 'node:process'
import { runStockUpdate } from '#services/stock_update_service'

export default class StockCommand extends BaseCommand {
  static readonly commandName = 'stock:update'
  static readonly description = 'Update stock'

  static readonly options: CommandOptions = {
    startApp: true,
  }

  async run() {
    await runStockUpdate({
      trigger: 'scheduled',
      onProgress: (progress) =>
        progress.type === 'error'
          ? this.logger.error(progress.text)
          : this.logger.info(progress.text),
    })
    exit()
  }
}
