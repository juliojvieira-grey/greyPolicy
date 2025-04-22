import type { HttpContext } from '@adonisjs/core/http'
import Policy from '#models/policy'
import PolicyVersion from '#models/policy_version'
import User from '#models/user'
import Group from '#models/group'
import { notifyUserPolicy } from '#services/PolicyNotificationService'

const appUrl = process.env.APP_URL || 'http://localhost:3333'

export default class PoliciesController {
  async index({}: HttpContext) {
    return Policy.all()
  }

  async store({ request }: HttpContext) {
    console.log(request.all())

    const data = request.only([
      'title',
      'category',
      'externalAccess',
      'organizationId'
    ])
    return Policy.create(data)
  }

  async show({ params }: HttpContext) {
    return Policy.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const policy = await Policy.findOrFail(params.id)
    const data = request.only([
      'title',
      'category',
      'externalAccess',
      'organizationId'
    ])
    policy.merge(data)
    await policy.save()
    return policy
  }

  async destroy({ params }: HttpContext) {
    const policy = await Policy.findOrFail(params.id)
    await policy.delete()
    return { message: 'Policy deleted successfully' }
  }



  async sendToUser({ params, response }: HttpContext) {
    const policyVersion = await PolicyVersion.findOrFail(params.id)
    await policyVersion.load('policy')
    const user = await User.findOrFail(params.userId)
  
    await notifyUserPolicy(user, policyVersion, appUrl)
  
    return response.ok({ message: 'E-mail enfileirado para envio' })
  }


  async sendToGroup({ params, response }: HttpContext) {
    const policyVersion = await PolicyVersion.findOrFail(params.id)
    await policyVersion.load('policy')
    const group = await Group.query().where('id', params.groupId).preload('users').firstOrFail()
  
    for (const user of group.users) {
      await notifyUserPolicy(user, policyVersion, appUrl)
    }
    
    return response.ok({ message: `E-mails enfileirados para ${group.users.length} usuários` })
  }
}
