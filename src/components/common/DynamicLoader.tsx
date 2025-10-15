'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import { useRenderTime } from '@/lib/monitoring/performance';

/**
 * Options pour le chargement dynamique
 */
interface DynamicLoaderOptions {
  loading?: React.ComponentType;
  error?: React.ComponentType<{ error: Error; retry: () => void }>;
  delay?: number;
  timeout?: number;
  ssr?: boolean;
}

/**
 * Composant de chargement par défaut
 */
const DefaultLoading: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

/**
 * Composant d'erreur par défaut
 */
const DefaultError: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-red-600 mb-4">
      <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
    <p className="text-gray-600 mb-4 text-sm">{error.message}</p>
    <button
      onClick={retry}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Réessayer
    </button>
  </div>
);

/**
 * Wrapper pour gérer les erreurs de chargement
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ComponentType<{ error: Error; retry: () => void }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dynamic component loading error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.fallback;
      return <Fallback error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

/**
 * Charge un composant de manière dynamique avec code splitting
 * 
 * @example
 * const HeavyComponent = dynamicLoader(() => import('./HeavyComponent'), {
 *   loading: CustomLoader,
 *   ssr: false
 * });
 */
export function dynamicLoader<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: DynamicLoaderOptions = {}
): ComponentType<P> {
  const {
    loading: LoadingComponent = DefaultLoading,
    error: ErrorComponent = DefaultError,
    ssr = true,
  } = options;

  // Créer le composant lazy
  const LazyComponent = lazy(importFn);

  // Wrapper avec monitoring
  const DynamicComponent: React.FC<P> = (props) => {
    const cleanup = useRenderTime('DynamicComponent');

    React.useEffect(() => {
      return cleanup;
    }, [cleanup]);

    // Désactiver SSR si nécessaire
    if (!ssr && typeof window === 'undefined') {
      return null;
    }

    return (
      <ErrorBoundary fallback={ErrorComponent}>
        <Suspense fallback={<LoadingComponent />}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };

  DynamicComponent.displayName = 'DynamicComponent';

  return DynamicComponent;
}

/**
 * Précharge un composant dynamique
 */
export function preloadComponent(importFn: () => Promise<any>) {
  if (typeof window !== 'undefined') {
    // Précharger uniquement côté client
    importFn().catch(console.error);
  }
}

/**
 * Hook pour précharger un composant au survol
 */
export function usePreloadOnHover(importFn: () => Promise<any>) {
  const [isPreloaded, setIsPreloaded] = React.useState(false);

  const handleMouseEnter = React.useCallback(() => {
    if (!isPreloaded) {
      preloadComponent(importFn);
      setIsPreloaded(true);
    }
  }, [importFn, isPreloaded]);

  return { onMouseEnter: handleMouseEnter };
}

/**
 * Hook pour précharger un composant après un délai
 */
export function usePreloadAfterDelay(importFn: () => Promise<any>, delay: number = 2000) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      preloadComponent(importFn);
    }, delay);

    return () => clearTimeout(timer);
  }, [importFn, delay]);
}

/**
 * Composants dynamiques pré-configurés pour l'application
 */

// Dashboard consultant (lourd)
export const DynamicConsultantDashboard = dynamicLoader(
  () => import('@/app/(consultant)/consultant-dashboard/page'),
  { ssr: false }
);

// Dashboard bénéficiaire (lourd)
export const DynamicBeneficiaireDashboard = dynamicLoader(
  () => import('@/app/(beneficiaire)/beneficiaire-dashboard/page'),
  { ssr: false }
);

// Dashboard admin (lourd)
export const DynamicAdminDashboard = dynamicLoader(
  () => import('@/app/(admin)/admin-dashboard/page'),
  { ssr: false }
);

// Éditeur de documents (très lourd)
export const DynamicDocumentEditor = dynamicLoader(
  () => import('@/components/documents/DocumentEditor').catch(() => ({ default: () => null })),
  { ssr: false }
);

// Visualisations de données (lourd)
export const DynamicDataVisualization = dynamicLoader(
  () => import('@/components/analytics/DataVisualization').catch(() => ({ default: () => null })),
  { ssr: false }
);

// Calendrier (moyen)
export const DynamicCalendar = dynamicLoader(
  () => import('@/components/calendar/Calendar').catch(() => ({ default: () => null })),
  { ssr: false }
);

export default dynamicLoader;

