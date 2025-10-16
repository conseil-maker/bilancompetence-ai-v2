/**
 * Health Check API Route
 * 
 * Route de vérification de l'état de l'application.
 * Utilisée par Vercel et les outils de monitoring pour vérifier
 * que l'application fonctionne correctement.
 * 
 * @route GET /api/health
 * @returns {Object} État de l'application avec timestamp et version
 */

import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    // Vérifications basiques
    const checks = {
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
      environment: process.env.NODE_ENV || 'development',
      status: 'ok',
      services: {
        supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        gemini: !!process.env.GEMINI_API_KEY,
        stripe: !!process.env.STRIPE_SECRET_KEY,
        calendar: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      },
    };

    return NextResponse.json(checks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

