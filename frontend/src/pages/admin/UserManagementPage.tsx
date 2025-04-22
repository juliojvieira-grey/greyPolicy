import { Container } from '@mui/material'
import PageHeader from '../../components/PageHeader'

export default function UserManagementPage() {
  return (
    <Container>
      <PageHeader
        title="Gerenciamento de Usuários"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Usuários' },
        ]}
      />
    </Container>
  )
}
