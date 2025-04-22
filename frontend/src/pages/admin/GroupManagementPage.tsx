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
import { useState } from 'react'

interface GroupRow {
  id: string
  name: string
  description: string
}

const rows: GroupRow[] = [
  {
    id: '1',
    name: 'Administradores',
    description: 'Grupo com permissões administrativas',
  },
  {
    id: '2',
    name: 'Financeiro',
    description: 'Equipe responsável por contratos e orçamento',
  },
]

export default function GroupManagementPage() {
  const [groups] = useState<GroupRow[]>(rows)

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome do Grupo', flex: 1 },
    { field: 'description', headerName: 'Descrição', flex: 2 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            component={Link}
            to={`/admin/groups/${params.id}/edit`}
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
          <Typography color="text.primary">Grupos</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Gerenciamento de Grupos</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          to="/admin/groups/create"
        >
          Novo Grupo
        </Button>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={groups}
          columns={columns}
          pageSizeOptions={[10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          disableRowSelectionOnClick
        />
      </Box>
    </Container>
  )
}
