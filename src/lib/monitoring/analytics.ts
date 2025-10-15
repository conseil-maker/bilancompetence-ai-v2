/**
 * Système d'analytics personnalisé
 * Collecte les événements utilisateur et les métriques business
 */

import { addBreadcrumb } from './sentry';

export interface AnalyticsEvent {
  name: string;
  category: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

export interface UserProperties {
  userId?: string;
  email?: string;
  role?: string;
  plan?: string;
  [key: string]: any;
}

/**
 * Classe principale pour l'analytics
 */
class Analytics {
  private userId: string | null = null;
  private userProperties: UserProperties = {};
  private sessionId: string;
  private isInitialized = false;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Initialise l'analytics
   */
  init(config?: { userId?: string; properties?: UserProperties }) {
    if (this.isInitialized) return;

    if (config?.userId) {
      this.identify(config.userId, config.properties);
    }

    this.isInitialized = true;
    this.trackPageView();

    // Écouter les changements de route
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => this.trackPageView());
    }

    console.log('✅ Analytics initialisé');
  }

  /**
   * Identifie un utilisateur
   */
  identify(userId: string, properties?: UserProperties) {
    this.userId = userId;
    this.userProperties = { ...this.userProperties, ...properties };

    // Envoyer à Google Analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('set', 'user_properties', {
        user_id: userId,
        ...properties,
      });
    }

    addBreadcrumb({
      category: 'user',
      message: `User identified: ${userId}`,
      data: properties,
    });
  }

  /**
   * Suit un événement
   */
  track(name: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name,
      category: this.getCategoryFromName(name),
      properties: {
        ...properties,
        userId: this.userId,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      },
      timestamp: Date.now(),
    };

    // Log en développement
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event);
    }

    // Envoyer à Google Analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', name, properties);
    }

    // Ajouter un breadcrumb Sentry
    addBreadcrumb({
      category: 'analytics',
      message: `Event: ${name}`,
      data: properties,
    });

    // Envoyer à l'API backend pour stockage
    this.sendToBackend(event);
  }

  /**
   * Suit une page vue
   */
  trackPageView(path?: string) {
    const pagePath = path || (typeof window !== 'undefined' ? window.location.pathname : '');
    
    this.track('page_view', {
      page_path: pagePath,
      page_title: typeof document !== 'undefined' ? document.title : '',
    });
  }

  /**
   * Suit un clic
   */
  trackClick(element: string, properties?: Record<string, any>) {
    this.track('click', {
      element,
      ...properties,
    });
  }

  /**
   * Suit une soumission de formulaire
   */
  trackFormSubmit(formName: string, properties?: Record<string, any>) {
    this.track('form_submit', {
      form_name: formName,
      ...properties,
    });
  }

  /**
   * Suit une erreur
   */
  trackError(error: Error, context?: Record<string, any>) {
    this.track('error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    });
  }

  /**
   * Suit une conversion
   */
  trackConversion(type: string, value?: number, properties?: Record<string, any>) {
    this.track('conversion', {
      conversion_type: type,
      conversion_value: value,
      ...properties,
    });
  }

  /**
   * Suit un événement business
   */
  trackBusiness(event: string, properties?: Record<string, any>) {
    this.track(`business_${event}`, properties);
  }

  /**
   * Événements spécifiques au bilan de compétences
   */
  
  // Inscription
  trackSignup(method: string) {
    this.track('signup', { method });
  }

  // Connexion
  trackLogin(method: string) {
    this.track('login', { method });
  }

  // Démarrage d'un bilan
  trackBilanStart(bilanId: string) {
    this.trackBusiness('bilan_start', { bilan_id: bilanId });
  }

  // Complétion d'une phase
  trackPhaseComplete(bilanId: string, phase: string) {
    this.trackBusiness('phase_complete', { bilan_id: bilanId, phase });
  }

  // Téléchargement de CV
  trackCVUpload(bilanId: string) {
    this.trackBusiness('cv_upload', { bilan_id: bilanId });
  }

  // Analyse de CV
  trackCVAnalysis(bilanId: string, success: boolean) {
    this.trackBusiness('cv_analysis', { bilan_id: bilanId, success });
  }

  // Recommandations de métiers
  trackJobRecommendations(bilanId: string, count: number) {
    this.trackBusiness('job_recommendations', { bilan_id: bilanId, count });
  }

  // Test de personnalité
  trackPersonalityTest(bilanId: string, testType: string) {
    this.trackBusiness('personality_test', { bilan_id: bilanId, test_type: testType });
  }

  // Rendez-vous pris
  trackAppointmentBooked(consultantId: string, date: string) {
    this.trackBusiness('appointment_booked', { consultant_id: consultantId, date });
  }

  // Paiement
  trackPayment(amount: number, method: string) {
    this.trackConversion('payment', amount, { method });
  }

  // Génération de document
  trackDocumentGenerated(bilanId: string, documentType: string) {
    this.trackBusiness('document_generated', { bilan_id: bilanId, document_type: documentType });
  }

  /**
   * Génère un ID de session
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Extrait la catégorie du nom de l'événement
   */
  private getCategoryFromName(name: string): string {
    if (name.startsWith('business_')) return 'business';
    if (name.includes('_')) return name.split('_')[0];
    return 'general';
  }

  /**
   * Envoie l'événement au backend
   */
  private async sendToBackend(event: AnalyticsEvent) {
    if (typeof window === 'undefined') return;

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }
}

// Instance singleton
export const analytics = new Analytics();

/**
 * Hook React pour l'analytics
 */
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackClick: analytics.trackClick.bind(analytics),
    trackFormSubmit: analytics.trackFormSubmit.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    identify: analytics.identify.bind(analytics),
  };
}

export default analytics;

