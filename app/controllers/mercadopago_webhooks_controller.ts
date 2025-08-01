import type { HttpContext } from '@adonisjs/core/http'

export default class MercadoPagoWebhooksController {
  async mercadopago({ request, response }: HttpContext) {
    console.log('MercadoPago webhook received:', request.body(), request.headers(), request.qs())
    response.ok('Webhook received successfully')
  }
}
