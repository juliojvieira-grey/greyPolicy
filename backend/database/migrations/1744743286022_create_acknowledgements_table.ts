import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'acknowledgements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.uuid('user_id').notNullable()
        .references('id').inTable('users').onDelete('CASCADE')

      table.uuid('policy_version_id').notNullable()
        .references('id').inTable('policy_versions').onDelete('CASCADE')

      table.timestamp('viewed_at', { useTz: true }).nullable()
      table.timestamp('signed_at', { useTz: true }).nullable()

      table.string('token').unique().nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'))
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'))

      table.unique(['user_id', 'policy_version_id'])

      table.check(
        'signed_at IS NULL OR (viewed_at IS NOT NULL AND signed_at >= viewed_at)'
      )
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
