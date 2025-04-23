export function getAppUrl(): string {
    return import.meta.env.VITE_APP_URL || (
      import.meta.env.MODE === 'development'
        ? 'http://localhost:5173'
        : 'https://app.seudominio.com'
    )
  }
  
  export function getApiUrl(): string {
    return import.meta.env.VITE_API_URL || (
      import.meta.env.MODE === 'development'
        ? 'http://localhost:3333'
        : 'https://api.seudominio.com'
    )
  }
  