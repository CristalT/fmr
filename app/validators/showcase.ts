import vine from '@vinejs/vine'

export const createShowcaseValidator = vine.compile(
  vine.object({
    name: vine.string().unique(async (db, value) => {
      const showcase = await db.from('showcases').where('name', value).first()
      return !showcase
    }),
    description: vine.string().nullable(),
    products: vine.array(vine.string()).minLength(1)
  })
)


export const updateShowcaseValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string().nullable(),
    products: vine.array(vine.string()).minLength(1)
  })
)
