import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import cache from '@adonisjs/cache/services/main'
import logger from '@adonisjs/core/services/logger'

type SettingType = 'string' | 'number' | 'boolean' | 'json' | 'email'

const inferType = (value: any) => {
  // Infer type safely
  let inferredType: SettingType = 'string'
  if (typeof value === 'number') inferredType = 'number'
  else if (typeof value === 'boolean') inferredType = 'boolean'
  else if (typeof value === 'object' && value !== null) inferredType = 'json'
  else if (typeof value === 'string' && value.includes('@')) inferredType = 'email'
  return inferredType
}

export default class Setting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare key: string

  @column()
  declare value: string

  @column()
  declare type: SettingType

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async getAll() {
    const data = await cache.getOrSetForever({
      key: 'setting:all',
      factory: async () => await this.all(),
    })

    return new Map(data.map((s) => [s.key, s.value]))
  }

  static async get(key: string, defaultValue: any = undefined) {
    const factory = async () => {
      const setting = await this.findBy({ key })
      if (!setting) return defaultValue

      switch (setting.type) {
        case 'string':
          return setting.value
        case 'number':
          return Number(setting.value)
        case 'boolean':
          return setting.value === 'true'
        case 'json':
          try {
            return JSON.parse(setting.value)
          } catch (error) {
            logger.error(`Invalid JSON in setting ${key}: ${setting.value}`)
            return defaultValue
          }
        case 'email':
          return setting.value
        default:
          return setting.value
      }
    }

    return cache.getOrSetForever({ key: `setting:${key}`, factory })
  }

  static async setById(id: number, value: any) {
    try {
      const setting = await this.findOrFail(id)
      setting.value = String(value).trim()
      return setting.save().then((s) => {
        cache.delete({ key: `setting:${s.key}` })
        cache.delete({ key: 'setting:all' })
        return s
      })
    } catch (error) {
      logger.error(`Error trying to update setting ${id}: ${error.message}`)
      throw error
    }
  }

  static async createIfNotExists(
    key: string,
    value: any,
    description: string | null = null
  ): Promise<Setting> {
    const setting = await this.findBy({ key })
    if (setting) return setting

    return this.create({
      key,
      value: String(value).trim(),
      type: inferType(value),
      description,
    })
  }
  static async set(key: string, value: any, description: string | null = null): Promise<Setting> {
    const setting = await this.findBy({ key })

    let save: Promise<Setting>
    if (setting) {
      setting.value = String(value).trim()
      setting.description = description
      save = setting.save()
    } else {
      save = this.create({
        key,
        value: String(value).trim(),
        type: inferType(value),
        description,
      })
    }

    return save.then((result) => {
      cache.delete({ key: `setting:${key}` })
      cache.delete({ key: 'setting:all' })
      return result
    })
  }
}
