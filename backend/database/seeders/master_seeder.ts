import { BaseSeeder } from '@adonisjs/lucid/seeders'

import OrganizationSeeder from './organization_seeder.js'
import UserSeeder from './user_seeder.js'
import GroupSeeder from './group_seeder.js'
import TenantSeeder from './tenant_seeder.js'
import PolicySeeder from './policy_seeder.js'
import PolicyVersionSeeder from './policy_version_seeder.js'
import AcknowledgementSeeder from './acknowledgement_seeder.js'
import AcknowledgementTokenSeeder from './acknowledgement_token_seeder.js'
import CategorySeeder from './category_seeder.js'

export default class MasterSeeder extends BaseSeeder {
  public async run () {
    await new OrganizationSeeder(this.client).run()
    await new UserSeeder(this.client).run()
    await new GroupSeeder(this.client).run()
    await new TenantSeeder(this.client).run()
    await new CategorySeeder(this.client).run()
    await new PolicySeeder(this.client).run()
    await new PolicyVersionSeeder(this.client).run()
    await new AcknowledgementSeeder(this.client).run()
    await new AcknowledgementTokenSeeder(this.client).run()
  }
}
