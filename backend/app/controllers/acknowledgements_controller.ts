import type { HttpContext } from '@adonisjs/core/http'
import Acknowledgement from '#models/acknowledgement'
import { DateTime } from 'luxon'
import path from 'node:path'
import { readFile, access } from 'node:fs/promises'
import { constants, createReadStream } from 'node:fs'
import { apiResponse } from '#utils/response'

export default class AcknowledgementsController {
  async index({ response }: HttpContext) {
    const data = await Acknowledgement.all()
    return response.ok(apiResponse(true, 'Lista de registros encontrada', data))
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['userId', 'policyVersionId', 'viewedAt', 'signedAt'])
      const ack = await Acknowledgement.create(data)
      return response.created(apiResponse(true, 'Registro criado com sucesso', ack))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao criar registro'))
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const ack = await Acknowledgement.findOrFail(params.id)
      return response.ok(apiResponse(true, 'Registro encontrado', ack))
    } catch {
      return response.notFound(apiResponse(false, 'Registro não encontrado'))
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const ack = await Acknowledgement.findOrFail(params.id)
      const data = request.only(['viewedAt', 'signedAt'])
      ack.merge(data)
      await ack.save()
      return response.ok(apiResponse(true, 'Registro atualizado com sucesso', ack))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao atualizar registro'))
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const ack = await Acknowledgement.findOrFail(params.id)
      await ack.delete()
      return response.ok(apiResponse(true, 'Registro deletado com sucesso'))
    } catch {
      return response.notFound(apiResponse(false, 'Registro não encontrado'))
    }
  }

  async acceptByToken({ request, response }: HttpContext) {
    try {
      const token = request.input('token')
      if (!token) return response.badRequest(apiResponse(false, 'Token é obrigatório.'))

      const ack = await Acknowledgement.findBy('token', token)
      if (!ack) return response.notFound(apiResponse(false, 'Token inválido ou inexistente.'))

      if (ack.expiresAt && ack.expiresAt < DateTime.utc()) {
        return response.gone(apiResponse(false, 'Este link expirou. Solicite um novo.'))
      }

      const now = DateTime.utc()
      if (!ack.viewedAt) ack.viewedAt = now

      if (!ack.signedAt) {
        ack.signedAt = now
        ack.merge({
          signedIp: request.ip(),
          signedUserAgent: request.header('user-agent') || 'Desconhecido',
        })
        await ack.save()
        return response.ok(apiResponse(true, 'Política assinada com sucesso.'))
      }

      return response.ok(apiResponse(true, 'Política já havia sido assinada anteriormente.'))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao processar a assinatura.'))
    }
  }

  async viewedByToken({ params, response }: HttpContext) {
    try {
      const token = params.token

      const ack = await Acknowledgement.query()
        .where('token', token)
        .preload('policyVersion', (q) => q.preload('policy'))
        .firstOrFail()

      if (ack.expiresAt && ack.expiresAt < DateTime.utc()) {
        return response.gone(apiResponse(false, 'Este link expirou. Solicite um novo.'))
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
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao carregar a política.'))
    }
  }

  async pdfByToken({ params, response }: HttpContext) {
    try {
      const ack = await Acknowledgement.query()
        .where('token', params.token)
        .preload('policyVersion')
        .firstOrFail()

      if (ack.expiresAt && ack.expiresAt < DateTime.utc()) {
        return response.gone(apiResponse(false, 'Este link expirou. Solicite um novo.'))
      }

      const safePath = path.basename(ack.policyVersion.filePath)
      const fullPath = path.resolve('uploads/policies', safePath)

      await access(fullPath, constants.F_OK)

      return response
        .type('application/pdf')
        .header('Content-Disposition', 'inline')
        .stream(createReadStream(fullPath))
    } catch (error) {
      if (error.code === 'ENOENT') {
        return response.notFound(apiResponse(false, 'Arquivo não encontrado.'))
      }
      return response.internalServerError(apiResponse(false, 'Erro ao carregar o arquivo PDF.'))
    }
  }
}
