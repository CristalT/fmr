import vine from '@vinejs/vine'

export const createCustomerValidator = vine.compile(
  vine.object({
    email: vine.string().unique(async (db, value) => {
      const email = await db.from('customer_users').where('email', value).first()
      return !email
    }),
    firstName: vine.string(),
    lastName: vine.string(),
    phone: vine.number(),
  })
)
