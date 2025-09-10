import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const adminLoginValidator = vine.compile(
  vine.object({
    email: vine.string().exists(async (db, value) => {
      const user = await db.from('administrators').where('email', value).first()
      return user
    }),
    password: vine.string(),
  })
)

export const customerLoginValidator = vine.compile(
  vine.object({
    email: vine.string().exists(async (db, value) => {
      const user = await db.from('customers').where('email', value).first()
      return user
    }),
    password: vine.string(),
  })
)

export const customerProfileValidator = vine.compile(
  vine.object({
    firstName: vine.string().minLength(2).maxLength(100),
    lastName: vine.string().minLength(2).maxLength(100),
    address: vine.string().maxLength(255),
    address2: vine.string().maxLength(255).optional(),
    city: vine.string().maxLength(100),
    province: vine.string().maxLength(100),
    postalCode: vine.string().maxLength(20),
    phone: vine.string().maxLength(20),
  })
)
export const customerSignupValidator = vine.compile(
  vine.object({
    email: vine.string().exists(async (db, value) => {
      const user = await db.from('customers').where('email', value).first()
      return !user
    }),
    firstName: vine.string().minLength(2).maxLength(100),
    lastName: vine.string().minLength(2).maxLength(100),
    password: vine.string(),
    passwordConfirmation: vine.string().minLength(8).confirmed({ confirmationField: 'password' }),
  })
)

export const passwordResetValidator = vine.compile(
  vine.object({
    email: vine.string().exists(async (db, value) => {
      const user = await db.from('customers').where('email', value).first()
      return user
    }),
    token: vine.string().exists(async (db, value) => {
      const user = await db
        .from('customers')
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
      const user = await db.from('customers').where('email', value).first()
      return user
    }),
  })
)
