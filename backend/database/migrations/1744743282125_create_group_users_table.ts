// database/migrations/YYYYMMDDHHMM_create_group_users_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'group_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.uuid('group_id').notNullable()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE')

      table.uuid('user_id').notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.unique(['group_id', 'user_id'])

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
