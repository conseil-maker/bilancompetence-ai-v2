import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzePersonality, TestResults } from '@/services/ai/personality-analyzer'

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
    const body = await request.json() as {
      testResults: TestResults
      additionalContext?: string
    }

    if (!body.testResults) {
      return NextResponse.json(
        { error: 'No test results provided' },
        { status: 400 }
      )
    }

    const analysis = await analyzePersonality(
      body.testResults,
      body.additionalContext
    )

    return NextResponse.json({
      success: true,
      data: analysis,
    })
  } catch (error) {
    console.error('Error in personality analysis API:', error)
    return NextResponse.json(
      { error: 'Failed to analyze personality' },
      { status: 500 }
    )
  }
}

