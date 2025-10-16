/**
 * Endpoints API - Documents
 */

import { apiClient } from '../client';
import type { DocumentResponse, GenerateDocumentRequest } from '../types';

export const documentsAPI = {
  /**
   * Génère une convention
   */
  generateConvention: async (bilanId: string): Promise<DocumentResponse> => {
    return apiClient.post<DocumentResponse>('/api/documents/convention', {
      bilanId,
      type: 'convention',
    });
  },

  /**
   * Génère une feuille d'émargement
   */
  generateEmargement: async (bilanId: string): Promise<DocumentResponse> => {
    return apiClient.post<DocumentResponse>('/api/documents/emargement', {
      bilanId,
      type: 'emargement',
    });
  },

  /**
   * Génère une synthèse
   */
  generateSynthese: async (bilanId: string): Promise<DocumentResponse> => {
    return apiClient.post<DocumentResponse>('/api/documents/synthese', {
      bilanId,
      type: 'synthese',
    });
  },

  /**
   * Génère une attestation
   */
  generateAttestation: async (bilanId: string): Promise<DocumentResponse> => {
    return apiClient.post<DocumentResponse>('/api/documents/attestation', {
      bilanId,
      type: 'attestation',
    });
  },

  /**
   * Génère un certificat
   */
  generateCertificat: async (bilanId: string): Promise<DocumentResponse> => {
    return apiClient.post<DocumentResponse>('/api/documents/certificat', {
      bilanId,
      type: 'certificat',
    });
  },

  /**
   * Signe un document d'émargement
   */
  signEmargement: async (
    documentId: string,
    signature: string
  ): Promise<{ success: boolean }> => {
    return apiClient.post(`/api/documents/emargement/${documentId}/signature`, {
      signature,
    });
  },
};

