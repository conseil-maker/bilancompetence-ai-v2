import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getJobRecommendations, RecommendationInput } from '@/services/ai/job-recommender'

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const body = await request.json() as RecommendationInput

    if (!body.competences || !body.experience || !body.interets || !body.valeurs) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const recommendations = await getJobRecommendations(body)

    return NextResponse.json({
      success: true,
      data: recommendations,
    })
  } catch (error) {
    console.error('Error in job recommendations API:', error)
    return NextResponse.json(
      { error: 'Failed to get job recommendations' },
      { status: 500 }
    )
  }
}

