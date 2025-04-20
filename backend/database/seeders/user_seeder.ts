import { BaseSeeder } from '@adonisjs/lucid/seeders'

import Organization from '#models/organization'
import User from '#models/user'

export default class extends BaseSeeder {
  public async run() {
    const email = 'admin@example.com'
    const org = await Organization.findByOrFail('name', 'Greylogix')

    // Verifica se o admin já existe
    const existing = await User.findBy('email', email)
    if (existing) {
      console.log('Admin user already exists.')
      return
    }

    const admin = await User.create({
      fullName: 'Admin User',
      email,
      source: 'manual',
      role: 'admin',
      password: 'StrongP@ssw0rd!',
      organizationId: org.id
    })

    console.log('Admin user created')

    // Additional users
    await User.firstOrCreate(
      { email: 'julio@example.com' },
      {
        fullName: 'Julio Vieira',
        email: 'julio@example.com',
        source: 'manual',
        role: 'user',
        password: 'User@123',
        organizationId: org.id,
        createdBy: admin.id,
      }
    )

    await User.firstOrCreate(
      { email: 'ana@example.com' },
      {
        fullName: 'Ana Martins',
        email: 'ana@example.com',
        source: 'manual',
        role: 'user',
        password: 'User@123',
        organizationId: org.id,
        createdBy: admin.id,
      }
    )

    console.log('Additional users created')
  }
}