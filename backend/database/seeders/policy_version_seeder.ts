import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Policy from '#models/policy'
import PolicyVersion from '#models/policy_version'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const policy1 = await Policy.findByOrFail('title', 'Política de Segurança da Informação')
    const policy2 = await Policy.findByOrFail('title', 'Política de Privacidade')

    await PolicyVersion.createMany([
      {
        policyId: policy1.id,
        version: 1.0,
        filePath: '/storage/policies/policy1-v1.pdf',
        publishedAt: DateTime.local(),
        status: 'ativo'
      },
      {
        policyId: policy2.id,
        version: 1.0,
        filePath: '/storage/policies/policy2-v1.pdf',
        publishedAt: DateTime.local(),
        status: 'ativo'
      },
    ])

    console.log('Policy version created')
  }
}
