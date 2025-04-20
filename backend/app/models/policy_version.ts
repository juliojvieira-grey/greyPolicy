import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Policy from '#models/policy'
import Acknowledgement from '#models/acknowledgement'

export default class PolicyVersion extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare policyId: string

  @column()
  declare version: string

  @column()
  declare filePath: string

  @column.dateTime()
  declare publishedAt: DateTime

  @belongsTo(() => Policy)
  declare policy: BelongsTo<typeof Policy>

  @hasMany(() => Acknowledgement)
  declare acknowledgements: HasMany<typeof Acknowledgement>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
