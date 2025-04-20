import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// Controllers
const SessionController = () => import('#controllers/session_controller')
const UsersController = () => import('#controllers/users_controller')
const PoliciesController = () => import('#controllers/policies_controller')
const PolicyVersionsController = () => import('#controllers/policy_versions_controller')
const AcknowledgementsController = () => import('#controllers/acknowledgements_controller')
const GroupsController = () => import('#controllers/groups_controller')

/**
 * Autenticação (Login / Logout)
 */
router.group(() => {
  router.post('/login', [SessionController, 'store'])
  router.delete('/logout', [SessionController, 'destroy']).use(middleware.auth({ guards: ['api'] }))
}).prefix('/api')

/**
 * Rotas protegidas por autenticação (usuários comuns e admins)
 */
router.group(() => {
  /**
   * Acesso de usuários comuns (apenas leitura)
   */
  router.get('/policies', [PoliciesController, 'index'])
  router.get('/policies/:id', [PoliciesController, 'show'])

  router.get('/policy-versions', [PolicyVersionsController, 'index'])
  router.get('/policy-versions/:id', [PolicyVersionsController, 'show'])

  router.get('/acknowledgements', [AcknowledgementsController, 'index'])

  /**
   * Acesso exclusivo de administradores
   */
  router.group(() => {
    router.resource('policies', PoliciesController).except(['index', 'show'])
    router.resource('policy-versions', PolicyVersionsController).except(['index', 'show'])
    router.resource('acknowledgements', AcknowledgementsController).except(['index'])
    router.resource('users', UsersController)
    router.resource('groups', GroupsController)
  }).middleware(middleware.isAdmin())

}).prefix('/api').use([middleware.auth(), middleware.organization()])

