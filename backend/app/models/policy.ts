import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import PolicyVersion from '#models/policy_version'
import Organization from '#models/organization'

export default class Policy extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare category?: string

  @column({ columnName: 'organization_id' })
  declare organizationId: string  
  
  @column({ columnName: 'external_access' })
  declare externalAccess: boolean

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @hasMany(() => PolicyVersion)
  declare versions: HasMany<typeof PolicyVersion>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
