// app/controllers/graph_import_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import MsGraphService from '#services/MsGraphService'
import User from '#models/user'
import { generateSecurePassword } from '#helpers/generate_secure_password'
import hash from '@adonisjs/core/services/hash'
import Group from '#models/group'

export default class GraphImportController {
  // GET /api/users/entra/groups
  async listGroups({ response }: HttpContext) {
    const graph = new MsGraphService()
    const groups = await graph.listSecurityGroups()
    return response.ok(groups)
  }

  // POST /users/entra/import-group/:groupId
  async importByGroup({ params, response, auth }: HttpContext) {
    const groupId = params.groupId
    if (!groupId) {
      return response.badRequest({ error: 'Parâmetro groupId é obrigatório' })
    }
  
    const graph = new MsGraphService()
  
    try {
      const groupData = await graph.getGroupById(groupId)
  
      // Verifica se o grupo já existe
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
      const importedUsers = []
  
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
  
        // Verifica se o usuário já está relacionado ao grupo
        const isAlreadyRelated = await group
        .related('users')
        .query()
        .whereRaw('users.id = ?', [user.id])
        .first()

        if (!isAlreadyRelated) {
          await group.related('users').attach([user.id])
        }
  
        importedUsers.push(user)
      }
  
      return response.created({
        message: 'Grupo e membros importados com sucesso',
        group: { name: group.name, entraId: group.entraId },
        users: importedUsers.map((u) => ({ id: u.id, email: u.email })),
      })
  
    } catch (error) {
      return response.badRequest({
        message: 'Erro ao importar grupo ou membros',
        detail: error?.response?.data || error.message,
      })
    }
  }

}
