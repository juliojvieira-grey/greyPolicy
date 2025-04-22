import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import AdminDashboardController from '#controllers/admin_dashboard_controller'


// Controllers
const SessionController = () => import('#controllers/session_controller')
const UsersController = () => import('#controllers/users_controller')
const PoliciesController = () => import('#controllers/policies_controller')
const PolicyVersionsController = () => import('#controllers/policy_versions_controller')
const AcknowledgementsController = () => import('#controllers/acknowledgements_controller')
const GroupsController = () => import('#controllers/groups_controller')
const OrganizationsController = () => import('#controllers/organizations_controller')
const UserImportController = () => import('#controllers/user_imports_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const GraphImportController = () => import('#controllers/graph_imports_controller')

/**
 * 📂 ROTAS PÚBLICAS (sem autenticação)
 */
router.group(() => {
  router.get('/acknowledgements/view/:token', [AcknowledgementsController, 'viewedByToken'])
  router.post('/acknowledgements/accept', [AcknowledgementsController, 'acceptByToken'])
  router.get('/acknowledgements/pdf/:token', [AcknowledgementsController, 'pdfByToken'])
}).prefix('/api')

/**
 * 🔐 AUTENTICAÇÃO E ENTRA ID
 */
router.group(() => {
  router.post('/login', [SessionController, 'store'])
  router.delete('/logout', [SessionController, 'destroy']).use(middleware.auth({ guards: ['api'] }))

  // Redireciona para o login da Microsoft (Entra ID)
  router.get('/auth/entra_id/redirect', async ({ ally }: HttpContext) => {
    return (ally as any).use('entra_id').redirect()
  })

  // Callback após autenticação pela Microsoft
  router.get('/auth/entra_id/callback', async ({ ally, response, auth }: HttpContext) => {
    const entra = (ally as any).use('entra_id')
  
    if (entra.accessDenied()) return response.unauthorized()
    if (entra.hasError()) return response.badRequest({ message: entra.getError() })
  
    const msUser = await entra.user()
  
    let user
  
    try {
      user = await User.findByOrFail('email', msUser.email)
    } catch {
      return response.unauthorized({ message: 'Usuário não autorizado para login via Entra ID.' })
    }
  
    const token = await auth.use('api').createToken(user)

    return response.redirect(
      `http://localhost:5173/auth/callback?token=${token.value!.release()}&user=${encodeURIComponent(JSON.stringify({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        organizationId: user.organizationId,
        provider: 'microsoft',
      }))}`
    )
    
  })
}).prefix('/api')

/**
 * 🔒 ROTAS AUTENTICADAS
 */
router.group(() => {
  // Leitura (usuários comuns)
  router.get('/policies', [PoliciesController, 'index'])
  router.get('/policies/:id', [PoliciesController, 'show'])

  router.get('/policy-versions', [PolicyVersionsController, 'index'])
  router.get('/policy-versions/:id', [PolicyVersionsController, 'show'])
  router.get('/policy-versions/:id/download', [PolicyVersionsController, 'download'])

  router.get('/acknowledgements', [AcknowledgementsController, 'index'])

  // Escrita (somente admins)
  router.group(() => {
    router.resource('policies', PoliciesController).except(['index', 'show'])
    router.resource('policy-versions', PolicyVersionsController).except(['index', 'show'])
    router.resource('acknowledgements', AcknowledgementsController).except(['index'])
    router.resource('users', UsersController)
    router.resource('groups', GroupsController)
    router.resource('organizations', OrganizationsController)
    router.resource('categories', CategoriesController)

    router.get('/admin/dashboard', [AdminDashboardController, 'index'])

    // 📥 Importação de usuários via CSV
    router.post('/users/csv/import', [UserImportController, 'store'])
    router.get('/users/entra/groups', [GraphImportController, 'listGroups'])
    router.post('/users/entra/import-group/:groupId', [GraphImportController, 'importByGroup'])

    router.get('/groups/:id/users', [GroupsController, 'users'])
    router.post('/groups/:id/users', [GroupsController, 'addUser'])
    router.delete('/groups/:id/users/:userId', [GroupsController, 'removeUser'])

    router.post('/policies/:id/send/user/:userId', [PoliciesController, 'sendToUser'])
    router.post('/policies/:id/send/user/:groupId', [PoliciesController, 'sendToGroup'])


  }).middleware(middleware.isAdmin())

}).prefix('/api').use([middleware.auth(), middleware.organization()])
