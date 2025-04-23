import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Switch,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material'

import { DataGrid, GridColDef } from '@mui/x-data-grid'

import SearchIcon from '@mui/icons-material/Search'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import { useState } from 'react'
import useSWR from 'swr'
import api from '../../services/api'

// --- Tipos usados apenas aqui ---
interface AdminDashboardResponse {
  summary: {
    drafts: number
    activePolicies: number
    totalRecipients: number
    viewed: number
    signed: number
  }
  policies: Array<{
    id: string
    name: string
    version: string
    category: string
    targets: number
    signed: number
    viewed: number
    type: string
  }>
}

// --- Hook local ---
function useAdminDashboard() {
  const { data, error, isLoading, mutate } = useSWR<AdminDashboardResponse>(
    '/api/admin/dashboard',
    (url) => api.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  )

  return {
    data,
    summary: data?.summary,
    policies: data?.policies,
    isLoading,
    error,
    refresh: mutate,
  }
}

export default function AdminPage() {
  const { summary, policies, isLoading, refresh } = useAdminDashboard()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [pageSize, setPageSize] = useState(10)

  const open = Boolean(anchorEl)
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', flex: 1 },
    {
      field: 'version',
      headerName: 'Versão Atual',
      flex: 0.8,
      renderCell: (params) => (
        <Box sx={{ backgroundColor: 'green', color: 'white', borderRadius: '12px', px: 1.5, py: 0.25, fontSize: 12 }}>
          {params.value}
        </Box>
      ),
    },
    { field: 'category', headerName: 'Categoria', flex: 1 },
    { field: 'targets', headerName: 'Destinatários', type: 'number', flex: 1 },
    { field: 'viewed', headerName: 'Visualizado', type: 'number', flex: 1 },
    { field: 'signed', headerName: 'Assinado', type: 'number', flex: 1 },
    { field: 'type', headerName: 'Tipo de assinatura', flex: 1 },
    {
      field: 'actions',
      headerName: '',
      flex: 0.2,
      sortable: false,
      renderCell: () => <IconButton><ChevronRightIcon /></IconButton>,
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Políticas</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography color="text.secondary">Ocultar usuários inativos</Typography>
          <Switch />
        </Box>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={3} mb={3}>
        <Card sx={{ flex: '1 1 250px' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Políticas Ativas</Typography>
              <InfoIcon fontSize="small" color="disabled" />
            </Box>
            <Typography variant="h4">{summary?.activePolicies ?? '...'}</Typography>
            <Typography variant="caption" color="text.secondary">
              Esboços - {summary?.drafts ?? '...'}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 250px' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Total de Destinatários</Typography>
              <InfoIcon fontSize="small" color="disabled" />
            </Box>
            <Typography variant="h4">{summary?.totalRecipients ?? '...'}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 250px' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Total visualizado</Typography>
              <InfoIcon fontSize="small" color="disabled" />
            </Box>
            <Typography variant="h4">
              {summary ? `${Math.round((summary.viewed / (summary.totalRecipients || 1)) * 100)}%` : '...'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={summary ? (summary.viewed / (summary.totalRecipients || 1)) * 100 : 0}
              sx={{ my: 1 }}
              color="success"
            />
            <Typography variant="caption" color="text.secondary">Total - {summary?.viewed ?? '...'}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 250px' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Assinado</Typography>
              <InfoIcon fontSize="small" color="disabled" />
            </Box>
            <Typography variant="h4">
              {summary ? `${Math.round((summary.signed / (summary.totalRecipients || 1)) * 100)}%` : '...'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={summary ? (summary.signed / (summary.totalRecipients || 1)) * 100 : 0}
              sx={{ my: 1 }}
              color="warning"
            />
            <Typography variant="caption" color="text.secondary">Total - {summary?.signed ?? '...'}</Typography>
          </CardContent>
        </Card>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => refresh()}>
            Atualizar
          </Button>
          <TextField
            size="small"
            placeholder="Pesquisar uma política"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            size="small"
            variant="outlined"
            endIcon={<MoreVertIcon />}
            onClick={handleMenuClick}
          >
            Ações
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Exportar</MenuItem>
            <MenuItem onClick={handleMenuClose}>Arquivar</MenuItem>
          </Menu>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />}>Criar Política</Button>
      </Box>

      <Box sx={{ height: 450, width: '100%' }}>
        <DataGrid
          rows={policies ?? []}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[5, 10, 25]}
          paginationModel={{ pageSize, page: 0 }}
          onPaginationModelChange={(model) => setPageSize(model.pageSize)}
          disableRowSelectionOnClick
        />
      </Box>
    </Container>
  )
}
