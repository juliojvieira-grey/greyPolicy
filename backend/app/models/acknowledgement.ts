import { BaseModel, column, belongsTo, beforeCreate, beforeUpdate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'
import PolicyVersion from '#models/policy_version'
import { randomUUID } from 'node:crypto'

export default class Acknowledgement extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare policyVersionId: string

  @column()
  declare token: string | null

  @column()
  declare signedIp: string | null

  @column()
  declare signedUserAgent: string | null

  @column.dateTime()
  declare expiresAt: DateTime | null

  @column.dateTime()
  declare viewedAt: DateTime | null
  
  @column.dateTime()
  declare signedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => PolicyVersion)
  declare policyVersion: BelongsTo<typeof PolicyVersion>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignToken(ack: Acknowledgement) {
    ack.token = ack.token || randomUUID()
    ack.expiresAt = ack.expiresAt || DateTime.utc().plus({ days: 7 })
  }

  @beforeUpdate()
  static async preventViewOrSignatureOverwrite(instance: Acknowledgement) {
    const original = await Acknowledgement.findOrFail(instance.id)

    if (original.viewedAt && instance.viewedAt && !instance.viewedAt.equals(original.viewedAt)) {
      instance.viewedAt = original.viewedAt
    }

    if (original.signedAt && instance.signedAt && !instance.signedAt.equals(original.signedAt)) {
      instance.signedAt = original.signedAt
    }
  }
}
