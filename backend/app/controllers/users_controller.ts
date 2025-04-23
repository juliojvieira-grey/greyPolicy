import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { apiResponse } from '#utils/response'

export default class UsersController {
  async index({ response }: HttpContext) {
    const users = await User.all()
    return response.ok(apiResponse(true, 'Lista de usuários obtida com sucesso', users))
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'fullName',
        'email',
        'password',
        'source',
        'role',
        'organizationId',
        'createdBy'
      ])
      const user = await User.create(data)
      return response.created(apiResponse(true, 'Usuário criado com sucesso', user))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao criar usuário'))
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      return response.ok(apiResponse(true, 'Usuário encontrado', user))
    } catch {
      return response.notFound(apiResponse(false, 'Usuário não encontrado'))
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      const data = request.only(['fullName', 'email', 'role'])
      user.merge(data)
      await user.save()
      return response.ok(apiResponse(true, 'Usuário atualizado com sucesso', user))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao atualizar usuário'))
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()
      return response.ok(apiResponse(true, 'Usuário deletado com sucesso'))
    } catch {
      return response.notFound(apiResponse(false, 'Usuário não encontrado'))
    }
  }
}
