import { Container } from '@mui/material'
import PageHeader from '../../components/PageHeader'

export default function AcknowledgementsPage() {
  return (
    <Container>
      <PageHeader
        title="Minhas Políticas Aceitas"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Aceites' }]}
      />
    </Container>
  )
}