import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { parse } from 'csv-parse/sync'
import { promises as fs } from 'node:fs'
import Hash from '@adonisjs/core/services/hash'

import { generateSecurePassword } from '#helpers/generate_secure_password'

export default class UserImportController {
  public async store({ request, response, auth }: HttpContext) {
    const csvFile = request.file('file', {
      extnames: ['csv'],
      size: '2mb',
    })

    if (!csvFile) {
      return response.badRequest({ message: 'Arquivo CSV é obrigatório.' })
    }

    const content = await fs.readFile(csvFile.tmpPath!, 'utf-8')

    const rows = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    const created = []

    for (const row of rows) {
      const plainPassword = generateSecurePassword()
      const hashedPassword = await Hash.make(plainPassword)

      const user = await User.firstOrCreate(
        { email: row.email },
        {
          fullName: row.fullName,
          email: row.email,
          role: row.role || 'user',
          source: 'csv',
          password: hashedPassword,
          organizationId: auth.user!.organizationId,
          createdBy: auth.user!.id,
        }
      )

      console.log(`🔐 Usuário criado: ${user.email} | Senha: ${plainPassword}`)

      created.push({ email: user.email })
    }

    return response.ok({
      message: 'Usuários importados com sucesso.',
      total: created.length,
      users: created,
    })
  }
}
