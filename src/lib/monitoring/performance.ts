/**
 * Système de monitoring des performances
 * Collecte et envoie les métriques de performance Web Vitals
 */

import { addBreadcrumb, captureMessage } from './sentry';

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

/**
 * Seuils pour les Web Vitals
 * @see https://web.dev/vitals/
 */
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },      // Largest Contentful Paint
  FID: { good: 100, poor: 300 },        // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },       // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 },      // First Contentful Paint
  TTFB: { good: 800, poor: 1800 },      // Time to First Byte
  INP: { good: 200, poor: 500 },        // Interaction to Next Paint
};

/**
 * Évalue la performance d'une métrique
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Envoie une métrique de performance
 */
export function sendToAnalytics(metric: PerformanceMetric) {
  // Log en développement
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Performance Metric:`, {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
    });
  }

  // Ajouter un breadcrumb Sentry
  addBreadcrumb({
    category: 'performance',
    message: `${metric.name}: ${Math.round(metric.value)}ms`,
    level: metric.rating === 'poor' ? 'warning' : 'info',
    data: {
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    },
  });

  // Alerter si la performance est mauvaise
  if (metric.rating === 'poor') {
    captureMessage(
      `Performance dégradée: ${metric.name} = ${Math.round(metric.value)}ms`,
      'warning'
    );
  }

  // Envoyer à Google Analytics si disponible
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
    });
  }
}

/**
 * Collecte les métriques Web Vitals
 */
export async function reportWebVitals(metric: any) {
  const performanceMetric: PerformanceMetric = {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
  };

  sendToAnalytics(performanceMetric);
}

/**
 * Mesure le temps de chargement d'une ressource
 */
export function measureResourceTiming(resourceName: string) {
  if (typeof window === 'undefined' || !window.performance) return;

  const entries = performance.getEntriesByName(resourceName, 'resource');
  if (entries.length === 0) return;

  const entry = entries[0] as PerformanceResourceTiming;
  
  const timing = {
    dns: entry.domainLookupEnd - entry.domainLookupStart,
    tcp: entry.connectEnd - entry.connectStart,
    request: entry.responseStart - entry.requestStart,
    response: entry.responseEnd - entry.responseStart,
    total: entry.duration,
  };

  console.log(`⏱️  Resource Timing: ${resourceName}`, timing);
  
  return timing;
}

/**
 * Mesure le temps d'exécution d'une fonction
 */
export async function measureFunction<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<T> {
  const start = performance.now();
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    console.log(`⏱️  ${name}: ${Math.round(duration)}ms`);
    
    addBreadcrumb({
      category: 'performance',
      message: `${name} completed`,
      data: { duration: Math.round(duration) },
    });
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    
    addBreadcrumb({
      category: 'performance',
      message: `${name} failed`,
      level: 'error',
      data: { duration: Math.round(duration) },
    });
    
    throw error;
  }
}

/**
 * Observe les mutations du DOM pour détecter les changements de layout
 */
export function observeLayoutShifts(callback: (shifts: number) => void) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  let cumulativeScore = 0;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if ((entry as any).hadRecentInput) continue;
      
      cumulativeScore += (entry as any).value;
      callback(cumulativeScore);
    }
  });

  observer.observe({ type: 'layout-shift', buffered: true });

  return () => observer.disconnect();
}

/**
 * Mesure le temps de rendu d'un composant React
 */
export function useRenderTime(componentName: string) {
  if (typeof window === 'undefined') return;

  const renderStart = performance.now();

  return () => {
    const renderTime = performance.now() - renderStart;
    
    if (renderTime > 16) { // Plus de 16ms = problème de performance
      console.warn(`⚠️  Slow render: ${componentName} took ${Math.round(renderTime)}ms`);
      
      addBreadcrumb({
        category: 'performance',
        message: `Slow render: ${componentName}`,
        level: 'warning',
        data: { renderTime: Math.round(renderTime) },
      });
    }
  };
}

/**
 * Collecte les métriques de navigation
 */
export function collectNavigationMetrics() {
  if (typeof window === 'undefined' || !window.performance) return;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (!navigation) return;

  const metrics = {
    // Temps de chargement de la page
    pageLoad: navigation.loadEventEnd - navigation.fetchStart,
    
    // Temps de réponse du serveur
    serverResponse: navigation.responseEnd - navigation.requestStart,
    
    // Temps de traitement du DOM
    domProcessing: navigation.domComplete - navigation.domInteractive,
    
    // Temps de chargement des ressources
    resourceLoad: navigation.loadEventEnd - navigation.domContentLoadedEventEnd,
    
    // Temps total
    total: navigation.loadEventEnd - navigation.fetchStart,
  };

  console.log('📊 Navigation Metrics:', metrics);
  
  return metrics;
}

/**
 * Détecte les connexions lentes
 */
export function detectSlowConnection(): boolean {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return false;
  }

  const connection = (navigator as any).connection;
  
  // Connexion lente si effectiveType est '2g' ou '3g'
  if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
    return true;
  }

  // Connexion lente si saveData est activé
  if (connection.saveData) {
    return true;
  }

  return false;
}

/**
 * Adapte la qualité en fonction de la connexion
 */
export function getAdaptiveQuality() {
  const isSlowConnection = detectSlowConnection();
  
  return {
    imageQuality: isSlowConnection ? 'low' : 'high',
    videoQuality: isSlowConnection ? '480p' : '1080p',
    prefetch: !isSlowConnection,
    lazyLoad: isSlowConnection,
  };
}

