import Setting from '#models/setting'
import type { HttpContext } from '@adonisjs/core/http'

export default class SettingController {
  async view({ inertia }: HttpContext) {
    const settings = await Setting.query().orderBy('key', 'asc').exec()

    return inertia.render('admin/settings/index', { settings })
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    const { value } = request.only(['value'])

    const setting = await Setting.setById(id, value)

    return response.json(setting)
  }
}
