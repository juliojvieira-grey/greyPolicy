import type { HttpContext } from '@adonisjs/core/http'
import MsGraphService from '#services/MsGraphService'
import User from '#models/user'
import { generateSecurePassword } from '#helpers/generate_secure_password'
import hash from '@adonisjs/core/services/hash'
import Group from '#models/group'
import { apiResponse } from '#utils/response'

export default class GraphImportController {
  // GET /api/users/entra/groups
  async listGroups({ response }: HttpContext) {
    try {
      const graph = new MsGraphService()
      const groups = await graph.listSecurityGroups()
      return response.ok(apiResponse(true, 'Grupos listados com sucesso', groups))
    } catch (error) {
      return response.internalServerError(
        apiResponse(false, 'Erro ao buscar grupos do Entra ID', error?.message)
      )
    }
  }

  // POST /users/entra/import-group/:groupId
  async importByGroup({ params, response, auth }: HttpContext) {
    const groupId = params.groupId

    if (!groupId) {
      return response.badRequest(apiResponse(false, 'Parâmetro "groupId" é obrigatório'))
    }

    try {
      const graph = new MsGraphService()
      const groupData = await graph.getGroupById(groupId)

      let group = await Group.query()
        .where('entra_id', groupData.id)
        .andWhere('organization_id', auth.user!.organizationId)
        .first()

      if (!group) {
        group = await Group.create({
          name: groupData.displayName,
          entraId: groupData.id,
          isFromEntra: true,
          organizationId: auth.user!.organizationId,
        })
      }

      const members = await graph.listGroupUsers(groupData.id)
      const importedUsers: { id: string, email: string }[] = []

      for (const m of members) {
        if (!m.userPrincipalName) continue

        let user = await User.findBy('email', m.userPrincipalName)

        if (!user) {
          const plainPassword = generateSecurePassword()
          const hashedPassword = await hash.make(plainPassword)

          user = await User.create({
            fullName: m.displayName,
            email: m.userPrincipalName,
            password: hashedPassword,
            role: 'user',
            source: 'entra',
            organizationId: auth.user!.organizationId,
            createdBy: auth.user!.id,
          })
        }

        const alreadyInGroup = await group
          .related('users')
          .query()
          .where('users.id', user.id)
          .first()

        if (!alreadyInGroup) {
          await group.related('users').attach([user.id])
        }

        importedUsers.push({ id: user.id, email: user.email })
      }

      return response.created(apiResponse(true, 'Grupo e membros importados com sucesso', {
        group: { name: group.name, entraId: group.entraId },
        users: importedUsers,
      }))
    } catch (error) {
      return response.internalServerError(
        apiResponse(false, 'Erro ao importar grupo ou membros', error?.response?.data || error.message)
      )
    }
  }
}
