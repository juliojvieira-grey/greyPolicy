import type { HttpContext } from '@adonisjs/core/http'
import Policy from '#models/policy'
import PolicyVersion from '#models/policy_version'
import User from '#models/user'
import Group from '#models/group'
import { notifyUserPolicy } from '#services/PolicyNotificationService'
import { apiResponse } from '#utils/response'

const appUrl = process.env.APP_URL || 'http://localhost:3333'

export default class PoliciesController {
  async index({ response }: HttpContext) {
    try {
      const data = await Policy.all()
      return response.ok(apiResponse(true, 'Lista de políticas carregada com sucesso', data))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao carregar políticas'))
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['title', 'category', 'externalAccess', 'organizationId'])
      const policy = await Policy.create(data)
      return response.created(apiResponse(true, 'Política criada com sucesso', policy))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao criar política'))
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const policy = await Policy.findOrFail(params.id)
      return response.ok(apiResponse(true, 'Política encontrada', policy))
    } catch {
      return response.notFound(apiResponse(false, 'Política não encontrada'))
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const policy = await Policy.findOrFail(params.id)
      const data = request.only(['title', 'category', 'externalAccess', 'organizationId'])
      policy.merge(data)
      await policy.save()
      return response.ok(apiResponse(true, 'Política atualizada com sucesso', policy))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao atualizar política'))
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const policy = await Policy.findOrFail(params.id)
      await policy.delete()
      return response.ok(apiResponse(true, 'Política excluída com sucesso'))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao excluir política'))
    }
  }

  async sendToUser({ params, response }: HttpContext) {
    try {
      const policyVersion = await PolicyVersion.findOrFail(params.id)
      await policyVersion.load('policy')

      const user = await User.findOrFail(params.userId)

      await notifyUserPolicy(user, policyVersion, appUrl)

      return response.ok(apiResponse(true, 'E-mail de política enfileirado com sucesso'))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao enfileirar e-mail para o usuário'))
    }
  }

  async sendToGroup({ params, response }: HttpContext) {
    try {
      const policyVersion = await PolicyVersion.findOrFail(params.id)
      await policyVersion.load('policy')

      const group = await Group.query()
        .where('id', params.groupId)
        .preload('users')
        .firstOrFail()

      for (const user of group.users) {
        await notifyUserPolicy(user, policyVersion, appUrl)
      }

      return response.ok(apiResponse(true, `E-mails enfileirados para ${group.users.length} usuários`))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao enfileirar e-mails para o grupo'))
    }
  }
}
