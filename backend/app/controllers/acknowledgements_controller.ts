import type { HttpContext } from '@adonisjs/core/http'
import Acknowledgement from '#models/acknowledgement'
import { DateTime } from 'luxon'

export default class AcknowledgementsController {
  async index({}: HttpContext) {
    return Acknowledgement.all()
  }

  async store({ request }: HttpContext) {
    const data = request.only(['userId', 'policyVersionId', 'viewedAt', 'signedAt'])
    return Acknowledgement.create(data)
  }

  async show({ params }: HttpContext) {
    return Acknowledgement.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const ack = await Acknowledgement.findOrFail(params.id)
    const data = request.only(['viewedAt', 'signedAt'])
    ack.merge(data)
    await ack.save()
    return ack
  }

  async destroy({ params }: HttpContext) {
    const ack = await Acknowledgement.findOrFail(params.id)
    await ack.delete()
    return { message: 'Acknowledgement deleted' }
  }

  /**
   * POST /acknowledgements/accept
   * Body: { token: string }
   */
  async acceptByToken({ request, response }: HttpContext) {
    const token = request.input('token')
    if (!token) {
      return response.badRequest({ message: 'Token is required' })
    }

    const ack = await Acknowledgement.findBy('token', token)
    if (!ack) {
      return response.notFound({ message: 'Invalid or expired token' })
    }

    if (ack.expiresAt && ack.expiresAt < DateTime.utc()) {
      return response.gone({ message: 'Este link expirou. Solicite um novo.' })
    }

    const now = DateTime.utc()

    if (!ack.viewedAt) {
      ack.viewedAt = now
    }

    if (!ack.signedAt) {
      ack.signedAt = now
      await ack.save()
      return response.ok({ message: 'Política assinada com sucesso.' })
    }

    return response.ok({ message: 'Política já havia sido assinada anteriormente.' })
  }

   /**
   * GET /acknowledgements/view/:token
   * Marca a política como visualizada
   */
   async viewedByToken({ params, response }: HttpContext) {
    const token = params.token

    const ack = await Acknowledgement.findBy('token', token)
    if (!ack) {
      return response.notFound({ message: 'Token inválido ou inexistente.' })
    }

    if (ack.expiresAt && ack.expiresAt < DateTime.utc()) {
      return response.gone({ message: 'Este link expirou. Solicite um novo.' })
    }

    if (!ack.viewedAt) {
      ack.viewedAt = DateTime.utc()
      await ack.save()
    }

    return response.ok({
      message: 'Visualização registrada com sucesso.',
      acknowledgement: {
        id: ack.id,
        viewedAt: ack.viewedAt,
        signedAt: ack.signedAt,
        userId: ack.userId,
        policyVersionId: ack.policyVersionId
      }
    })
  }
}
