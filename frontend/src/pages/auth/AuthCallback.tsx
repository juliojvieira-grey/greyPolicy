import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AuthCallback() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const userEncoded = params.get('user')

    if (!token || !userEncoded) {
      alert('Erro ao autenticar. Dados ausentes.')
      return
    }

    try {
      const user = JSON.parse(decodeURIComponent(userEncoded))
      if (!user?.id || !user?.email) {
        throw new Error('Usuário inválido')
      }

      login(token, user)
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      alert('Erro ao processar login')
    }
  }, [location.search])

  return <p className="p-4 text-center">Autenticando...</p>
}
