import type { HttpContext } from '@adonisjs/core/http'
import Acknowledgement from '#models/acknowledgement'

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
  }
}