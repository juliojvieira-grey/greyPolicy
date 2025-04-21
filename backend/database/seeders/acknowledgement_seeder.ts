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

    const now = DateTime.utc()

    await Acknowledgement.updateOrCreateMany(
      ['userId', 'policyVersionId'],
      [
        {
          userId: user1.id,
          policyVersionId: version.id,
          viewedAt: now,
          signedAt: now,
          createdAt: now,
          updatedAt: now,
        },
        {
          userId: user2.id,
          policyVersionId: version.id,
          viewedAt: now,
          signedAt: now,
          createdAt: now,
          updatedAt: now,
        },
      ]
    )

    console.log('Acknowledgements created')
  }
}
