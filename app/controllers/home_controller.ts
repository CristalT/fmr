import Slide from '#models/slide'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index({ inertia }: HttpContext) {
    const slides = await Slide.query().where('public', true).orderBy('order', 'asc')
    return inertia.render('home/index', { slides })
  }
}
