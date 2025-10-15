import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { UserRole } from '@/types/database.types'

// Configuration des routes protégées par rôle
const ROLE_ROUTES: Record<UserRole, string[]> = {
  admin: ['/admin', '/admin-dashboard'],
  consultant: ['/consultant', '/consultant-dashboard'],
  beneficiaire: ['/beneficiaire', '/beneficiaire-dashboard'],
}

// Routes publiques (accessibles sans authentification)
const PUBLIC_ROUTES = ['/', '/login', '/register', '/contact', '/tarifs', '/a-propos']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Vérifier si la route est publique
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    path === route || path.startsWith(`${route}/`)
  )

  // Si la route est publique, laisser passer
  if (isPublicRoute) {
    // Redirection si déjà connecté et tente d'accéder à login/register
    if ((path === '/login' || path === '/register') && user) {
      // Récupérer le profil pour connaître le rôle
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role) {
        const dashboardPath = getDashboardPath(profile.role as UserRole)
        return NextResponse.redirect(new URL(dashboardPath, request.url))
      }
    }
    return supabaseResponse
  }

  // Si pas d'utilisateur connecté, rediriger vers login
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  // Récupérer le profil de l'utilisateur pour vérifier son rôle
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    // En cas d'erreur, déconnecter et rediriger vers login
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const userRole = profile.role as UserRole

  // Vérifier si l'utilisateur a accès à cette route
  const hasAccess = checkRouteAccess(path, userRole)

  if (!hasAccess) {
    // Rediriger vers le dashboard approprié si accès refusé
    const dashboardPath = getDashboardPath(userRole)
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  return supabaseResponse
}

/**
 * Vérifie si un utilisateur avec un rôle donné a accès à une route
 */
function checkRouteAccess(path: string, userRole: UserRole): boolean {
  // Admin a accès à tout
  if (userRole === 'admin') {
    return true
  }

  // Vérifier si le chemin correspond aux routes autorisées pour ce rôle
  const allowedRoutes = ROLE_ROUTES[userRole]
  return allowedRoutes.some(route => path.startsWith(route))
}

/**
 * Retourne le chemin du dashboard approprié selon le rôle
 */
function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin-dashboard'
    case 'consultant':
      return '/consultant-dashboard'
    case 'beneficiaire':
      return '/beneficiaire-dashboard'
    default:
      return '/'
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes - handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

