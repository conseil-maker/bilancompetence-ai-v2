import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, BilanPaymentData } from '@/services/stripe/payment'

export async function POST(request: NextRequest) {
  try {
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

