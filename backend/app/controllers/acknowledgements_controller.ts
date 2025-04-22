import type { HttpContext } from '@adonisjs/core/http'
import Acknowledgement from '#models/acknowledgement'
import { DateTime } from 'luxon'
import path from 'node:path'
import { readFile, access } from 'node:fs/promises'
import { constants, createReadStream } from 'node:fs'

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
  
      // captura informações do request
      const ip = request.ip()
      const userAgent = request.header('user-agent') || 'Desconhecido'
  
      ack.merge({
        signedIp: ip,
        signedUserAgent: userAgent,
      })
  
      await ack.save()
  
      return response.ok({ message: 'Política assinada com sucesso.' })
    }
  
    return response.ok({ message: 'Política já havia sido assinada anteriormente.' })
  }

  /**
   * GET /acknowledgements/view/:token
   */
  async viewedByToken({ params, response }: HttpContext) {
    const token = params.token

    const ack = await Acknowledgement.query()
      .where('token', token)
      .preload('policyVersion', (q) => q.preload('policy'))
      .firstOrFail()

    if (ack.expiresAt && ack.expiresAt < DateTime.utc()) {
      return response.gone({ message: 'Este link expirou. Solicite um novo.' })
    }

    if (!ack.viewedAt) {
      ack.viewedAt = DateTime.utc()
      await ack.save()
    }

    const version = ack.policyVersion
    const policy = version.policy

    const templatePath = path.resolve('resources/static/policy_template.html')
    let html = await readFile(templatePath, 'utf-8')

    const acceptSection = ack.signedAt
      ? '<p class="msg">Você já assinou esta política.</p>'
      : `
        <form action="/api/acknowledgements/accept" method="POST">
          <input type="hidden" name="token" value="${ack.token}">
          <button class="btn" type="submit">Concordo com a política</button>
        </form>
      `
  
    html = html
      .replace(/{{POLICY_TITLE}}/g, policy.title)
      .replace(/{{VERSION}}/g, version.version.toFixed(1))
      .replace(/{{FILE_PATH}}/g, version.filePath)
      .replace(/{{TOKEN}}/g, ack.token || '')
      .replace(/{{ACCEPT_SECTION}}/g, acceptSection)

    return response.type('text/html').send(html)
  }

  /**
   * GET /acknowledgements/pdf/:token
   */
  async pdfByToken({ params, response }: HttpContext) {
    const token = params.token

    const ack = await Acknowledgement.query()
      .where('token', token)
      .preload('policyVersion')
      .firstOrFail()

    if (ack.expiresAt && ack.expiresAt < DateTime.utc()) {
      return response.gone({ message: 'Este link expirou. Solicite um novo.' })
    }

    const safePath = path.basename(ack.policyVersion.filePath)
    const fullPath = path.resolve('uploads/policies', safePath)

    try {
      await access(fullPath, constants.F_OK)
    } catch {
      return response.notFound({ message: 'Arquivo não encontrado.' })
    }

    return response
      .type('application/pdf')
      .header('Content-Disposition', 'inline')
      .stream(createReadStream(fullPath))
  }
}
