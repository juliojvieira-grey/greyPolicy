interface EntraIdDriver {
  redirect(): Promise<void>
  accessDenied(): boolean
  hasError(): boolean
  getError(): string
  user(): Promise<{
    email: string
    name: string
    id: string
    token: any
    raw: any
  }>
}

declare module '@adonisjs/ally/types' {
  interface AllyDriversList {
    entra_id: EntraIdDriver
  }
}
