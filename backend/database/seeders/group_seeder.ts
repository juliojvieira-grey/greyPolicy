import Group from '#models/group'
import Organization from '#models/organization'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class GroupSeeder extends BaseSeeder {
  public async run () {
    const organization = await Organization.findByOrFail('name', 'Greylogix')

    await Group.createMany([
      { name: 'Administradores', organizationId: organization.id },
      { name: 'Colaboradores', organizationId: organization.id },
    ])

    console.log('Groups created')
  }
}
