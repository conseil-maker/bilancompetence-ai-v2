import { UserRole } from './database.types'

export interface User {
  id: string
  email: string
  role: UserRole
  full_name?: string | null
  phone?: string | null
  avatar_url?: string | null
  bio?: string | null
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  full_name: string
  phone?: string
  role?: UserRole
}

export interface ResetPasswordData {
  email: string
}

export interface UpdatePasswordData {
  password: string
}

export interface UpdateProfileData {
  full_name?: string
  phone?: string
  avatar_url?: string
  bio?: string
}

