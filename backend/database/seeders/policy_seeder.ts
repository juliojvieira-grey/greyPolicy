import Policy from '#models/policy'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class PolicySeeder extends BaseSeeder {
  public async run() {
    await Policy.createMany([
      { title: 'Política de Segurança da Informação'},
      { title: 'Política de Privacidade'},
    ])
  }
}
