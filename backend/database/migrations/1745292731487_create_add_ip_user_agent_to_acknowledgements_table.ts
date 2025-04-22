// database/migrations/202504222359_add_signed_info_to_acknowledgements.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'acknowledgements'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('signed_ip').nullable()
      table.string('signed_user_agent').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('signed_ip')
      table.dropColumn('signed_user_agent')
    })
  }
}
