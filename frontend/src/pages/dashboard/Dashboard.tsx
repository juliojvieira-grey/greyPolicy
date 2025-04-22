import { useAuth } from '../../hooks/useAuth'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Olá, {user?.fullName}</h1>
      <p className="text-gray-600 mt-2">Bem-vindo ao painel!</p>

      <button
        onClick={logout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
      >
        Sair
      </button>
    </div>
  )
}
