import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { UserRole } from '@/types/database.types'

/**
 * Crée un client Supabase pour les API routes
 */
export async function createApiClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

/**
 * Vérifie si l'utilisateur est authentifié
 */
export async function requireAuth() {
  const supabase = await createApiClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      error: NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      ),
      user: null,
      supabase,
    }
  }

  return { user, supabase, error: null }
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const { user, supabase, error } = await requireAuth()

  if (error) {
    return { error, user: null, profile: null, supabase }
  }

  // Récupérer le profil pour vérifier le rôle
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  if (profileError || !profile) {
    return {
      error: NextResponse.json(
        { error: 'Profil non trouvé' },
        { status: 404 }
      ),
      user: null,
      profile: null,
      supabase,
    }
  }

  if (!allowedRoles.includes(profile.role as UserRole)) {
    return {
      error: NextResponse.json(
        { error: 'Permission refusée' },
        { status: 403 }
      ),
      user: null,
      profile: null,
      supabase,
    }
  }

  return { user, profile, supabase, error: null }
}

/**
 * Wrapper pour les API routes qui nécessitent une authentification
 */
export function withAuth(
  handler: (req: NextRequest, context: { user: any; supabase: any }) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const { user, supabase, error } = await requireAuth()

    if (error) {
      return error
    }

    return handler(req, { user, supabase })
  }
}

/**
 * Wrapper pour les API routes qui nécessitent un rôle spécifique
 */
export function withRole(
  allowedRoles: UserRole[],
  handler: (req: NextRequest, context: { user: any; profile: any; supabase: any }) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const { user, profile, supabase, error } = await requireRole(allowedRoles)

    if (error) {
      return error
    }

    return handler(req, { user, profile, supabase })
  }
}

/**
 * Utilitaire pour gérer les erreurs dans les API routes
 */
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: 'Une erreur inattendue s\'est produite' },
    { status: 500 }
  )
}

/**
 * Utilitaire pour valider le corps de la requête
 */
export async function validateRequestBody<T>(
  req: NextRequest,
  schema: { parse: (data: unknown) => T }
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const body = await req.json()
    const data = schema.parse(body)
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: NextResponse.json(
        { error: 'Données invalides', details: error },
        { status: 400 }
      ),
    }
  }
}

