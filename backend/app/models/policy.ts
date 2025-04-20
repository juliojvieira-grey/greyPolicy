import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import PolicyVersion from '#models/policy_version'

export default class Policy extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare category?: string

  @column()
  declare externalAccess: boolean

  @column()
  declare tenantId?: string

  @hasMany(() => PolicyVersion)
  declare versions: HasMany<typeof PolicyVersion>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
