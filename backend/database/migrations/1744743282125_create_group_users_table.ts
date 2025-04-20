import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'group_user'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.uuid('group_id').unsigned().references('id').inTable('groups').onDelete('CASCADE')
      table.primary(['user_id', 'group_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}