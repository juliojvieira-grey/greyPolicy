import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'add_status_to_policy_versions'

  async up() {
    this.schema.alterTable('policy_versions', (table) => {
      table.string('status', 20).notNullable().defaultTo('draft')
    })
  }

  async down() {
    this.schema.alterTable('policy_versions', (table) => {
      table.dropColumn('status')
    })
  }
}