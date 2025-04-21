import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddExpirationToAcknowledgements extends BaseSchema {
  protected tableName = 'acknowledgements'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('expires_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('expires_at')
    })
  }
}
