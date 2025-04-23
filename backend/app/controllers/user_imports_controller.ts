import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { parse } from 'csv-parse/sync'
import { promises as fs } from 'node:fs'
import Hash from '@adonisjs/core/services/hash'
import { generateSecurePassword } from '#helpers/generate_secure_password'
import { apiResponse } from '#utils/response'

export default class UserImportController {
  /**
   * POST /users/import
   * Importa usuários via CSV com campos: fullName, email, role (opcional)
   */
  public async store({ request, response, auth }: HttpContext) {
    try {
      const csvFile = request.file('file', {
        extnames: ['csv'],
        size: '2mb',
      })

      if (!csvFile || !csvFile.tmpPath) {
        return response.badRequest(apiResponse(false, 'Arquivo CSV é obrigatório.'))
      }

      const content = await fs.readFile(csvFile.tmpPath, 'utf-8')

      const rows = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })

      const created: { email: string }[] = []

      for (const row of rows) {
        if (!row.email || !row.fullName) {
          continue // Ignora registros incompletos
        }

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

        if (process.env.LOG_PASSWORDS === 'true') {
          console.log(`🔐 Usuário criado: ${user.email} | Senha: ${plainPassword}`)
        }

        created.push({ email: user.email })
      }

      return response.ok(apiResponse(true, 'Usuários importados com sucesso.', {
        total: created.length,
        users: created,
      }))
    } catch (error) {
      return response.internalServerError(
        apiResponse(false, 'Erro ao importar usuários.', error.message)
      )
    }
  }
}
