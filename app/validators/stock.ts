import vine from '@vinejs/vine'

export const createStockItemValidator = vine.compile(
  vine.object({
    id: vine.string().unique(async (db, value) => {
      const item = await db.from('products').where('id', value).first()
      return !item
    }),
    code: vine.string().maxLength(20).minLength(1),
    provider: vine.string().maxLength(3).minLength(1),
    name: vine.string().maxLength(140),
    fob: vine.number(),
    price: vine.number(),
    stock: vine.number(),
  })
)
