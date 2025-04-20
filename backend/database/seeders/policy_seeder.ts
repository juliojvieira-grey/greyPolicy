import Policy from '#models/policy'
import Organization from '#models/organization'

import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class PolicySeeder extends BaseSeeder {
  public async run() {
    const organization = await Organization.findByOrFail('name', 'Greylogix')

    await Policy.createMany([
      { title: 'Política de Segurança da Informação', organizationId: organization.id },
      { title: 'Política de Privacidade', organizationId: organization.id },
    ])
    console.log('Policies created')
  }
}
