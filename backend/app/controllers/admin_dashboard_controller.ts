import type { HttpContext } from '@adonisjs/core/http'
import PolicyVersion from '#models/policy_version'
import Acknowledgement from '#models/acknowledgement'
import db from '@adonisjs/lucid/services/db'
import { apiResponse } from '#utils/response'

export default class AdminDashboardController {
  public async index({ auth, response }: HttpContext) {
    try {
      await auth.authenticate()

      const totalRecipientsResult = await db
        .from('acknowledgements')
        .countDistinct('user_id as total')
      const totalRecipients = totalRecipientsResult[0].total

      const viewedResult = await Acknowledgement.query()
        .whereNotNull('viewed_at')
        .count('* as total')

      const signedResult = await Acknowledgement.query()
        .whereNotNull('signed_at')
        .count('* as total')

      const versions = await PolicyVersion.query()
        .where('status', 'ativo')
        .preload('policy', (query) => query.preload('category'))
        .preload('acknowledgements')

      const formattedPolicies = versions.map((version) => {
        const policy = version.policy!
        const acks = version.acknowledgements

        return {
          id: policy.id,
          name: policy.title,
          version: version.version.toFixed(1),
          category: policy.category?.name || 'Sem categoria',
          targets: acks.length,
          viewed: acks.filter((ack) => ack.viewedAt !== null).length,
          signed: acks.filter((ack) => ack.signedAt !== null).length,
        }
      })

      return response.ok(apiResponse(true, 'Dados do dashboard carregados com sucesso', {
        summary: {
          drafts: 0,
          activePolicies: formattedPolicies.length,
          totalRecipients,
          viewed: Number(viewedResult[0].$extras.total),
          signed: Number(signedResult[0].$extras.total),
        },
        policies: formattedPolicies,
      }))
    } catch (error) {
      return response.internalServerError(apiResponse(false, 'Erro ao carregar dados do dashboard'))
    }
  }
}
