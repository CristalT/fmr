import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export type StockUpdateTrigger = 'scheduled' | 'manual'

export default class StockUpdateRun extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare trigger: StockUpdateTrigger

  @column.dateTime()
  declare startedAt: DateTime

  @column.dateTime()
  declare finishedAt: DateTime | null

  @column()
  declare success: boolean | null

  @column()
  declare createdCount: number | null

  @column()
  declare updatedCount: number | null

  @column()
  declare deletedCount: number | null

  @column()
  declare errorMessage: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
