import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import string from '@adonisjs/core/helpers/string'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class CustomerUser extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @computed()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  @column()
  declare dni: string

  @column()
  declare email: string

  @column()
  declare phone: string

  @column()
  declare address: string

  @column()
  declare city: string

  @column()
  declare province: string

  @column()
  declare postalCode: string

  @column()
  declare password: string

  @column()
  declare resetPasswordToken: string

  @column({
    consume: (value: string) => new Date(value),
    prepare: (value: string) => value ? value.slice(0, 19).replace('T', ' ') : null,
  })
  declare resetPasswordTokenExpirationDate: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static readonly accessTokens = DbAccessTokensProvider.forModel(CustomerUser)

  generateResetPasswordToken() {
    this.resetPasswordToken = string.generateRandom(64)
    this.resetPasswordTokenExpirationDate = DateTime.now().plus({ hours: 1 }).toString()
  }
}
