import type { HttpContext } from '@adonisjs/core/http'
import Organization from '#models/organization'

export default class OrganizationController {
  async index({}: HttpContext) {
    return Organization.all()
  }

  async store({ request }: HttpContext) {
    const data = request.only(['name'])
    return Organization.create(data)
  }

  async show({ params }: HttpContext) {
    return Organization.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const organization = await Organization.findOrFail(params.id)
    const data = request.only(['name'])
    organization.merge(data)
    await organization.save()
    return organization
  }

  async destroy({ params }: HttpContext) {
    const organization = await Organization.findOrFail(params.id)
    await organization.delete()
    return { message: 'Organization deleted successfully' }
  }  
}