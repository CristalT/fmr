import { middleware } from '#start/kernel'

import router from '@adonisjs/core/services/router'

const MercadoPagoWebhooksController = () => import('#controllers/mercadopago_webhooks_controller')

export default function webhookRoutes() {
  router
    .post('/webhooks/mercadopago', [MercadoPagoWebhooksController, 'mercadopago'])
    .as('mercadopago')
    .use(middleware.validateMercadopagoNotification())
}
