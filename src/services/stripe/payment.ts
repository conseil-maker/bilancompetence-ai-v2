import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  clientSecret: string
}

export interface BilanPaymentData {
  bilanId: string
  userId: string
  formule: 'express' | 'standard' | 'premium'
  amount: number
  metadata?: Record<string, string>
}

const FORMULE_PRICES = {
  express: 120000, // 1200€ en centimes
  standard: 180000, // 1800€
  premium: 240000, // 2400€
}

export async function createPaymentIntent(
  data: BilanPaymentData
): Promise<PaymentIntent> {
  try {
    const amount = FORMULE_PRICES[data.formule]

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      metadata: {
        bilanId: data.bilanId,
        userId: data.userId,
        formule: data.formule,
        ...data.metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret!,
    }
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw new Error('Failed to create payment intent')
  }
}

export async function confirmPayment(paymentIntentId: string): Promise<boolean> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent.status === 'succeeded'
  } catch (error) {
    console.error('Error confirming payment:', error)
    return false
  }
}

export async function createCheckoutSession(data: BilanPaymentData): Promise<{
  sessionId: string
  url: string
}> {
  try {
    const amount = FORMULE_PRICES[data.formule]

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'sepa_debit'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Bilan de Compétences - Formule ${data.formule.charAt(0).toUpperCase() + data.formule.slice(1)}`,
              description: 'Accompagnement personnalisé avec IA',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/beneficiaire/paiement/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/beneficiaire/paiement/cancel`,
      metadata: {
        bilanId: data.bilanId,
        userId: data.userId,
        formule: data.formule,
      },
    })

    return {
      sessionId: session.id,
      url: session.url!,
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new Error('Failed to create checkout session')
  }
}

export async function createCustomer(data: {
  email: string
  name: string
  metadata?: Record<string, string>
}): Promise<string> {
  try {
    const customer = await stripe.customers.create({
      email: data.email,
      name: data.name,
      metadata: data.metadata,
    })

    return customer.id
  } catch (error) {
    console.error('Error creating customer:', error)
    throw new Error('Failed to create customer')
  }
}

export async function getPaymentHistory(customerId: string): Promise<any[]> {
  try {
    const charges = await stripe.charges.list({
      customer: customerId,
      limit: 100,
    })

    return charges.data
  } catch (error) {
    console.error('Error fetching payment history:', error)
    return []
  }
}

export async function refundPayment(
  paymentIntentId: string,
  amount?: number
): Promise<boolean> {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
    })

    return refund.status === 'succeeded'
  } catch (error) {
    console.error('Error processing refund:', error)
    return false
  }
}

