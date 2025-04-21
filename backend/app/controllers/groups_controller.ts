import type { HttpContext } from '@adonisjs/core/http'
import Group from '#models/group'

export default class GroupsController {
  async index({}: HttpContext) {
    return Group.all()
  }

  async store({ request }: HttpContext) {
    const data = request.only(['name'])
    return Group.create(data)
  }

  async show({ params }: HttpContext) {
    return Group.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const group = await Group.findOrFail(params.id)
    const data = request.only(['name'])
    group.merge(data)
    await group.save()
    return group
  }

  async destroy({ params }: HttpContext) {
    const group = await Group.findOrFail(params.id)
    await group.delete()
  }

  // GET /groups/:id/users
  async users({ params }: HttpContext) {
    const group = await Group.findOrFail(params.id)
    await group.load('users')
    return group.users
  }

// POST /groups/:id/users
  async addUser({ params, request, response }: HttpContext) {
    const group = await Group.findOrFail(params.id)
    const userId = request.input('userId')

    if (!userId) {
      return response.badRequest({ message: 'userId é obrigatório' })
    }

    await group.related('users').attach([userId])
    return response.ok({ message: 'Usuário adicionado ao grupo' })
  }

  // DELETE /groups/:groupId/users/:userId
  async removeUser({ params, response }: HttpContext) {
    const group = await Group.findOrFail(params.id)
    await group.related('users').detach([params.userId])
    return response.ok({ message: 'Usuário removido do grupo' })
  }

}