import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material'

import InfoIcon from '@mui/icons-material/InfoOutlined'

export default function UserDashboardPage() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Meu Painel
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={3}>
        <Card sx={{ flex: '1 1 250px' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Políticas atribuídas</Typography>
              <InfoIcon fontSize="small" color="disabled" />
            </Box>
            <Typography variant="h4">4</Typography>
            <Typography variant="caption" color="text.secondary">
              Você tem 4 políticas para revisar
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 250px' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Políticas visualizadas</Typography>
              <InfoIcon fontSize="small" color="disabled" />
            </Box>
            <Typography variant="h4">3</Typography>
            <LinearProgress variant="determinate" value={75} sx={{ my: 1 }} color="success" />
            <Typography variant="caption" color="text.secondary">
              3 de 4 políticas já foram visualizadas
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 250px' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Políticas assinadas</Typography>
              <InfoIcon fontSize="small" color="disabled" />
            </Box>
            <Typography variant="h4">2</Typography>
            <LinearProgress variant="determinate" value={50} sx={{ my: 1 }} color="warning" />
            <Typography variant="caption" color="text.secondary">
              2 de 4 políticas assinadas
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 250px' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Pendências</Typography>
              <InfoIcon fontSize="small" color="disabled" />
            </Box>
            <Typography variant="h4">2</Typography>
            <Typography variant="caption" color="text.secondary">
              2 políticas ainda aguardam sua assinatura
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
