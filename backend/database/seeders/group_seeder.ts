import Group from '#models/group'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class GroupSeeder extends BaseSeeder {
  public async run() {
    await Group.createMany([
      { name: 'Administradores' },
      { name: 'Colaboradores' },
    ])
  }
}
