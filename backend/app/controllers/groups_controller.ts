import type { HttpContext } from '@adonisjs/core/http'
import Group from '#models/group'
import { apiResponse } from '#utils/response'

export default class GroupsController {
  async index({ response }: HttpContext) {
    try {
      const groups = await Group.all()
      return response.ok(apiResponse(true, 'Lista de grupos carregada com sucesso', groups))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao carregar grupos'))
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name'])
      const group = await Group.create(data)
      return response.created(apiResponse(true, 'Grupo criado com sucesso', group))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao criar grupo'))
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const group = await Group.findOrFail(params.id)
      return response.ok(apiResponse(true, 'Grupo encontrado', group))
    } catch {
      return response.notFound(apiResponse(false, 'Grupo não encontrado'))
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const group = await Group.findOrFail(params.id)
      group.merge(request.only(['name']))
      await group.save()
      return response.ok(apiResponse(true, 'Grupo atualizado com sucesso', group))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao atualizar grupo'))
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const group = await Group.findOrFail(params.id)
      await group.delete()
      return response.ok(apiResponse(true, 'Grupo excluído com sucesso'))
    } catch {
      return response.notFound(apiResponse(false, 'Grupo não encontrado'))
    }
  }

  async users({ params, response }: HttpContext) {
    try {
      const group = await Group.findOrFail(params.id)
      await group.load('users')
      return response.ok(apiResponse(true, 'Usuários do grupo carregados com sucesso', group.users))
    } catch {
      return response.notFound(apiResponse(false, 'Grupo não encontrado'))
    }
  }

  async addUser({ params, request, response }: HttpContext) {
    try {
      const group = await Group.findOrFail(params.id)
      const userId = request.input('userId')

      if (!userId) {
        return response.badRequest(apiResponse(false, 'Parâmetro "userId" é obrigatório'))
      }

      await group.related('users').attach([userId])
      return response.ok(apiResponse(true, 'Usuário adicionado ao grupo com sucesso'))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao adicionar usuário ao grupo'))
    }
  }

  async removeUser({ params, response }: HttpContext) {
    try {
      const group = await Group.findOrFail(params.id)
      await group.related('users').detach([params.userId])
      return response.ok(apiResponse(true, 'Usuário removido do grupo com sucesso'))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao remover usuário do grupo'))
    }
  }
}
