import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import Tenant from '#models/tenant'
import Policy from '#models/policy'
import Group from '#models/group'

export default class Organization extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relação com usuários
  @hasMany(() => User)
  declare users: HasMany<typeof User>

  // Relação com tenants (do Entra ID)
  @hasMany(() => Tenant)
  declare tenants: HasMany<typeof Tenant>

  // Relação com políticas
  @hasMany(() => Policy)
  declare policies: HasMany<typeof Policy>

  // Relação com grupos
  @hasMany(() => Group)
  declare groups: HasMany<typeof Group>
}
