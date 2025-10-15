import { NextRequest, NextResponse } from 'next/server'
import { withRole, handleApiError, validateRequestBody } from '@/lib/api-auth'
import { bilanSchema } from '@/lib/validation'

/**
 * GET /api/bilans
 * Liste tous les bilans (admin et consultant uniquement)
 */
export const GET = withRole(['admin', 'consultant'], async (req: NextRequest, { profile, supabase }) => {
  try {
    let query = supabase.from('bilans').select(`
      *,
      beneficiaire:profiles!beneficiaire_id(*),
      consultant:profiles!consultant_id(*)
    `)

    // Si consultant, ne montrer que ses bilans
    if (profile.role === 'consultant') {
      query = query.eq('consultant_id', profile.id)
    }

    const { data: bilans, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des bilans' },
        { status: 500 }
      )
    }

    return NextResponse.json({ bilans })
  } catch (error) {
    return handleApiError(error)
  }
})

/**
 * POST /api/bilans
 * Crée un nouveau bilan (admin et consultant uniquement)
 */
export const POST = withRole(['admin', 'consultant'], async (req: NextRequest, { profile, supabase }) => {
  try {
    const { data: validatedData, error: validationError } = await validateRequestBody(
      req,
      bilanSchema
    )

    if (validationError) {
      return validationError
    }

    // Si consultant, s'assigner automatiquement
    const bilanData = {
      ...validatedData,
      consultant_id: profile.role === 'consultant' ? profile.id : validatedData.consultant_id,
      created_at: new Date().toISOString(),
    }

    const { data: bilan, error } = await supabase
      .from('bilans')
      .insert(bilanData)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du bilan' },
        { status: 500 }
      )
    }

    return NextResponse.json({ bilan }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
})

