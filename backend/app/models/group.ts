import { BaseModel, column, manyToMany, belongsTo } from '@adonisjs/lucid/orm'
import type { ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import User from '#models/user'
import Organization from '#models/organization'

export default class Group extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare entraId?: string

  @column()
  declare isFromEntra: boolean

  @column()
  declare organizationId: string

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @manyToMany(() => User, {
    pivotTable: 'group_users',
  })

  declare users: ManyToMany<typeof User>
  
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
