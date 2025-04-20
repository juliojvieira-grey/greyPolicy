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
}