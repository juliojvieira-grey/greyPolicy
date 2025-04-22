// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'

type User = {
  id: string
  email: string
  fullName: string
  role: string
  organizationId: string
}

interface AuthContextProps {
    token: string | null
    user: User | null
    isAuthenticated: boolean
    isAdmin: boolean
    login: (token: string, user: User, provider?: 'local' | 'microsoft') => void
    logout: () => void
}
const AuthContext = createContext<AuthContextProps | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loginProvider, setLoginProvider] = useState<'local' | 'microsoft' | null>(null)
  
    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        const storedProvider = localStorage.getItem('login_provider') as 'local' | 'microsoft' | null
      
        try {
          if (storedToken && storedUser) {
            const parsedUser: User = JSON.parse(storedUser)
            if (parsedUser?.id && parsedUser?.email) {
              setToken(storedToken)
              setUser(parsedUser)
              setLoginProvider(storedProvider || 'local')
            } else {
              throw new Error('Usuário mal formatado')
            }
          }
        } catch (error) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('login_provider')
          setToken(null)
          setUser(null)
          setLoginProvider(null)
        }
      }, [])
  
    const login = (newToken: string, newUser: User, provider: 'local' | 'microsoft' = 'local') => {
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      localStorage.setItem('login_provider', provider)
      setToken(newToken)
      setUser(newUser)
      setLoginProvider(provider)
    }
  
    const logout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('login_provider')
  
      setToken(null)
      setUser(null)
      setLoginProvider(null)
  
      if (loginProvider === 'microsoft') {
        const redirect = encodeURIComponent('http://localhost:5173/signed-out')
        window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${redirect}`
      } else {
        window.location.href = '/login'
      }
    }
  
    return (
      <AuthContext.Provider
        value={{
          token,
          user,
          isAuthenticated: !!token,
          isAdmin: user?.role === 'admin',
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
