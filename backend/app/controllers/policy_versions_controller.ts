import type { HttpContext } from '@adonisjs/core/http'
import PolicyVersion from '#models/policy_version'

export default class PolicyVersionsController {
  async index({}: HttpContext) {
    return PolicyVersion.all()
  }

  async store({ request }: HttpContext) {
    const data = request.only(['version', 'filePath', 'policyId', 'publishedAt'])
    return PolicyVersion.create(data)
  }

  async show({ params }: HttpContext) {
    return PolicyVersion.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const version = await PolicyVersion.findOrFail(params.id)
    const data = request.only(['version', 'filePath'])
    version.merge(data)
    await version.save()
    return version
  }

  async destroy({ params }: HttpContext) {
    const version = await PolicyVersion.findOrFail(params.id)
    await version.delete()
  }
}