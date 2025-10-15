import { NextRequest, NextResponse } from 'next/server'
import { withAuth, handleApiError } from '@/lib/api-auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/bilans/[id]
 * Récupère un bilan spécifique
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = await params
  
  return withAuth(async (req: NextRequest, { user, supabase }) => {
    try {
      const { data: bilan, error } = await supabase
        .from('bilans')
        .select(`
          *,
          beneficiaire:profiles!beneficiaire_id(*),
          consultant:profiles!consultant_id(*),
          documents(*),
          messages(*)
        `)
        .eq('id', id)
        .single()

      if (error || !bilan) {
        return NextResponse.json(
          { error: 'Bilan non trouvé' },
          { status: 404 }
        )
      }

      // Vérifier les permissions
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const canAccess = 
        profile?.role === 'admin' ||
        bilan.consultant_id === user.id ||
        bilan.beneficiaire_id === user.id

      if (!canAccess) {
        return NextResponse.json(
          { error: 'Accès refusé' },
          { status: 403 }
        )
      }

      return NextResponse.json({ bilan })
    } catch (error) {
      return handleApiError(error)
    }
  })(req, { params })
}

/**
 * PATCH /api/bilans/[id]
 * Met à jour un bilan
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id } = await params
  
  return withAuth(async (req: NextRequest, { user, supabase }) => {
    try {
      // Vérifier les permissions
      const { data: bilan } = await supabase
        .from('bilans')
        .select('*, profiles!consultant_id(role)')
        .eq('id', id)
        .single()

      if (!bilan) {
        return NextResponse.json(
          { error: 'Bilan non trouvé' },
          { status: 404 }
        )
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const canUpdate = 
        profile?.role === 'admin' ||
        bilan.consultant_id === user.id

      if (!canUpdate) {
        return NextResponse.json(
          { error: 'Vous n\'avez pas la permission de modifier ce bilan' },
          { status: 403 }
        )
      }

      const body = await req.json()
      const { statut, date_debut, date_fin } = body

      const { data: updatedBilan, error } = await supabase
        .from('bilans')
        .update({
          statut,
          date_debut,
          date_fin,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Erreur lors de la mise à jour du bilan' },
          { status: 500 }
        )
      }

      return NextResponse.json({ bilan: updatedBilan })
    } catch (error) {
      return handleApiError(error)
    }
  })(req, { params })
}

/**
 * DELETE /api/bilans/[id]
 * Supprime un bilan (admin uniquement)
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { id } = await params
  
  return withAuth(async (req: NextRequest, { user, supabase }) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        return NextResponse.json(
          { error: 'Seuls les administrateurs peuvent supprimer des bilans' },
          { status: 403 }
        )
      }

      const { error } = await supabase
        .from('bilans')
        .delete()
        .eq('id', id)

      if (error) {
        return NextResponse.json(
          { error: 'Erreur lors de la suppression du bilan' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    } catch (error) {
      return handleApiError(error)
    }
  })(req, { params })
}

