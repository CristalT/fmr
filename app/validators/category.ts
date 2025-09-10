import vine from '@vinejs/vine'

export const CategoryValidator = vine.compile(
  vine.object({
    parentId: vine.number().optional(),
    name: vine
      .string()
      .maxLength(255)
      .unique(async (db, value) => {
        const exists = await db.from('categories').where('name', value).first()
        return !exists
      }),
    slug: vine
      .string()
      .maxLength(255)
      .unique(async (db, value) => {
        const exists = await db.from('categories').where('slug', value).first()
        return !exists
      }),
    description: vine.string().optional(),
  })
)
