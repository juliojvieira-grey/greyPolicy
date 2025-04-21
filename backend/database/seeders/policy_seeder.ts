import Policy from '#models/policy'
import Organization from '#models/organization'
import Category from '#models/category'

import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class PolicySeeder extends BaseSeeder {
  public async run() {
    const organization = await Organization.findByOrFail('name', 'Greylogix')
    const category = await Category.findByOrFail('name', 'Outros')

    await Policy.createMany([
      { title: 'Política de Segurança da Informação', organizationId: organization.id, categoryId: category.id },
      { title: 'Política de Privacidade', organizationId: organization.id, categoryId: category.id },
    ])
    console.log('Policies created')
  }
}
