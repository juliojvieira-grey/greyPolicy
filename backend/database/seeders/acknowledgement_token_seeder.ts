import Acknowledgement from '#models/acknowledgement'
import PolicyVersion from '#models/policy_version'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class AcknowledgementTokenSeeder extends BaseSeeder {
  public async run() {
    const now = DateTime.utc()
    const version = await PolicyVersion.query().firstOrFail()
    const users = await User.query().whereIn('email', ['julio@example.com', 'ana@example.com'])
    const expiresAt = now.plus({ days: 7 })

    for (const user of users) {

      const ack = await Acknowledgement.updateOrCreate(
        { userId: user.id, policyVersionId: version.id },
        {
          viewedAt: null,
          signedAt: null,
          createdAt: now,
          updatedAt: now,
          expiresAt,
        }
      )

      console.log(`Link de aceite para ${user.email}:`)
      console.log(`🔗 View URL:     http://localhost:3333/acknowledgements/view/${ack.token}`)
      console.log(`✅ Accept URL:   http://localhost:3333/acknowledgements/accept (token: "${ack.token}")\n`)
    }

    console.log('Tokens de acknowledgements criados com sucesso.')
  }
}
