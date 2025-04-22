import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async store({ request, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)

    const token = await auth.use('api').createToken(user)
    return {
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
  }

  async destroy({ auth }: HttpContext) {
    await auth.use('api').invalidateToken()
  }
}