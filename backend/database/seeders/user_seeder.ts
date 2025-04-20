import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        fullName: 'Julio Vieira',
        email: 'julio@example.com',
        source: 'csv',
      },
      {
        fullName: 'Ana Martins',
        email: 'ana@example.com',
        source: 'entra',
        entraId: 'entra-id-xyz',
      },
    ])
  }
}
