import { Container } from '@mui/material'
import PageHeader from '../../components/PageHeader'

export default function settingsPage() {
  return (
    <Container>
      <PageHeader
        title="Configurações"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Configurações' },
        ]}
      />
    </Container>
  )
}
