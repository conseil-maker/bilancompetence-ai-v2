/**
 * Gestionnaire de cache avancé
 * Supporte le cache mémoire, localStorage, et IndexedDB
 */

export interface CacheOptions {
  ttl?: number; // Time to live en millisecondes
  storage?: 'memory' | 'localStorage' | 'indexedDB';
  serialize?: boolean;
  compress?: boolean;
}

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

/**
 * Cache en mémoire
 */
class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 100; // Nombre maximum d'entrées

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Vérifier l'expiration
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Incrémenter le compteur de hits
    entry.hits++;
    
    return entry.value;
  }

  set<T>(key: string, value: T, ttl: number = 5 * 60 * 1000): void {
    // Nettoyer le cache si trop plein
    if (this.cache.size >= this.maxSize) {
      this.evict();
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
      hits: 0,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  /**
   * Éviction LRU (Least Recently Used)
   */
  private evict(): void {
    let leastUsed: string | null = null;
    let minHits = Infinity;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < minHits) {
        minHits = entry.hits;
        leastUsed = key;
      }
    }
    
    if (leastUsed) {
      this.cache.delete(leastUsed);
    }
  }

  /**
   * Nettoyer les entrées expirées
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Obtenir les statistiques du cache
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        hits: entry.hits,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl,
      })),
    };
  }
}

/**
 * Cache localStorage
 */
class LocalStorageCache {
  private prefix = 'cache_';

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;
      
      const entry: CacheEntry<T> = JSON.parse(item);
      
      // Vérifier l'expiration
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.delete(key);
        return null;
      }
      
      return entry.value;
    } catch (error) {
      console.error('LocalStorage cache get error:', error);
      return null;
    }
  }

  set<T>(key: string, value: T, ttl: number = 60 * 60 * 1000): void {
    if (typeof window === 'undefined') return;
    
    try {
      const entry: CacheEntry<T> = {
        value,
        timestamp: Date.now(),
        ttl,
        hits: 0,
      };
      
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch (error) {
      console.error('LocalStorage cache set error:', error);
      // Si le quota est dépassé, nettoyer le cache
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.cleanup();
      }
    }
  }

  delete(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    }
  }

  cleanup(): void {
    if (typeof window === 'undefined') return;
    
    const now = Date.now();
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      if (!key.startsWith(this.prefix)) continue;
      
      try {
        const item = localStorage.getItem(key);
        if (!item) continue;
        
        const entry = JSON.parse(item);
        if (now - entry.timestamp > entry.ttl) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        // Supprimer les entrées corrompues
        localStorage.removeItem(key);
      }
    }
  }
}

/**
 * Cache IndexedDB (pour les grandes données)
 */
class IndexedDBCache {
  private dbName = 'bilancompetence-cache';
  private storeName = 'cache';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.db) await this.init();
    if (!this.db) return null;
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);
      
      request.onsuccess = () => {
        const entry = request.result as CacheEntry<T> | undefined;
        
        if (!entry) {
          resolve(null);
          return;
        }
        
        // Vérifier l'expiration
        if (Date.now() - entry.timestamp > entry.ttl) {
          this.delete(key);
          resolve(null);
          return;
        }
        
        resolve(entry.value);
      };
      
      request.onerror = () => resolve(null);
    });
  }

  async set<T>(key: string, value: T, ttl: number = 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const entry: CacheEntry<T> & { key: string } = {
        key,
        value,
        timestamp: Date.now(),
        ttl,
        hits: 0,
      };
      
      const request = store.put(entry);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(key: string): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

/**
 * Gestionnaire de cache principal
 */
class CacheManager {
  private memoryCache = new MemoryCache();
  private localStorageCache = new LocalStorageCache();
  private indexedDBCache = new IndexedDBCache();

  constructor() {
    // Nettoyer le cache toutes les 5 minutes
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.memoryCache.cleanup();
        this.localStorageCache.cleanup();
      }, 5 * 60 * 1000);
    }
  }

  /**
   * Obtenir une valeur du cache
   */
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const storage = options.storage || 'memory';
    
    switch (storage) {
      case 'memory':
        return this.memoryCache.get<T>(key);
      
      case 'localStorage':
        return this.localStorageCache.get<T>(key);
      
      case 'indexedDB':
        return await this.indexedDBCache.get<T>(key);
      
      default:
        return null;
    }
  }

  /**
   * Définir une valeur dans le cache
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const storage = options.storage || 'memory';
    const ttl = options.ttl || 5 * 60 * 1000;
    
    switch (storage) {
      case 'memory':
        this.memoryCache.set(key, value, ttl);
        break;
      
      case 'localStorage':
        this.localStorageCache.set(key, value, ttl);
        break;
      
      case 'indexedDB':
        await this.indexedDBCache.set(key, value, ttl);
        break;
    }
  }

  /**
   * Supprimer une valeur du cache
   */
  async delete(key: string, storage: 'memory' | 'localStorage' | 'indexedDB' = 'memory'): Promise<void> {
    switch (storage) {
      case 'memory':
        this.memoryCache.delete(key);
        break;
      
      case 'localStorage':
        this.localStorageCache.delete(key);
        break;
      
      case 'indexedDB':
        await this.indexedDBCache.delete(key);
        break;
    }
  }

  /**
   * Vider tout le cache
   */
  async clear(storage?: 'memory' | 'localStorage' | 'indexedDB'): Promise<void> {
    if (!storage || storage === 'memory') {
      this.memoryCache.clear();
    }
    
    if (!storage || storage === 'localStorage') {
      this.localStorageCache.clear();
    }
    
    if (!storage || storage === 'indexedDB') {
      await this.indexedDBCache.clear();
    }
  }

  /**
   * Wrapper pour mettre en cache le résultat d'une fonction
   */
  async wrap<T>(
    key: string,
    fn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // Essayer d'obtenir depuis le cache
    const cached = await this.get<T>(key, options);
    if (cached !== null) {
      return cached;
    }
    
    // Exécuter la fonction
    const result = await fn();
    
    // Mettre en cache le résultat
    await this.set(key, result, options);
    
    return result;
  }

  /**
   * Obtenir les statistiques du cache mémoire
   */
  getStats() {
    return this.memoryCache.getStats();
  }
}

// Instance singleton
export const cacheManager = new CacheManager();

export default cacheManager;

