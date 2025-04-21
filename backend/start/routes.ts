import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// Controllers
const SessionController = () => import('#controllers/session_controller')
const UsersController = () => import('#controllers/users_controller')
const PoliciesController = () => import('#controllers/policies_controller')
const PolicyVersionsController = () => import('#controllers/policy_versions_controller')
const AcknowledgementsController = () => import('#controllers/acknowledgements_controller')
const GroupsController = () => import('#controllers/groups_controller')
const OrganizationsController = () => import('#controllers/organizations_controller')

/**
 * 📂 ROTAS PÚBLICAS (sem autenticação)
 */
router.group(() => {
  router.get('/acknowledgements/view/:token', [AcknowledgementsController, 'viewedByToken'])
  router.post('/acknowledgements/accept', [AcknowledgementsController, 'acceptByToken'])
}).prefix('/api')

/**
 * 🔐 AUTENTICAÇÃO
 */
router.group(() => {
  router.post('/login', [SessionController, 'store'])
  router.delete('/logout', [SessionController, 'destroy']).use(middleware.auth({ guards: ['api'] }))
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

  router.get('/acknowledgements', [AcknowledgementsController, 'index'])

  // Escrita (somente admins)
  router.group(() => {
    router.resource('policies', PoliciesController).except(['index', 'show'])
    router.resource('policy-versions', PolicyVersionsController).except(['index', 'show'])
    router.resource('acknowledgements', AcknowledgementsController).except(['index'])
    router.resource('users', UsersController)
    router.resource('groups', GroupsController)
    router.resource('organizations', OrganizationsController)
  }).middleware(middleware.isAdmin())

}).prefix('/api').use([middleware.auth(), middleware.organization()])
