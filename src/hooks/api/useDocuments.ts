/**
 * Hook useDocuments
 * 
 * Gère la génération et la gestion des documents
 */

import { useState } from 'react';
import { api, APIError, DocumentResponse } from '@/lib/api';
import { useToast } from '../useToast';

type DocumentType = 'convention' | 'emargement' | 'synthese' | 'attestation' | 'certificat';

export function useDocuments() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const generateDocument = async (
    type: DocumentType,
    bilanId: string
  ): Promise<DocumentResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      let response: DocumentResponse;

      switch (type) {
        case 'convention':
          response = await api.documents.generateConvention(bilanId);
          break;
        case 'emargement':
          response = await api.documents.generateEmargement(bilanId);
          break;
        case 'synthese':
          response = await api.documents.generateSynthese(bilanId);
          break;
        case 'attestation':
          response = await api.documents.generateAttestation(bilanId);
          break;
        case 'certificat':
          response = await api.documents.generateCertificat(bilanId);
          break;
        default:
          throw new Error(`Type de document inconnu : ${type}`);
      }

      showToast({
        message: 'Document généré avec succès',
        type: 'success',
      });

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof APIError
          ? err.data?.error || err.message
          : 'Erreur lors de la génération du document';

      setError(errorMessage);
      showToast({
        message: errorMessage,
        type: 'error',
      });

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const signEmargement = async (
    documentId: string,
    signature: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await api.documents.signEmargement(documentId, signature);

      showToast({
        message: 'Document signé avec succès',
        type: 'success',
      });

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof APIError
          ? err.data?.error || err.message
          : 'Erreur lors de la signature du document';

      setError(errorMessage);
      showToast({
        message: errorMessage,
        type: 'error',
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateDocument,
    signEmargement,
    isLoading,
    error,
  };
}

