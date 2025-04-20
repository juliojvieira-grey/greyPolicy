import Tenant from '#models/tenant'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class TenantSeeder extends BaseSeeder {
  public async run() {
    await Tenant.createMany([
      {
        name: 'Tenant Principal',
        clientId: 'dummy-client-id',
        clientSecret: 'dummy-secret',
        directoryId: 'dummy-directory-id',
      },
    ])
  }
}
