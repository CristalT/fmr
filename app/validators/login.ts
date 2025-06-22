import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const adminLoginValidator = vine.compile(
  vine.object({
    email: vine.string().exists(async (db, value) => {
      const user = await db.from('admin_users').where('email', value).first()
      return user
    }),
    password: vine.string(),
  })
)

export const customerLoginValidator = vine.compile(
  vine.object({
    email: vine.string().exists(async (db, value) => {
      const user = await db.from('customer_users').where('email', value).first()
      return user
    }),
    password: vine.string(),
  })
)

export const passwordResetValidator = vine.compile(
  vine.object({
    email: vine.string().exists(async (db, value) => {
      const user = await db.from('customer_users').where('email', value).first()
      return user
    }),
    token: vine.string().exists(async (db, value) => {
      const user = await db
        .from('customer_users')
        .where('reset_password_token', value)
        .where('reset_password_token_expiration_date', '>', DateTime.now().toString())
        .first()

      return user
    }),
    password: vine.string().minLength(8).confirmed({ confirmationField: 'passwordConfirmation' }),
    passwordConfirmation: vine.string().minLength(8),
  })
)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().exists(async (db, value) => {
      const user = await db.from('customer_users').where('email', value).first()
      return user
    }),
  })
)
