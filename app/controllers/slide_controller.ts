import { UPLOADS_FOLDER } from '#config/constants'
import Slide from '#models/slide'
import { createSlideValidator, updateSlideValidator } from '#validators/slide'
import { errors } from '@vinejs/vine'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import sharp from 'sharp'

export default class SlideController {
  async create({ inertia }: HttpContext) {
    return inertia.render('admin/slides/create')
  }

  async list({ inertia }: HttpContext) {
    return inertia.render('admin/slides/index')
  }

  async edit({ inertia, params }: HttpContext) {
    const slide = await Slide.findOrFail(params.id)
    return inertia.render('admin/slides/edit', { slide })
  }

  async index({ response }: HttpContext) {
    const slides = await Slide.query().orderBy('order', 'asc')
    return response.send(slides)
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createSlideValidator)
    const backgroundImageFile = request.file('backgroundImage')

    if (!backgroundImageFile) {
      throw new errors.E_VALIDATION_ERROR([
        {
          message: 'La imagen de fondo es requerida',
          rule: 'required',
          field: 'backgroundImage',
        },
      ])
    }

    const slide = await Slide.create(data)

    await sharp(backgroundImageFile.tmpPath)
      .resize(1080, 720, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(app.makePath(UPLOADS_FOLDER, 'images', `slide-${slide.id}-bg.webp`))
    slide.backgroundImage = `slide-${slide.id}-bg.webp`

    const productImageFile = request.file('productImage')
    if (productImageFile) {
      await sharp(productImageFile.tmpPath)
        .webp({ quality: 85 })
        .toFile(app.makePath(UPLOADS_FOLDER, 'images', `slide-${slide.id}-product.webp`))
      slide.productImage = `slide-${slide.id}-product.webp`
    }

    await slide.save()

    return response.redirect().toRoute('admin.slides.list')
  }

  async update({ request, params, response }: HttpContext) {
    const data = await request.validateUsing(updateSlideValidator)
    const slide = await Slide.findOrFail(params.id)
    slide.merge(data)

    const backgroundImageFile = request.file('backgroundImage')
    if (backgroundImageFile) {
      await sharp(backgroundImageFile.tmpPath)
        .resize(1080, 720, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(app.makePath(UPLOADS_FOLDER, 'images', `slide-${slide.id}-bg.webp`))
      slide.backgroundImage = `slide-${slide.id}-bg.webp`
    }

    const productImageFile = request.file('productImage')
    if (productImageFile) {
      await sharp(productImageFile.tmpPath)
        .webp({ quality: 85 })
        .toFile(app.makePath(UPLOADS_FOLDER, 'images', `slide-${slide.id}-product.webp`))
      slide.productImage = `slide-${slide.id}-product.webp`
    }

    await slide.save()

    return response.redirect().toRoute('admin.slides.list')
  }

  async order({ request, response }: HttpContext) {
    const { slidesOrder } = request.all()

    const trx = await db.transaction()
    for (const order of slidesOrder) {
      await Slide.query({ client: trx }).where('id', order.id).update({ order: order.order })
    }
    await trx.commit()

    const newOrder = await Slide.query().orderBy('order', 'asc')
    return response.json(newOrder)
  }

  async destroy({ params, response }: HttpContext) {
    const slide = await Slide.findOrFail(params.id)
    await slide.delete()
    return response.redirect().toRoute('admin.slides.list')
  }
}
