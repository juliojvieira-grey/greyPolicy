import type { HttpContext } from '@adonisjs/core/http'
import PolicyVersion from '#models/policy_version'
import { cuid } from '@adonisjs/core/helpers'
import { DateTime } from 'luxon'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { apiResponse } from '#utils/response'

export default class PolicyVersionsController {
  async index({ response }: HttpContext) {
    try {
      const data = await PolicyVersion.all()
      return response.ok(apiResponse(true, 'Lista de versões de política carregada com sucesso', data))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao carregar as versões de política'))
    }
  }

  async store({ request, response }: HttpContext) {
    const file = request.file('file', {
      size: '5mb',
      extnames: ['pdf'],
    })

    if (!file || !file.tmpPath) {
      return response.badRequest(apiResponse(false, 'Arquivo PDF é obrigatório'))
    }

    const policyId = request.input('policyId')
    const version = request.input('version')

    if (!policyId || !version) {
      return response.badRequest(apiResponse(false, 'Campos policyId e version são obrigatórios'))
    }

    try {
      const fileName = `${cuid()}.pdf`
      const uploadDir = path.join('uploads', 'policies')
      const finalPath = path.join(uploadDir, fileName)

      await fs.mkdir(uploadDir, { recursive: true })
      await fs.copyFile(file.tmpPath, finalPath)

      const policyVersion = await PolicyVersion.create({
        policyId,
        version,
        filePath: finalPath,
        publishedAt: DateTime.utc(),
      })

      return response.created(apiResponse(true, 'Versão da política criada com sucesso', policyVersion))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao salvar a versão da política'))
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const version = await PolicyVersion.findOrFail(params.id)
      return response.ok(apiResponse(true, 'Versão da política encontrada', version))
    } catch {
      return response.notFound(apiResponse(false, 'Versão da política não encontrada'))
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const version = await PolicyVersion.findOrFail(params.id)
      const data = request.only(['version', 'filePath', 'status'])

      version.merge(data)
      await version.save()

      return response.ok(apiResponse(true, 'Versão da política atualizada com sucesso', version))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao atualizar a versão da política'))
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const version = await PolicyVersion.findOrFail(params.id)
      await version.delete()
      return response.ok(apiResponse(true, 'Versão da política excluída com sucesso'))
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao excluir a versão da política'))
    }
  }

  async download({ params, auth, response }: HttpContext) {
    try {
      const version = await PolicyVersion.findOrFail(params.id)
      await version.load('policy')

      if (version.policy.organizationId !== auth.user!.organizationId) {
        return response.unauthorized(apiResponse(false, 'Acesso negado à política'))
      }

      if (!existsSync(version.filePath)) {
        return response.notFound(apiResponse(false, 'Arquivo da política não encontrado'))
      }

      return response.download(version.filePath)
    } catch {
      return response.internalServerError(apiResponse(false, 'Erro ao realizar download da política'))
    }
  }
}
