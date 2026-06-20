import vine from '@vinejs/vine'

export const updateProviderValidator = vine.compile(
  vine.object({
    email: vine.string().email().nullable(),
    alias: vine.string().minLength(2),
    name: vine.string(),
  })
)

export const updateProductsPublicationValidator = vine.compile(
  vine.object({
    public: vine.boolean(),
  })
)
