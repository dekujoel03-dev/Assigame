import type { ApiAuthResponse, ApiUtilisateur } from '@/types/api'
import type { LoginFormData, RegisterFormData, User } from '@/types'
import { mapUser } from '@/lib/mappers'
import api from '@/services/api'

const TOKEN_KEY = 'assigame_token'
const USER_KEY = 'assigame_user'

export const authService = {
  async login(data: LoginFormData): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiAuthResponse>('/auth/login', {
      email: data.email.trim().toLowerCase(),
      password: data.password,
    })

    const user = mapUser(response.data.user)
    localStorage.setItem(TOKEN_KEY, response.data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return { user, token: response.data.token }
  },

  async register(data: RegisterFormData): Promise<{ user: User; token: string }> {
    const payload = {
      nom_utilisateur: data.nom.trim(),
      prenom_utilisateur: data.prenom.trim(),
      sexe_utilisateur: 'M',
      telephone_utilisateur: data.telephone.trim(),
      mail_utilisateur: data.email.trim().toLowerCase(),
      password_utilisateur: data.password,
      residence_utilisateur: data.ville.trim(),
    }

    await api.post<ApiUtilisateur>('/users/add', payload)
    return this.login({ email: data.email, password: data.password })
  },

  async restoreSession(): Promise<User | null> {
    if (!this.isAuthenticated()) return null
    try {
      const { data } = await api.get<ApiUtilisateur>('/auth/me')
      const user = mapUser(data)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      return user
    } catch {
      this.logout()
      return null
    }
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(USER_KEY)
    if (!stored) return null
    try {
      return JSON.parse(stored) as User
    } catch {
      localStorage.removeItem(USER_KEY)
      return null
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY)
  },
}
