import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession, BilanPaymentData } from '@/services/stripe/payment'

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
    const body = await request.json() as BilanPaymentData

    if (!body.bilanId || !body.userId || !body.formule) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const session = await createCheckoutSession(body)

    return NextResponse.json({
      success: true,
      data: session,
    })
  } catch (error) {
    console.error('Error in create checkout API:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

