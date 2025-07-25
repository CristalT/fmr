import vine from '@vinejs/vine'

export const createCustomerValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const email = await db.from('customers').where('email', value).first()
        return !email
      }),
    firstName: vine.string(),
    lastName: vine.string(),
    dni: vine
      .string()
      .unique(async (db, value) => {
        const dni = await db.from('customers').where('dni', value).first()
        return !dni
      })
      .optional(),
    phone: vine.number(),
    address: vine.string().optional(),
    city: vine.string().optional(),
    province: vine.string().optional(),
    postalCode: vine.string().optional(),
  })
)

export const updateCustomerValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    firstName: vine.string(),
    lastName: vine.string(),
    dni: vine
      .string()
      .unique(async (db, value, { meta }) => {
        const dni = await db
          .from('customers')
          .where('dni', value)
          .whereNot('id', meta.customerId)
          .first()
        return !dni
      })
      .optional(),
    phone: vine.string(),
    address: vine.string().optional(),
    city: vine.string().optional(),
    province: vine.string().optional(),
    postalCode: vine.string().optional(),
  })
)
