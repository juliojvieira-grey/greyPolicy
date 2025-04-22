// src/components/PolicyViewModal.tsx
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
  } from '@mui/material'
  
  interface Props {
    open: boolean
    onClose: () => void
    policy: {
      id: string
      name: string
      category: string
      createdAt: string
      status: string
    } | null
  }
  
  export default function PolicyViewModal({ open, onClose, policy }: Props) {
    if (!policy) return null
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes da Política</DialogTitle>
        <DialogContent dividers>
          <Box>
            <Typography variant="subtitle2">Nome:</Typography>
            <Typography gutterBottom>{policy.name}</Typography>
  
            <Typography variant="subtitle2">Categoria:</Typography>
            <Typography gutterBottom>{policy.category}</Typography>
  
            <Typography variant="subtitle2">Data de Criação:</Typography>
            <Typography gutterBottom>
              {new Date(policy.createdAt).toLocaleDateString()}
            </Typography>
  
            <Typography variant="subtitle2">Status:</Typography>
            <Typography gutterBottom>{policy.status}</Typography>
          </Box>
        </DialogContent>
  
        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    )
  }
  