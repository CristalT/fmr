import vine from '@vinejs/vine'

export const getCustomerOrdersValidator = vine.compile(
  vine.object({
    customerId: vine.string().exists(async (db, value) => {
      const customer = await db.from('customers').where('id', value).first()
      return !!customer
    }),
  })
)
