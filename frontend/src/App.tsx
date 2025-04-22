import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

import { useAuth } from './hooks/useAuth'

// Páginas principais
import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/auth/LoginPage'
import Unauthorized from './pages/misc/Unauthorized'
import NotFound from './pages/misc/NotFound'
import AuthCallback from './pages/auth/AuthCallback'

// Rotas protegidas
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

// Páginas de políticas
import PoliciesPage from './pages/policies/PoliciesPage'
import PolicyDetailsPage from './pages/policies/PolicyDetailsPage'
import AcknowledgementsPage from './pages/admin/AcknowledgementsPage'

// Páginas administrativas
import AdminPage from './pages/admin/AdminPage'
import UserManagementPage from './pages/admin/UserManagementPage'
import GroupManagementPage from './pages/admin/GroupManagementPage'
import CategoryManagementPage from './pages/admin/settingsPage'
import SignedOut from './pages/auth/SignedOut'



function HomeRedirect() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/signed-out" element={<SignedOut />} />
        <Route path="*" element={<NotFound />} />
        
        <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/policies"
          element={
            <PrivateRoute>
              <PoliciesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/policies/:id"
          element={
            <PrivateRoute>
              <PolicyDetailsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/acknowledgements"
          element={
            <PrivateRoute>
              <AcknowledgementsPage />
            </PrivateRoute>
          }
        />

        {/* Rotas administrativas */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagementPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/groups"
          element={
            <AdminRoute>
              <GroupManagementPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <CategoryManagementPage />
            </AdminRoute>
          }
        />
      </Route>
      </Routes>
    </BrowserRouter>
  )
}
