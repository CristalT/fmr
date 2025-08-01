import vine from '@vinejs/vine'

export const createReceiptvalidation = (minAmount: number) =>
  vine.compile(
    vine.object({
      customerId: vine.number().exists(async (db, value) => {
        const customer = db.from('customers').where('id', value).first()
        return !!customer
      }),
      paymentDate: vine.date(),
      paymentMethods: vine.array(
        vine.object({
          method: vine.enum(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'mercadopago']),
          amount: vine.number().min(0),
          description: vine.string().maxLength(255).optional(),
        })
      ),
      description: vine.string().maxLength(255).optional(),
      amount: vine.number().min(minAmount),
    })
  )
