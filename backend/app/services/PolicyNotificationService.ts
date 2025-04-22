// app/services/PolicyNotificationService.ts
import type User from '#models/user'
import type PolicyVersion from '#models/policy_version'
import { emailQueue } from '#queues/email_queue'

function buildPolicyEmail(user: User, policyTitle: string, url: string) {
  return `
    <p>Olá ${user.fullName},</p>
    <p>Você foi atribuído à política: <strong>${policyTitle}</strong></p>
    <p><a href="${url}">Clique aqui para acessar</a></p>
  `
}

export async function notifyUserPolicy(
  user: User,
  policyVersion: PolicyVersion,
  appUrl: string
) {
  const ack = await user.related('acknowledgements').firstOrCreate({
    policyVersionId: policyVersion.id,
  })

  const url = `${appUrl}/api/acknowledgements/view/${ack.token}`

  await emailQueue.add('sendEmail', {
    to: user.email,
    subject: `Nova política: ${policyVersion.policy.title}`,
    html: buildPolicyEmail(user, policyVersion.policy.title, url),
  }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
  })
}
