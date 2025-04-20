import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tenants'

  async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('directory_id').notNullable()
    })
  }

  async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('directory_id')
    })
  }
}
