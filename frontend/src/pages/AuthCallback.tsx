import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function AuthCallback() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const userEncoded = params.get('user')

    if (!token || !userEncoded) {
      console.warn('Token ou user não encontrados na URL')
      alert('Erro ao autenticar. Dados ausentes.')
      setLoading(false)
      return
    }

    try {
      const user = JSON.parse(decodeURIComponent(userEncoded))

      if (!user?.id || !user?.email) {
        throw new Error('Usuário inválido')
      }

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      navigate('/dashboard')
    } catch (error) {
      console.error('Erro ao processar usuário:', error)
      alert('Erro ao autenticar. Dados inválidos.')
    } finally {
      setLoading(false)
    }
  }, [location.search, navigate])

  return <p>{loading ? 'Autenticando...' : 'Redirecionando...'}</p>
}
