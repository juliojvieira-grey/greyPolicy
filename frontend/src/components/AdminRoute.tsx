import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

type AdminRouteProps = {
  children: ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return <p>Carregando...</p> // Ou um loader bonitinho
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/not-found" replace />
  }

  return <>{children}</>
}
