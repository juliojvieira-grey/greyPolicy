import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'acknowledgements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.uuid('policy_version_id').unsigned().references('id').inTable('policy_versions').onDelete('CASCADE')
      table.timestamp('viewed_at').nullable()
      table.timestamp('signed_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}