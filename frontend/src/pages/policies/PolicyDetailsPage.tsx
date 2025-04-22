import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'

export default function PolicyDetailsPage() {
  const { id } = useParams()

  return (
    <Container>
      <PageHeader
        title={`Detalhes da Política #${id}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Políticas', href: '/policies' },
          { label: `Política #${id}` },
        ]}
      />
    </Container>
  )
}
