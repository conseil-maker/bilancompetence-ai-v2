'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/providers/AuthProvider'
import type { UserRole } from '@/types/database.types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  allowedRoles,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Si pas authentifié, rediriger vers login
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      // Si des rôles sont spécifiés, vérifier que l'utilisateur a le bon rôle
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Rediriger vers le dashboard approprié selon le rôle
        switch (user.role) {
          case 'beneficiaire':
            router.push('/beneficiaire/dashboard')
            break
          case 'consultant':
            router.push('/consultant/dashboard')
            break
          case 'admin':
            router.push('/admin/dashboard')
            break
          default:
            router.push('/')
        }
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, redirectTo, router])

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Si pas authentifié ou mauvais rôle, ne rien afficher (redirection en cours)
  if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
    return null
  }

  return <>{children}</>
}

