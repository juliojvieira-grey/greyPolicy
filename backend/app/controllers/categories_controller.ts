import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'

export default class CategoriesController {
  async index({}: HttpContext) {
    return Category.all()
  }

  async store({ request }: HttpContext) {
    const data = request.only(['name'])
    const category = await Category.create(data)
    return category
  }

  async show({ params }: HttpContext) {
    return Category.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    category.merge(request.only(['name']))
    await category.save()
    return category
  }

  async destroy({ params, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    await category.delete()
    return response.ok({ message: 'Categoria excluída com sucesso.' })
  }
}
