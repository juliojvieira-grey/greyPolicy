import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const GroupsController = () => import('#controllers/groups_controller')
const PoliciesController = () => import('#controllers/policies_controller')
const PolicyVersionsController = () => import('#controllers/policy_versions_controller')
const AcknowledgementsController = () => import('#controllers/acknowledgements_controller')

router.group(() => {
  router.resource('users', UsersController).apiOnly()
  router.resource('groups', GroupsController).apiOnly()
  router.resource('policies', PoliciesController).apiOnly()
  router.resource('policy-versions', PolicyVersionsController).apiOnly()
  router.resource('acknowledgements', AcknowledgementsController).apiOnly()
}).prefix('/api')
