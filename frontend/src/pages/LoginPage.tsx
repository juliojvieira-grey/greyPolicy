// src/pages/Login.tsx
const Login = () => {
    const handleLogin = () => {
      window.location.href = 'http://localhost:3333/api/auth/entra_id/redirect'
    }
  
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Entrar com Microsoft
        </button>
      </div>
    )
  }
  
  export default Login
  