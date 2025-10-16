/**
 * API Client - Point d'entrée principal
 * 
 * Exporte tous les endpoints API de manière centralisée
 */

export { apiClient, APIError } from './client';
export type { RequestOptions } from './client';
export * from './types';
export { documentsAPI } from './endpoints/documents';
export { aiAPI } from './endpoints/ai';

// Réexporter pour faciliter l'utilisation
import { documentsAPI } from './endpoints/documents';
import { aiAPI } from './endpoints/ai';

export const api = {
  documents: documentsAPI,
  ai: aiAPI,
};

