import { Container } from '@mui/material'
import PageHeader from '../../components/PageHeader'

export default function PoliciesPage() {
  return (
    <Container>
      <PageHeader
        title="Lista de Políticas"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Políticas' }]}
      />
    </Container>
  )
}
