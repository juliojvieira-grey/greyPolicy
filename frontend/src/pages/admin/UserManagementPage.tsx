import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  IconButton,
} from '@mui/material'

import {
  Add,
  Edit,
  Delete,
} from '@mui/icons-material'

import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Link } from 'react-router-dom'
import ImportUsersModal from '../../components/ImportUsersModal'
import { useState } from 'react'

interface UserRow {
  id: string
  fullName: string
  email: string
  role: 'admin' | 'user'
  organization?: string
}

const rows: UserRow[] = [
  {
    id: '1',
    fullName: 'Maria Silva',
    email: 'maria.silva@empresa.com',
    role: 'admin',
    organization: 'TI Global',
  },
  {
    id: '2',
    fullName: 'João Santos',
    email: 'joao.santos@empresa.com',
    role: 'user',
    organization: 'TI Global',
  },
]

export default function UserManagementPage() {
  const [importModalOpen, setImportModalOpen] = useState(false)

  const columns: GridColDef[] = [
    { field: 'fullName', headerName: 'Nome', flex: 1 },
    { field: 'email', headerName: 'E-mail', flex: 1.2 },
    { field: 'role', headerName: 'Cargo', flex: 0.6 },
    { field: 'organization', headerName: 'Organização', flex: 1 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            component={Link}
            to={`/admin/users/${params.id}/edit`}
            title="Editar"
          >
            <Edit />
          </IconButton>
          <IconButton title="Excluir">
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/admin" underline="hover" color="inherit">
            Admin
          </MuiLink>
          <Typography color="text.primary">Usuários</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Gerenciamento de Usuários</Typography>
        <Box display="flex" gap={2}>
          <Button variant="outlined" onClick={() => setImportModalOpen(true)}>
            Importar Usuários
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to="/admin/users/create"
          >
            Novo Usuário
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          disableRowSelectionOnClick
        />
      </Box>

      <ImportUsersModal open={importModalOpen} onClose={() => setImportModalOpen(false)} />
    </Container>
  )
}
