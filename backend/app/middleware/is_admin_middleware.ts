import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class IsAdminMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Usuário não autenticado' })
    }

    if (user.role !== 'admin') {
      return response.forbidden({ message: 'Acesso restrito a administradores' })
    }

    await next()
  }
}
