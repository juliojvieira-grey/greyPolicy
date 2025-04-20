import Tenant from '#models/tenant'
import Organization from '#models/organization'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class TenantSeeder extends BaseSeeder {
  public async run() {
    const org = await Organization.findByOrFail('name', 'Greylogix')

    await Tenant.createMany([
      {
        name: 'Tenant Principal',
        tenantId: 'entra-tenant-id',
        clientId: 'dummy-client-id',
        clientSecret: 'dummy-secret',
        directoryId: 'dummy-directory-id',
        organizationId: org.id,
      },
    ])

    console.log('Tenant created')
  }
}
