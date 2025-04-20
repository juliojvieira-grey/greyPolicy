import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class OrganizationScopeMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    await auth.check()

    const user = auth.user

    if (!user || !user.organizationId) {
      return response.unauthorized({
        message: 'Usuário não autenticado ou sem organização vinculada',
      })
    }

    await next()
  }
}
