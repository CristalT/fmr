import vine from '@vinejs/vine'

export const updateProviderValidator = vine.compile(
  vine.object({
    email: vine.string().email().nullable(),
    alias: vine.string().minLength(2),
    name: vine.string(),
  })
)
