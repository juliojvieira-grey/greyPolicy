import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tenants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('tenant_id').notNullable()
      table.string('client_id').notNullable()
      table.string('client_secret').notNullable()
      table.boolean('auto_sync').defaultTo(false)
      table.jsonb('sync_config').nullable()
      table.string('directory_id').notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
