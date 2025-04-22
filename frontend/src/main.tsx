// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import theme from './theme'

import { AuthProvider } from './context/AuthContext'

import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
)
