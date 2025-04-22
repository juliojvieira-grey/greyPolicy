import type { HttpContext } from '@adonisjs/core/http'
import Policy from '#models/policy'
import PolicyVersion from '#models/policy_version'
import Acknowledgement from '#models/acknowledgement'
import db from '@adonisjs/lucid/services/db'

export default class AdminDashboardController {
  public async index({ auth }: HttpContext) {
    await auth.authenticate()

    // Contagem de políticas
    const totalPolicies = await Policy.query().count('* as total')
    const draftPolicies = await Policy.query().where('status', 'draft').count('* as total')
    const activePolicies = Number(totalPolicies[0].$extras.total) - Number(draftPolicies[0].$extras.total)

    // Destinatários únicos (de acknowledgements)
    const totalRecipientsResult = await db
      .from('acknowledgements')
      .countDistinct('user_id as total')
    const totalRecipients = totalRecipientsResult[0].total

    // Visualizações e assinaturas
    const viewedResult = await Acknowledgement.query().whereNotNull('viewed_at').count('* as total')
    const signedResult = await Acknowledgement.query().whereNotNull('signed_at').count('* as total')

    // Lista das políticas com dados resumidos (via policy_versions + acknowledgements)
    const versions = await PolicyVersion.query()
      .preload('policy', (policyQuery) => policyQuery.preload('category'))
      .preload('acknowledgements', (ackQuery) =>
        ackQuery.select(['id', 'signed_at', 'viewed_at', 'policy_version_id'])
      )
      .where('is_latest', true)

    const formattedPolicies = versions.map((version) => {
      const policy = version.policy!
      const acknowledgements = version.acknowledgements || []

      return {
        id: policy.id,
        name: policy.title,
        version: version.version.toFixed(1),
        category: policy.category?.name || 'Sem categoria',
        targets: acknowledgements.length,
        viewed: acknowledgements.filter((ack) => ack.viewedAt !== null).length,
        signed: acknowledgements.filter((ack) => ack.signedAt !== null).length,
      }
    })

    return {
      summary: {
        drafts: Number(draftPolicies[0].$extras.total),
        activePolicies,
        totalRecipients,
        viewed: Number(viewedResult[0].$extras.total),
        signed: Number(signedResult[0].$extras.total),
      },
      policies: formattedPolicies,
    }
  }
}
