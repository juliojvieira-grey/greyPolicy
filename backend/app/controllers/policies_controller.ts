import type { HttpContext } from '@adonisjs/core/http'
import Policy from '#models/policy'

export default class PoliciesController {
  async index({}: HttpContext) {
    return Policy.all()
  }

  async store({ request }: HttpContext) {
    const data = request.only(['title', 'tenantId'])
    return Policy.create(data)
  }

  async show({ params }: HttpContext) {
    return Policy.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const policy = await Policy.findOrFail(params.id)
    const data = request.only(['title'])
    policy.merge(data)
    await policy.save()
    return policy
  }

  async destroy({ params }: HttpContext) {
    const policy = await Policy.findOrFail(params.id)
    await policy.delete()
  }
}