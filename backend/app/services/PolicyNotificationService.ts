// app/services/PolicyNotificationService.ts
import type User from '#models/user'
import type PolicyVersion from '#models/policy_version'
import { emailQueue } from '#queues/email_queue'
import Logger from '@adonisjs/core/services/logger'

function buildPolicyEmail(user: User, policyTitle: string, url: string): string {
  return `
    <p>Olá ${user.fullName},</p>
    <p>Você foi atribuído à política: <strong>${policyTitle}</strong>.</p>
    <p><a href="${url}" target="_blank" rel="noopener noreferrer">Clique aqui para acessar</a></p>
    <p>Este é um e-mail automático, por favor não responda.</p>
  `
}

export async function notifyUserPolicy(
  user: User,
  policyVersion: PolicyVersion,
  appUrl: string
): Promise<void> {
  const ack = await user.related('acknowledgements').firstOrCreate(
    { policyVersionId: policyVersion.id },
    {}
  )

  const url = `${appUrl}/api/acknowledgements/view/${ack.token}`

  try {
    await emailQueue.add(
      'sendEmail',
      {
        to: user.email,
        subject: `Nova política: ${policyVersion.policy.title}`,
        html: buildPolicyEmail(user, policyVersion.policy.title, url),
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      }
    )

    Logger.info(`📬 Email enfileirado para ${user.email} com política ${policyVersion.policy.title}`)
  } catch (error) {
    Logger.error(`❌ Erro ao adicionar email à fila para ${user.email}: ${error.message}`)
    // Você pode rethrow ou salvar em um sistema de monitoramento externo aqui
  }
}
