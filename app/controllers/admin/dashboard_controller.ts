import { HttpContext } from '@adonisjs/core/http'
import StockUpdateRun from '#models/stock_update_run'
import { runStockUpdate } from '#services/stock_update_service'

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    const lastStockUpdateRun = await StockUpdateRun.query().orderBy('id', 'desc').first()

    const lastStockUpdateRunWithChanges = await StockUpdateRun.query()
      .where('success', true)
      .where((query) => {
        query
          .where('createdCount', '>', 0)
          .orWhere('updatedCount', '>', 0)
          .orWhere('deletedCount', '>', 0)
      })
      .orderBy('id', 'desc')
      .first()

    return inertia.render('admin/dashboard/index', {
      lastStockUpdateRun,
      lastStockUpdateRunWithChanges,
    })
  }

  async runStockUpdate({ response }: HttpContext) {
    const raw = response.response

    response.header('Content-Type', 'text/event-stream')
    response.header('Cache-Control', 'no-cache')
    response.header('Connection', 'keep-alive')
    raw.flushHeaders()

    const send = (data: unknown) => raw.write(`data: ${JSON.stringify(data)}\n\n`)

    try {
      const run = await runStockUpdate({
        trigger: 'manual',
        onProgress: (progress) => send(progress),
      })

      send({
        type: 'done',
        success: run.success,
        createdCount: run.createdCount,
        updatedCount: run.updatedCount,
        deletedCount: run.deletedCount,
        errorMessage: run.errorMessage,
        finishedAt: run.finishedAt,
      })
    } catch (error: any) {
      send({ type: 'done', success: false, errorMessage: error.message })
    } finally {
      raw.end()
    }
  }
}
