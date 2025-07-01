import { HttpContext } from '@adonisjs/core/http'

export default class AdminController {
  async index({ response }: HttpContext) {
    response.redirect().toRoute('admin.stock.view')
  }
}
