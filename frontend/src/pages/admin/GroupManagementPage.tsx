import { Container } from '@mui/material'
import PageHeader from '../../components/PageHeader'

export default function GroupManagementPage() {
  return (
    <Container>
      <PageHeader
        title="Gerenciamento de Grupos"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Grupos' },
        ]}
      />
    </Container>
  )
}
