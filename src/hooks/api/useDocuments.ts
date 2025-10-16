import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export interface Document {
  id: string;
  bilan_id: string;
  type: 'CONVENTION' | 'EMARGEMENT' | 'SYNTHESE' | 'ATTESTATION' | 'CERTIFICAT';
  statut: 'brouillon' | 'genere' | 'signe' | 'finalise';
  contenu: any;
  created_at: string;
  updated_at: string;
}

/**
 * Hook pour récupérer tous les documents d'un bilan
 */
export function useDocuments(bilanId: string | undefined) {
  return useQuery({
    queryKey: ['documents', bilanId],
    queryFn: async () => {
      const response = await apiClient.get<{ documents: Document[] }>(`/api/documents?bilan_id=${bilanId}`);
      return response.documents;
    },
    enabled: !!bilanId,
    staleTime: 5 * 60 * 1000, // 5 minutes (documents changent rarement)
  });
}

/**
 * Hook pour récupérer un document par ID
 */
export function useDocument(id: string | undefined) {
  return useQuery({
    queryKey: ['documents', id],
    queryFn: async () => {
      const response = await apiClient.get<{ document: Document }>(`/api/documents/${id}`);
      return response.document;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour créer une convention
 */
export function useCreateConvention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post<{ document: Document }>('/api/documents/convention', data);
      return response.document;
    },
    onSuccess: (newDocument) => {
      // Invalider les documents du bilan
      queryClient.invalidateQueries({ queryKey: ['documents', newDocument.bilan_id] });
      // Invalider les stats du bilan
      queryClient.invalidateQueries({ queryKey: ['bilans', newDocument.bilan_id, 'stats'] });
      // Ajouter au cache
      queryClient.setQueryData(['documents', newDocument.id], newDocument);
    },
  });
}

/**
 * Hook pour créer une feuille d'émargement
 */
export function useCreateEmargement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post<{ document: Document }>('/api/documents/emargement', data);
      return response.document;
    },
    onSuccess: (newDocument) => {
      queryClient.invalidateQueries({ queryKey: ['documents', newDocument.bilan_id] });
      queryClient.invalidateQueries({ queryKey: ['bilans', newDocument.bilan_id, 'stats'] });
      queryClient.setQueryData(['documents', newDocument.id], newDocument);
    },
  });
}

/**
 * Hook pour créer une synthèse
 */
export function useCreateSynthese() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post<{ document: Document }>('/api/documents/synthese', data);
      return response.document;
    },
    onSuccess: (newDocument) => {
      queryClient.invalidateQueries({ queryKey: ['documents', newDocument.bilan_id] });
      queryClient.invalidateQueries({ queryKey: ['bilans', newDocument.bilan_id, 'stats'] });
      queryClient.setQueryData(['documents', newDocument.id], newDocument);
    },
  });
}

/**
 * Hook pour créer une attestation
 */
export function useCreateAttestation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post<{ document: Document }>('/api/documents/attestation', data);
      return response.document;
    },
    onSuccess: (newDocument) => {
      queryClient.invalidateQueries({ queryKey: ['documents', newDocument.bilan_id] });
      queryClient.invalidateQueries({ queryKey: ['bilans', newDocument.bilan_id, 'stats'] });
      queryClient.setQueryData(['documents', newDocument.id], newDocument);
    },
  });
}

/**
 * Hook pour créer un certificat
 */
export function useCreateCertificat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post<{ document: Document }>('/api/documents/certificat', data);
      return response.document;
    },
    onSuccess: (newDocument) => {
      queryClient.invalidateQueries({ queryKey: ['documents', newDocument.bilan_id] });
      queryClient.invalidateQueries({ queryKey: ['bilans', newDocument.bilan_id, 'stats'] });
      queryClient.setQueryData(['documents', newDocument.id], newDocument);
    },
  });
}

/**
 * Hook pour signer un document
 */
export function useSignDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, signature }: { id: string; signature: string }) => {
      const response = await apiClient.post<{ document: Document }>(
        `/api/documents/${id}/signature`,
        { signature }
      );
      return response.document;
    },
    onMutate: async ({ id }) => {
      // Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: ['documents', id] });

      // Sauvegarder l'état précédent
      const previousDocument = queryClient.getQueryData(['documents', id]);

      // Optimistic update : marquer comme signé immédiatement
      queryClient.setQueryData(['documents', id], (old: any) => ({
        ...old,
        statut: 'signe',
        date_signature: new Date().toISOString(),
      }));

      return { previousDocument };
    },
    onError: (err, variables, context) => {
      // Rollback en cas d'erreur
      if (context?.previousDocument) {
        queryClient.setQueryData(['documents', variables.id], context.previousDocument);
      }
    },
    onSettled: (data, error, variables) => {
      // Invalider pour recharger les vraies données
      queryClient.invalidateQueries({ queryKey: ['documents', variables.id] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['documents', data.bilan_id] });
        queryClient.invalidateQueries({ queryKey: ['bilans', data.bilan_id, 'stats'] });
      }
    },
  });
}

