import Setting from '#models/setting'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const defaultSettings = [
      {
        key: 'company_name',
        value: 'Forclaz Motorepuestos',
        type: 'string',
        description: 'Nombre o Razón Social',
      },
      {
        key: 'company_zip_code',
        value: '3260',
        type: 'string',
        description: 'Código postal',
      },
      {
        key: 'company_address',
        value: '9 de Julio 1429',
        type: 'string',
        description: 'Dirección',
      },
      {
        key: 'company_city',
        value: 'Concepción del Uruguay',
        type: 'string',
        description: 'Ciudad',
      },
      {
        key: 'company_province',
        value: 'Entre Ríos',
        type: 'string',
        description: 'Provincia',
      },
      {
        key: 'company_phone',
        value: '03442-445594',
        type: 'string',
        description: 'Teléfono de contacto',
      },
      {
        key: 'company_whatsapp',
        value: '+5493442484584',
        type: 'string',
        description: 'Whatsapp',
      },
      {
        key: 'company_email',
        value: 'mostradorforclaz@gmail.com',
        type: 'email',
        description: 'Correo electrónico (contacto)',
      },
      {
        key: 'stock_round_interval',
        value: 100,
        type: 'number',
        description: 'Intervalo de redondeo de precios',
      },
      {
        key: 'stock_hide_products_with_zero_stock',
        value: true,
        type: 'boolean',
        description: 'Ocultar productos sin stock',
      },
      {
        key: 'stock_hide_products_with_zero_price',
        value: true,
        type: 'boolean',
        description: 'Ocultar productos sin precio',
      },
      {
        key: 'payment_method_mercado_pago',
        value: false,
        type: 'boolean',
        description: 'Mercado Pago',
      },
    ]

    for (const setting of defaultSettings) {
      await Setting.createIfNotExists(setting.key, setting.value, setting.description)
    }
  }
}
