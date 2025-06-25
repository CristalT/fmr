import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'

export default class Registry extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @computed()
  get fullName() {
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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
