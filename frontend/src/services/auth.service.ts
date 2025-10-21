import api from './api'
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '@/types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials)
    return data
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', credentials)
    return data
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/auth/me')
    return data
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const { data } = await api.put<User>('/auth/profile', updates)
    return data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}
