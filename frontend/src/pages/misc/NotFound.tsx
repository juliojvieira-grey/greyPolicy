import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-xl mt-4 text-gray-700">Ops! Página não encontrada.</p>
      <p className="text-gray-500 mt-2">A URL acessada não existe ou foi removida.</p>

      <div className="mt-6 space-x-4">
        <Link
          to="/dashboard"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Ir para o Dashboard
        </Link>

        <Link
          to="/login"
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
        >
          Ir para o Login
        </Link>
      </div>
    </div>
  )
}
