import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    Divider,
    Input,
  } from '@mui/material'
  import UploadFileIcon from '@mui/icons-material/UploadFile'
  import CloudIcon from '@mui/icons-material/Cloud'
  import { ChangeEvent, useRef, useState } from 'react'
  import axios from 'axios'
  
  interface Props {
    open: boolean
    onClose: () => void
  }
  
  export default function ImportUsersModal({ open, onClose }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [uploading, setUploading] = useState(false)
  
    const handleCSVImportClick = () => {
      inputRef.current?.click()
    }
  
    const handleCSVFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
  
      const formData = new FormData()
      formData.append('file', file)
  
      try {
        setUploading(true)
        const response = await axios.post('/api/users/import/csv', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        console.log('Usuários importados via CSV:', response.data)
        // Aqui você pode exibir feedback visual (toast/snackbar)
      } catch (error) {
        console.error('Erro ao importar CSV:', error)
      } finally {
        setUploading(false)
        e.target.value = '' // resetar input
      }
    }
  
    const handleEntraIdImport = async () => {
      try {
        setUploading(true)
        const response = await axios.post('/api/users/import/entra-id')
        console.log('Usuários importados do Entra ID:', response.data)
        // Aqui também você pode exibir feedback visual (toast/snackbar)
      } catch (error) {
        console.error('Erro ao importar via Entra ID:', error)
      } finally {
        setUploading(false)
      }
    }
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Importar Usuários</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Selecione uma das opções para importar usuários:
          </Typography>
  
          <Stack spacing={2} mt={2}>
            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={handleCSVImportClick}
              disabled={uploading}
            >
              Importar via CSV
            </Button>
  
            <Button
              variant="outlined"
              startIcon={<CloudIcon />}
              onClick={handleEntraIdImport}
              disabled={uploading}
            >
              Importar do Microsoft Entra ID
            </Button>
  
            <Input
              inputRef={inputRef}
              type="file"
              sx={{ display: 'none' }}
              onChange={handleCSVFileChange}
            />
          </Stack>
        </DialogContent>
  
        <DialogActions>
          <Button onClick={onClose} disabled={uploading}>Fechar</Button>
        </DialogActions>
      </Dialog>
    )
  }
  