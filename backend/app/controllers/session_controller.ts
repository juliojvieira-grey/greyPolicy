import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { apiResponse } from '#utils/response'
import { errors as authErrors } from '@adonisjs/auth'

export default class SessionController {
  async store({ request, auth, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      const user = await User.verifyCredentials(email, password)

      const token = await auth.use('api').createToken(user)

      return response.ok(apiResponse(true, 'Login realizado com sucesso', {
          type: 'bearer',
          token: token.value!.release(),
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId,
            provider: 'local',
          }
        }
      ))
    } catch (error) {
      if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
        return response.unauthorized(apiResponse(false, 'E-mail ou senha inválidos'))
      }

      return response.internalServerError(apiResponse(false, 'Erro ao realizar login'))
    }
  }

  async destroy({ auth, response }: HttpContext) {
    try {
      await auth.use('api').invalidateToken()
      return response.ok(apiResponse(true, 'Logout realizado com sucesso'))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao realizar logout'))
    }
  }
}
