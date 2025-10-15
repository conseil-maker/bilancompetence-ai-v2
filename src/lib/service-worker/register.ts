/**
 * Enregistrement et gestion du Service Worker
 */

export interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

/**
 * Enregistre le Service Worker
 */
export async function registerServiceWorker(config: ServiceWorkerConfig = {}) {
  // Vérifier le support
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('⚠️  Service Worker non supporté');
    return null;
  }

  // Enregistrer uniquement en production
  if (process.env.NODE_ENV !== 'production') {
    console.log('ℹ️  Service Worker désactivé en développement');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('✅ Service Worker enregistré:', registration.scope);

    // Vérifier les mises à jour
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Nouvelle version disponible
          console.log('🔄 Nouvelle version disponible');
          config.onUpdate?.(registration);
        } else if (newWorker.state === 'activated') {
          // Service Worker activé
          console.log('✅ Service Worker activé');
          config.onSuccess?.(registration);
        }
      });
    });

    // Écouter les messages du Service Worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('📨 Message du Service Worker:', event.data);
    });

    // Vérifier les mises à jour toutes les heures
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);

    return registration;
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement du Service Worker:', error);
    config.onError?.(error as Error);
    return null;
  }
}

/**
 * Désenregistre le Service Worker
 */
export async function unregisterServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const success = await registration.unregister();
    
    if (success) {
      console.log('✅ Service Worker désenregistré');
    }
    
    return success;
  } catch (error) {
    console.error('❌ Erreur lors du désenregistrement du Service Worker:', error);
    return false;
  }
}

/**
 * Force la mise à jour du Service Worker
 */
export async function updateServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    console.log('🔄 Mise à jour du Service Worker demandée');
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du Service Worker:', error);
  }
}

/**
 * Active le nouveau Service Worker immédiatement
 */
export function skipWaiting() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });
}

/**
 * Met en cache des URLs spécifiques
 */
export function cacheUrls(urls: string[]) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.controller?.postMessage({
    type: 'CACHE_URLS',
    urls,
  });
}

/**
 * Vide le cache du Service Worker
 */
export function clearCache() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.controller?.postMessage({ type: 'CLEAR_CACHE' });
}

/**
 * Vérifie si l'application est en mode offline
 */
export function isOffline(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return !navigator.onLine;
}

/**
 * Hook React pour gérer le Service Worker
 */
export function useServiceWorker(config: ServiceWorkerConfig = {}) {
  const [isOnline, setIsOnline] = React.useState(true);
  const [needsUpdate, setNeedsUpdate] = React.useState(false);
  const [registration, setRegistration] = React.useState<ServiceWorkerRegistration | null>(null);

  React.useEffect(() => {
    // Enregistrer le Service Worker
    registerServiceWorker({
      onSuccess: (reg) => {
        setRegistration(reg);
        config.onSuccess?.(reg);
      },
      onUpdate: (reg) => {
        setNeedsUpdate(true);
        config.onUpdate?.(reg);
      },
      onError: config.onError,
    });

    // Écouter les changements de connexion
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const update = React.useCallback(() => {
    skipWaiting();
    window.location.reload();
  }, []);

  return {
    isOnline,
    needsUpdate,
    registration,
    update,
    skipWaiting,
    cacheUrls,
    clearCache,
  };
}

// Import React pour le hook
import React from 'react';

export default registerServiceWorker;

