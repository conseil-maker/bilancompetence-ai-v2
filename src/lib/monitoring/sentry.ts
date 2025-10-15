import * as Sentry from '@sentry/nextjs';

/**
 * Configuration de Sentry pour le monitoring des erreurs
 * 
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.NODE_ENV || 'development';
const RELEASE = process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0';

export const initSentry = () => {
  if (!SENTRY_DSN) {
    console.warn('⚠️  Sentry DSN non configuré. Le monitoring des erreurs est désactivé.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    release: `bilancompetence-ai@${RELEASE}`,
    
    // Taux d'échantillonnage des traces de performance
    tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
    
    // Taux d'échantillonnage des sessions
    replaysSessionSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
    
    // Taux d'échantillonnage des sessions avec erreurs
    replaysOnErrorSampleRate: 1.0,
    
    // Intégrations
    integrations: [
      new Sentry.BrowserTracing({
        // Traçage des requêtes fetch et XHR
        traceFetch: true,
        traceXHR: true,
        
        // Routes à tracer
        tracingOrigins: [
          'localhost',
          /^\//,
          /^https:\/\/.*\.vercel\.app/,
        ],
      }),
      new Sentry.Replay({
        // Masquer les données sensibles
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    
    // Filtrage des erreurs
    beforeSend(event, hint) {
      // Ignorer les erreurs de développement
      if (ENVIRONMENT === 'development') {
        return null;
      }
      
      // Ignorer les erreurs réseau communes
      const error = hint.originalException;
      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message);
        if (
          message.includes('Network request failed') ||
          message.includes('Failed to fetch') ||
          message.includes('NetworkError')
        ) {
          return null;
        }
      }
      
      return event;
    },
    
    // Ignorer certaines erreurs
    ignoreErrors: [
      // Erreurs du navigateur
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      
      // Erreurs d'extensions de navigateur
      /extensions\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i,
      
      // Erreurs de script tiers
      'Script error.',
    ],
    
    // Ignorer certaines URLs
    denyUrls: [
      // Extensions de navigateur
      /extensions\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i,
      
      // Scripts tiers
      /google-analytics\.com/i,
      /googletagmanager\.com/i,
    ],
  });
};

/**
 * Capture une erreur dans Sentry
 */
export const captureError = (error: Error, context?: Record<string, any>) => {
  if (context) {
    Sentry.setContext('additional', context);
  }
  Sentry.captureException(error);
};

/**
 * Capture un message dans Sentry
 */
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level);
};

/**
 * Définit l'utilisateur actuel pour Sentry
 */
export const setUser = (user: { id: string; email?: string; username?: string } | null) => {
  Sentry.setUser(user);
};

/**
 * Ajoute un breadcrumb (fil d'Ariane) pour le débogage
 */
export const addBreadcrumb = (breadcrumb: {
  message: string;
  category?: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, any>;
}) => {
  Sentry.addBreadcrumb(breadcrumb);
};

/**
 * Démarre une transaction de performance
 */
export const startTransaction = (name: string, op: string) => {
  return Sentry.startTransaction({ name, op });
};

/**
 * Wrapper pour les fonctions API avec monitoring
 */
export const withSentryAPI = <T extends (...args: any[]) => any>(
  handler: T,
  options?: { name?: string }
): T => {
  return (async (...args: Parameters<T>) => {
    const transaction = startTransaction(
      options?.name || 'API Handler',
      'http.server'
    );
    
    try {
      const result = await handler(...args);
      transaction.setStatus('ok');
      return result;
    } catch (error) {
      transaction.setStatus('internal_error');
      captureError(error as Error);
      throw error;
    } finally {
      transaction.finish();
    }
  }) as T;
};

/**
 * Hook pour le monitoring des performances des composants
 */
export const usePerformanceMonitoring = (componentName: string) => {
  if (typeof window === 'undefined') return;
  
  const transaction = startTransaction(`Component: ${componentName}`, 'react.render');
  
  return () => {
    transaction.finish();
  };
};

export default Sentry;

