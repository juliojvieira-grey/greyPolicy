import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  async index({}: HttpContext) {
    return User.all()
  }

  async store({ request }: HttpContext) {
    const data = request.only(['name', 'email'])
    return User.create(data)
  }

  async show({ params }: HttpContext) {
    return User.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['name', 'email'])
    user.merge(data)
    await user.save()
    return user
  }

  async destroy({ params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
  }
}