import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE')
      table.uuid('created_by').nullable().references('id').inTable('users').onDelete('SET NULL')

      table.string('full_name')
      table.string('email').notNullable().unique()
      table.string('password').notNullable()

      table.enum('source', ['csv', 'entra', 'manual']).notNullable().defaultTo('manual')
      table.enum('role', ['admin', 'user']).notNullable().defaultTo('user')

      table.string('entra_id').nullable()
      table.string('manager_email').nullable()

      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
