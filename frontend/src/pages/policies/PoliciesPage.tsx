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
  Visibility,
} from '@mui/icons-material'

import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

import PolicyViewModal from '../../components/PolicyViewModal'
import { useState } from 'react'

interface PolicyRow {
  id: string
  name: string
  category: string
  createdAt: string
  status: string
}

const rows: PolicyRow[] = [
  {
    id: '1',
    name: 'Política de Segurança da Informação',
    category: 'Segurança',
    createdAt: '2024-04-10T10:00:00',
    status: 'Ativa',
  },
  {
    id: '2',
    name: 'Política de Acesso',
    category: 'TI',
    createdAt: '2024-03-05T15:20:00',
    status: 'Inativa',
  },
]

export default function PoliciesPage() {
  const { isAdmin } = useAuth()

  const [selectedPolicy, setSelectedPolicy] = useState<PolicyRow | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const openModal = (policy: PolicyRow) => {
    setSelectedPolicy(policy)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedPolicy(null)
  }

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', flex: 1 },
    { field: 'category', headerName: 'Categoria', flex: 1 },
    {
      field: 'createdAt',
      headerName: 'Data de Criação',
      flex: 1,
      valueFormatter: (params: { value: string }) =>
        new Date(params.value).toLocaleDateString(),
    },
    { field: 'status', headerName: 'Status', flex: 0.6 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton onClick={() => openModal(params.row)} title="Visualizar">
            <Visibility />
          </IconButton>
          {isAdmin && (
            <>
              <IconButton
                component={Link}
                to={`/admin/policies/${params.id}/edit`}
                title="Editar"
              >
                <Edit />
              </IconButton>
              <IconButton title="Excluir">
                <Delete />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ]

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard" underline="hover" color="inherit">
            Dashboard
          </MuiLink>
          <Typography color="text.primary">Políticas</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Lista de Políticas</Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to="/admin/policies/create"
          >
            Nova Política
          </Button>
        )}
      </Box>

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Modal de visualização */}
      <PolicyViewModal
        open={modalOpen}
        onClose={closeModal}
        policy={selectedPolicy}
      />
    </Container>
  )
}
