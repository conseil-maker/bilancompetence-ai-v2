import { NextRequest, NextResponse } from 'next/server'
import { withAuth, handleApiError } from '@/lib/api-auth'

/**
 * GET /api/profile
 * Récupère le profil de l'utilisateur connecté
 */
export const GET = withAuth(async (req: NextRequest, { user, supabase }) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Profil non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    return handleApiError(error)
  }
})

/**
 * PATCH /api/profile
 * Met à jour le profil de l'utilisateur connecté
 */
export const PATCH = withAuth(async (req: NextRequest, { user, supabase }) => {
  try {
    const body = await req.json()
    const { full_name, phone, avatar_url, bio } = body

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        full_name,
        phone,
        avatar_url,
        bio,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du profil' },
        { status: 500 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    return handleApiError(error)
  }
})

