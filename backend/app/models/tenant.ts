import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import Organization from '#models/organization'

export default class Tenant extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare organizationId: string

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @column()
  declare name: string

  @column()
  declare tenantId: string

  @column()
  declare clientId: string

  @column()
  declare clientSecret: string

  @column()
  declare autoSync: boolean

  @column()
  declare syncConfig: any

  @column()
  declare directoryId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
