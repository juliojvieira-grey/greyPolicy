import User from '#models/user'

export default function isAdmin(user: User | null | undefined): boolean {
  return !!user && user.role === 'admin'
}
