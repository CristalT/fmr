import Order from '#models/order'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import { MercadoPagoConfig, Preference } from 'mercadopago'

export class MercadopagoService {
  private client: MercadoPagoConfig

  constructor() {
    const accessToken = env.get('MERCADOPAGO_ACCESS_TOKEN')
    if (!accessToken) {
      logger.error('MERCADOPAGO_ACCESS_TOKEN is not set in the environment variables')
      throw new Error('MERCADOPAGO_ACCESS_TOKEN is not set in the environment variables')
    }
    this.client = new MercadoPagoConfig({
      accessToken,
    })
  }

  getPublicKey() {
    const mpPublicKey = env.get('MERCADOPAGO_PUBLIC_KEY')
    if (!mpPublicKey) {
      throw new Error('MERCADOPAGO_PUBLIC_KEY is not set in the environment variables')
    }

    return mpPublicKey
  }

  async createPreference(order: Order) {
    const preference = new Preference(this.client)

    return preference
      .create({
        body: {
          external_reference: String(order.id),
          items: order.cartItems.map((item) => ({
            id: item.product.id,
            title: item.product.name,
            quantity: item.quantity,
            unit_price: item.product.price,
          })),
        },
      })
      .catch((error) => {
        logger.error('Failed to create Mercado Pago preference: ' + error.message)
        throw new Error('Failed to create Mercado Pago preference')
      })
  }
}
