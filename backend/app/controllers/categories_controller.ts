import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { apiResponse } from '#utils/response'

export default class CategoriesController {
  async index({ response }: HttpContext) {
    try {
      const categories = await Category.all()
      return response.ok(apiResponse(true, 'Categorias carregadas com sucesso', categories))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao carregar categorias'))
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name'])
      const category = await Category.create(data)
      return response.created(apiResponse(true, 'Categoria criada com sucesso', category))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao criar categoria'))
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      return response.ok(apiResponse(true, 'Categoria encontrada com sucesso', category))
    } catch {
      return response.notFound(apiResponse(false, 'Categoria não encontrada'))
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      category.merge(request.only(['name']))
      await category.save()
      return response.ok(apiResponse(true, 'Categoria atualizada com sucesso', category))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao atualizar categoria'))
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.delete()
      return response.ok(apiResponse(true, 'Categoria excluída com sucesso'))
    } catch {
      return response.notFound(apiResponse(false, 'Categoria não encontrada'))
    }
  }
}
