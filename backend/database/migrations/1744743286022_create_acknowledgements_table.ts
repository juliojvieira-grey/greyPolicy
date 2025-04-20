import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'acknowledgements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.uuid('policy_version_id').notNullable().references('id').inTable('policy_versions').onDelete('CASCADE')
      table.timestamp('viewed_at', { useTz: true }).nullable()
      table.timestamp('signed_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.unique(['user_id', 'policy_version_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
