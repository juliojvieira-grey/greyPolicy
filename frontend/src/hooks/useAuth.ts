import { useEffect, useState } from 'react'

export function useAuth() {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }

    setIsLoading(false)
  }, [])

  const isAuthenticated = !!token
  const isAdmin = user?.role === 'admin'

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error('Credenciais inválidas')
    }

    const data = await response.json()
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }

  const loginWithEntraId = async () => {
    // Redireciona para o provedor Microsoft
    window.location.href = 'http://localhost:3333/api/auth/entra_id/redirect'
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  
    const provider = localStorage.getItem('login_provider') as 'local' | 'microsoft' | null
    localStorage.removeItem('login_provider')
  
    if (provider === 'microsoft') {
      const postLogoutRedirectUri = encodeURIComponent('http://localhost:5173/login')
      const microsoftLogoutUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${postLogoutRedirectUri}`
      window.location.href = microsoftLogoutUrl
    } else {
      window.location.href = '/login'
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    loginWithEntraId,
    logout,
  }
}
