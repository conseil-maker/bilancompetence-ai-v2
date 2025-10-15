/**
 * Fichier d'instrumentation Next.js
 * Utilisé pour initialiser Sentry et autres outils de monitoring
 * 
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Initialisation côté serveur
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initSentry } = await import('./src/lib/monitoring/sentry');
    initSentry();
  }

  // Initialisation côté Edge Runtime
  if (process.env.NEXT_RUNTIME === 'edge') {
    const { initSentry } = await import('./src/lib/monitoring/sentry');
    initSentry();
  }
}

