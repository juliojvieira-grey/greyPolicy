import type { HttpContext } from '@adonisjs/core/http'
import Organization from '#models/organization'
import { apiResponse } from '#utils/response'

export default class OrganizationController {
  async index({ response }: HttpContext) {
    try {
      const data = await Organization.all()
      return response.ok(apiResponse(true, 'Lista de organizações carregada com sucesso', data))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao carregar organizações'))
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name'])
      const organization = await Organization.create(data)
      return response.created(apiResponse(true, 'Organização criada com sucesso', organization))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao criar organização'))
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const organization = await Organization.findOrFail(params.id)
      return response.ok(apiResponse(true, 'Organização encontrada', organization))
    } catch {
      return response.notFound(apiResponse(false, 'Organização não encontrada'))
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const organization = await Organization.findOrFail(params.id)
      organization.merge(request.only(['name']))
      await organization.save()
      return response.ok(apiResponse(true, 'Organização atualizada com sucesso', organization))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao atualizar organização'))
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const organization = await Organization.findOrFail(params.id)
      await organization.delete()
      return response.ok(apiResponse(true, 'Organização excluída com sucesso'))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao excluir organização'))
    }
  }
}
