import Acknowledgement from '#models/acknowledgement'
import PolicyVersion from '#models/policy_version'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class AcknowledgementSeeder extends BaseSeeder {
  public async run() {
    const user1 = await User.findByOrFail('email', 'julio@example.com')
    const user2 = await User.findByOrFail('email', 'ana@example.com')
    const version = await PolicyVersion.query().firstOrFail()

    await Acknowledgement.createMany([
      {
        userId: user1.id,
        policyVersionId: version.id,
        signedAt: DateTime.local(),
      },
      {
        userId: user2.id,
        policyVersionId: version.id,
        signedAt: DateTime.local(),
      },
    ])

    console.log('Aknowledgements created')
  }
}
