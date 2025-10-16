/**
 * Client API Centralisé
 * 
 * Gère toutes les communications avec le backend :
 * - Headers automatiques
 * - Gestion des erreurs
 * - Retry automatique
 * - Logging
 * - Types TypeScript
 */

import { logger } from '@/lib/logger';

export class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'APIError';
  }
}

export interface RequestOptions extends RequestInit {
  retry?: number;
  retryDelay?: number;
  timeout?: number;
}

class APIClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Effectue une requête HTTP avec retry automatique
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      retry = 3,
      retryDelay = 1000,
      timeout = 30000,
      headers,
      ...fetchOptions
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retry; attempt++) {
      try {
        // Créer un AbortController pour le timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...fetchOptions,
          headers: requestHeaders,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Log de la requête
        logger.info('API Request', {
          method: fetchOptions.method || 'GET',
          url,
          status: response.status,
          attempt: attempt + 1,
        });

        // Gérer les erreurs HTTP
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new APIError(response.status, response.statusText, errorData);
        }

        // Parser la réponse
        const data = await response.json();
        return data as T;
      } catch (error) {
        lastError = error as Error;

        // Ne pas retry sur certaines erreurs
        if (error instanceof APIError) {
          // Erreurs 4xx (client) ne doivent pas être retryées
          if (error.status >= 400 && error.status < 500) {
            throw error;
          }
        }

        // Si c'est le dernier essai, throw l'erreur
        if (attempt === retry) {
          logger.error('API Request Failed', {
            method: fetchOptions.method || 'GET',
            url,
            error: lastError.message,
            attempts: attempt + 1,
          });
          throw lastError;
        }

        // Attendre avant de retry
        await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }

    throw lastError || new Error('Request failed');
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

// Export singleton
export const apiClient = new APIClient();

