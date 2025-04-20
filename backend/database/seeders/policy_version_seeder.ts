import PolicyVersion from '#models/policy_version'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class PolicyVersionSeeder extends BaseSeeder {
  public async run() {
    await PolicyVersion.createMany([
      {
        version: '1.0',
        filePath: '/storage/policies/policy1-v1.pdf',
        publishedAt: DateTime.local(),
      },
      {
        version: '1.0',
        filePath: '/storage/policies/policy2-v1.pdf',
        publishedAt: DateTime.local(),
      },
    ])
  }
}
