import { HttpContext } from '@adonisjs/core/http'

export default class AdminController {
  async index({ response }: HttpContext) {
    response.redirect('/admin/products/view')
  }
}
