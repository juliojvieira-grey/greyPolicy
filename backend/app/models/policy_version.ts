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
  declare version: number

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


  serialize() {
    const base = super.serialize()
    return {
      ...base,
      version: Number(this.version).toFixed(1), // Retorna como "1.0", "1.1", etc
    }
  }
  
}
