import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'policy_versions'

  async up() {
    // PostgreSQL: alterar tipo de string para double precision
    this.schema.raw(`ALTER TABLE ${this.tableName} ALTER COLUMN version TYPE DOUBLE PRECISION USING version::double precision`)
  }

  async down() {
    this.schema.raw(`ALTER TABLE ${this.tableName} ALTER COLUMN version TYPE VARCHAR`)
  }
}
