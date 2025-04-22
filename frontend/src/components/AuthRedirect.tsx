import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }, [])

  return null
}
