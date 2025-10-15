/**
 * Service Worker pour BilanCompetence.AI
 * Gère le cache offline et les notifications push
 */

const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `bilancompetence-${CACHE_VERSION}`;

// Ressources à mettre en cache immédiatement
const PRECACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json',
];

// Stratégies de cache par type de ressource
const CACHE_STRATEGIES = {
  // Cache First: Pour les assets statiques
  cacheFirst: [
    /\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp|ico)$/,
    /\/_next\/static\//,
  ],
  
  // Network First: Pour les pages HTML et API
  networkFirst: [
    /\/api\//,
    /\/_next\/data\//,
  ],
  
  // Stale While Revalidate: Pour les images
  staleWhileRevalidate: [
    /\.(png|jpg|jpeg|gif|webp|svg)$/,
  ],
};

/**
 * Installation du Service Worker
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Précache des ressources');
      return cache.addAll(PRECACHE_URLS);
    }).then(() => {
      console.log('[SW] Installation terminée');
      return self.skipWaiting();
    })
  );
});

/**
 * Activation du Service Worker
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  
  event.waitUntil(
    // Nettoyer les anciens caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('bilancompetence-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Suppression du cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activation terminée');
      return self.clients.claim();
    })
  );
});

/**
 * Interception des requêtes
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') {
    return;
  }
  
  // Ignorer les requêtes vers d'autres domaines (sauf les assets)
  if (url.origin !== self.location.origin && !url.pathname.match(/\.(js|css|woff2?|ttf|eot)$/)) {
    return;
  }
  
  // Déterminer la stratégie de cache
  const strategy = getStrategy(url.pathname);
  
  event.respondWith(
    handleRequest(request, strategy)
  );
});

/**
 * Détermine la stratégie de cache pour une URL
 */
function getStrategy(pathname) {
  // Cache First
  for (const pattern of CACHE_STRATEGIES.cacheFirst) {
    if (pattern.test(pathname)) {
      return 'cacheFirst';
    }
  }
  
  // Network First
  for (const pattern of CACHE_STRATEGIES.networkFirst) {
    if (pattern.test(pathname)) {
      return 'networkFirst';
    }
  }
  
  // Stale While Revalidate
  for (const pattern of CACHE_STRATEGIES.staleWhileRevalidate) {
    if (pattern.test(pathname)) {
      return 'staleWhileRevalidate';
    }
  }
  
  // Par défaut: Network First
  return 'networkFirst';
}

/**
 * Gère une requête selon la stratégie
 */
async function handleRequest(request, strategy) {
  switch (strategy) {
    case 'cacheFirst':
      return cacheFirst(request);
    
    case 'networkFirst':
      return networkFirst(request);
    
    case 'staleWhileRevalidate':
      return staleWhileRevalidate(request);
    
    default:
      return fetch(request);
  }
}

/**
 * Stratégie Cache First
 * Essaie le cache d'abord, puis le réseau
 */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    
    // Mettre en cache si la réponse est valide
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Erreur de réseau:', error);
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Stratégie Network First
 * Essaie le réseau d'abord, puis le cache
 */
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const response = await fetch(request);
    
    // Mettre en cache si la réponse est valide
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Erreur de réseau, utilisation du cache:', error);
    
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Page offline de secours
    if (request.mode === 'navigate') {
      const offlinePage = await cache.match('/offline');
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Stratégie Stale While Revalidate
 * Retourne le cache immédiatement et met à jour en arrière-plan
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  // Récupérer depuis le réseau en arrière-plan
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  // Retourner le cache immédiatement s'il existe
  return cached || fetchPromise || new Response('Offline', { status: 503 });
}

/**
 * Gestion des messages
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urls);
      })
    );
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        return caches.open(CACHE_NAME);
      })
    );
  }
});

/**
 * Gestion des notifications push
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const title = data.title || 'BilanCompetence.AI';
  const options = {
    body: data.body || '',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    data: data.data || {},
    actions: data.actions || [],
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/**
 * Gestion des clics sur les notifications
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Chercher une fenêtre ouverte
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

/**
 * Gestion de la synchronisation en arrière-plan
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

/**
 * Synchronise les données en arrière-plan
 */
async function syncData() {
  try {
    // Récupérer les données en attente depuis IndexedDB
    // et les envoyer au serveur
    console.log('[SW] Synchronisation des données...');
    
    // TODO: Implémenter la logique de synchronisation
    
    return Promise.resolve();
  } catch (error) {
    console.error('[SW] Erreur de synchronisation:', error);
    return Promise.reject(error);
  }
}

console.log('[SW] Service Worker chargé');

