import type { HttpContext } from '@adonisjs/core/http'
import PolicyVersion from '#models/policy_version'

import { cuid } from '@adonisjs/core/helpers'
import { DateTime } from 'luxon'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { existsSync } from 'node:fs'

export default class PolicyVersionsController {
  async index({}: HttpContext) {
    return PolicyVersion.all()
  }

  public async store({ request, response }: HttpContext) {
    const file = request.file('file', {
      size: '5mb',
      extnames: ['pdf'],
    })

    if (!file || !file.tmpPath) {
      return response.badRequest({ message: 'Arquivo PDF é obrigatório.' })
    }

    const policyId = request.input('policyId')
    const version = request.input('version')

    if (!policyId || !version) {
      return response.badRequest({ message: 'policyId e version são obrigatórios.' })
    }

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

    return response.created({
      message: 'Versão da política criada com sucesso.',
      policyVersion,
    })
  }

  async show({ params }: HttpContext) {
    return PolicyVersion.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const version = await PolicyVersion.findOrFail(params.id)
    const data = request.only(['version', 'filePath'])
    version.merge(data)
    await version.save()
    return version
  }

  async destroy({ params }: HttpContext) {
    const version = await PolicyVersion.findOrFail(params.id)
    await version.delete()
    return { message: 'Policy version deleted successfully' }
  }
  
  
  public async download({ params, auth, response }: HttpContext) {
    const versionId = params.id

    const version = await PolicyVersion.findOrFail(versionId)
    await version.load('policy')

    if (version.policy.organizationId !== auth.user!.organizationId) {
      return response.unauthorized({ message: 'Acesso negado à política.' })
    }

    if (!existsSync(version.filePath)) {
      return response.notFound({ message: 'Arquivo da política não encontrado.' })
    }

    return response.download(version.filePath)
  }
}