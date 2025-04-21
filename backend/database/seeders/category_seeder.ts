import Category from '#models/category'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class CategorySeeder extends BaseSeeder {
  public async run() {
    await Category.updateOrCreateMany('name', [
      { name: 'Segurança da Informação' },
      { name: 'Privacidade de Dados' },
      { name: 'Conformidade Legal' },
      { name: 'Recursos Humanos' },
      { name: 'TI & Sistemas' },
      { name: 'Uso Aceitável' },
      { name: 'Governança Corporativa' },
      { name: 'Outros' },
    ])

    console.log('✅ Categorias de políticas criadas com sucesso.')
  }
}
