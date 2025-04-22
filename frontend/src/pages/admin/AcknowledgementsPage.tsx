import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material'

import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Link } from 'react-router-dom'

interface AcknowledgementRow {
  id: string
  policy: string
  category: string
  viewedAt: string
  signedAt: string
}

const rows: AcknowledgementRow[] = [
  {
    id: '1',
    policy: 'Política de Segurança da Informação',
    category: 'Segurança',
    viewedAt: '2024-04-12T10:30:00',
    signedAt: '2024-04-12T10:45:00',
  },
  {
    id: '2',
    policy: 'Política de Acesso',
    category: 'TI',
    viewedAt: '2024-04-13T09:10:00',
    signedAt: '2024-04-13T09:12:00',
  },
]

export default function AcknowledgementsPage() {
  const columns: GridColDef[] = [
    { field: 'policy', headerName: 'Política', flex: 1 },
    { field: 'category', headerName: 'Categoria', flex: 1 },
    {
      field: 'viewedAt',
      headerName: 'Visualizada em',
      flex: 1,
      valueFormatter: (params: { value: string }) =>
        new Date(params.value).toLocaleString('pt-BR'),
    },
    {
      field: 'signedAt',
      headerName: 'Assinada em',
      flex: 1,
      valueFormatter: (params: { value: string }) =>
        new Date(params.value).toLocaleString('pt-BR'),
    },
  ]

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard" underline="hover" color="inherit">
            Dashboard
          </MuiLink>
          <Typography color="text.primary">Meus Aceites</Typography>
        </Breadcrumbs>
      </Box>

      <Typography variant="h4" gutterBottom>
        Políticas Aceitas Por Mim
      </Typography>

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
          disableRowSelectionOnClick
        />
      </Box>
    </Container>
  )
}
