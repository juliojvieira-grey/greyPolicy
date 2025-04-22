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

export default function AdminPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [pageSize, setPageSize] = useState(10)

  const rows = [
    { id: 1, name: 'greylogix', version: 'v2.0', category: 'Outros', targets: 6, viewed: 6, signed: 4 },
    { id: 2, name: 'Teste', version: 'v1.0', category: 'Conformidade', targets: 1, viewed: 0, signed: 0 },
  ]

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', flex: 1 },
    {
      field: 'version',
      headerName: 'Versão Atual',
      flex: 0.8,
      renderCell: (params) => (
        <Box sx={{ backgroundColor: 'green', color: 'white', borderRadius: '12px', px: 1.5, py: 0.25, fontSize: 12, display: 'inline-block' }}>{params.value}</Box>
      ),
    },
    { field: 'category', headerName: 'Categoria', flex: 1 },
    { field: 'targets', headerName: 'Destinatários', type: 'number', flex: 1 },
    { field: 'viewed', headerName: 'Visualizado', type: 'number', flex: 1 },
    { field: 'signed', headerName: 'Assinado', type: 'number', flex: 1 },
    {
      field: 'actions',
      headerName: '',
      flex: 0.2,
      sortable: false,
      renderCell: () => <IconButton><ChevronRightIcon /></IconButton>,
    },
  ]

  const open = Boolean(anchorEl)
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

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
              <Typography variant="body2">Dashboard</Typography>
              <InfoIcon fontSize="small" color="disabled" />
            </Box>
            <Typography variant="h4">2</Typography>
            <Typography variant="caption" color="text.secondary">Esboços - 0</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 250px' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Total de Destinatários</Typography>
              <InfoIcon fontSize="small" color="disabled" />
            </Box>
            <Typography variant="h4">7</Typography>
            <Typography variant="caption" color="text.secondary">Políticas com destinatários - 2</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 250px' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Total visualizado</Typography>
              <InfoIcon fontSize="small" color="disabled" />
            </Box>
            <Typography variant="h4">86%</Typography>
            <LinearProgress variant="determinate" value={86} sx={{ my: 1 }} color="success" />
            <Typography variant="caption" color="text.secondary">das apólices enviadas foram visualizadas</Typography><br />
            <Typography variant="caption" color="text.secondary">Total - 6</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 250px' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Assinado</Typography>
              <InfoIcon fontSize="small" color="disabled" />
            </Box>
            <Typography variant="h4">57%</Typography>
            <LinearProgress variant="determinate" value={57} sx={{ my: 1 }} color="warning" />
            <Typography variant="caption" color="text.secondary">dos destinatários assinaram suas políticas</Typography><br />
            <Typography variant="caption" color="text.secondary">Total - 4</Typography>
          </CardContent>
        </Card>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Button variant="outlined" startIcon={<RefreshIcon />}>Atualizar</Button>
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
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          paginationModel={{ pageSize, page: 0 }}
          onPaginationModelChange={(model) => setPageSize(model.pageSize)}
          disableRowSelectionOnClick
        />
      </Box>
    </Container>
  )
}