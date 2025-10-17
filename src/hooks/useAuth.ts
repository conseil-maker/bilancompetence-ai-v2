'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, AuthState, LoginCredentials, RegisterData } from '@/types/auth.types'
import type { UserRole } from '@/types/database.types'

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const supabase = createClient()

  useEffect(() => {
    // Récupérer la session initiale
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Récupérer le profil complet
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          setAuthState({
            user: profile as User,
            isLoading: false,
            isAuthenticated: true,
          })
        }
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }

    getSession()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            setAuthState({
              user: profile as User,
              isLoading: false,
              isAuthenticated: true,
            })
          }
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials)
    
    if (error) throw error
    
    return data
  }

  const register = async (data: RegisterData) => {
    // 1. Créer l'utilisateur dans Supabase Auth avec les métadonnées
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone || null,
          role: data.role || 'beneficiaire',
        },
      },
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Erreur lors de la création du compte')

    // Le profil sera créé automatiquement par le trigger Supabase
    // Attendre un peu pour que le trigger s'exécute
    await new Promise(resolve => setTimeout(resolve, 1000))

    return authData
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    
    if (error) throw error
  }

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    
    if (error) throw error
  }

  const hasRole = (role: UserRole): boolean => {
    return authState.user?.role === role
  }

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return authState.user ? roles.includes(authState.user.role) : false
  }

  return {
    ...authState,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    hasRole,
    hasAnyRole,
  }
}

