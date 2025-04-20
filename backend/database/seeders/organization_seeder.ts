import Organization from '#models/organization'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class OrganizationSeeder extends BaseSeeder {
  public async run() {
    await Organization.create({
      name: 'Greylogix'
    })

    console.log('Organization created')
  }
}
