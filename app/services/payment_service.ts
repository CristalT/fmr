import { inject } from '@adonisjs/core'
import { MercadopagoService } from '#services/mercadopago_service'
import setting from '#helpers/setting'
import Order from '#models/order'

@inject()
export class PaymentService {
  private paymentMethods: Map<string, any> = new Map()

  constructor(private order: Order) {}

  async methods() {
    const mercadopagoEnabled = await setting('payment_method_mercado_pago', false)

    if (mercadopagoEnabled) {
      const mercadopagoService = new MercadopagoService()

      this.paymentMethods.set('mercadopago', {
        publicKey: mercadopagoService.getPublicKey(),
        preference: await mercadopagoService.createPreference(this.order),
      })
    }

    return Object.fromEntries(this.paymentMethods)
  }
}
