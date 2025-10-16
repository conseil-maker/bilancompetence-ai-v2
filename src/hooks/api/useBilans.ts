import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export interface Bilan {
  id: string;
  beneficiaire_id: string;
  consultant_id: string;
  objectifs: string;
  date_debut: string;
  date_fin?: string;
  type: 'STANDARD' | 'APPROFONDI';
  statut: string;
  created_at: string;
  updated_at: string;
  beneficiaire?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  consultant?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface CreateBilanData {
  beneficiaire_id: string;
  objectifs: string;
  date_debut: string;
  date_fin?: string;
  type?: 'STANDARD' | 'APPROFONDI';
}

export interface UpdateBilanData {
  objectifs?: string;
  date_fin?: string;
  statut?: string;
}

/**
 * Hook pour récupérer tous les bilans
 */
export function useBilans() {
  return useQuery({
    queryKey: ['bilans'],
    queryFn: async () => {
      const response = await apiClient.get<{ bilans: Bilan[] }>('/api/bilans');
      return response.bilans;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook pour récupérer un bilan par ID
 */
export function useBilan(id: string | undefined) {
  return useQuery({
    queryKey: ['bilans', id],
    queryFn: async () => {
      const response = await apiClient.get<{ bilan: Bilan }>(`/api/bilans/${id}`);
      return response.bilan;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook pour récupérer les statistiques d'un bilan
 */
export function useBilanStats(id: string | undefined) {
  return useQuery({
    queryKey: ['bilans', id, 'stats'],
    queryFn: async () => {
      const response = await apiClient.get(`/api/bilans/${id}/stats`);
      return response;
    },
    enabled: !!id,
    staleTime: 30 * 1000, // 30 secondes (stats changent fréquemment)
    refetchInterval: 60 * 1000, // Refetch toutes les minutes en arrière-plan
  });
}

/**
 * Hook pour créer un nouveau bilan
 */
export function useCreateBilan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBilanData) => {
      const response = await apiClient.post<{ bilan: Bilan }>('/api/bilans', data);
      return response.bilan;
    },
    onSuccess: (newBilan) => {
      // Invalider la liste des bilans pour la recharger
      queryClient.invalidateQueries({ queryKey: ['bilans'] });
      
      // Ajouter le nouveau bilan au cache
      queryClient.setQueryData(['bilans', newBilan.id], newBilan);
    },
  });
}

/**
 * Hook pour mettre à jour un bilan
 */
export function useUpdateBilan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBilanData }) => {
      const response = await apiClient.put<{ bilan: Bilan }>(`/api/bilans/${id}`, data);
      return response.bilan;
    },
    onMutate: async ({ id, data }) => {
      // Annuler les requêtes en cours pour ce bilan
      await queryClient.cancelQueries({ queryKey: ['bilans', id] });

      // Sauvegarder l'état précédent
      const previousBilan = queryClient.getQueryData(['bilans', id]);

      // Optimistic update : mettre à jour immédiatement le cache
      queryClient.setQueryData(['bilans', id], (old: any) => ({
        ...old,
        ...data,
        updated_at: new Date().toISOString(),
      }));

      return { previousBilan };
    },
    onError: (err, variables, context) => {
      // Rollback en cas d'erreur
      if (context?.previousBilan) {
        queryClient.setQueryData(['bilans', variables.id], context.previousBilan);
      }
    },
    onSettled: (data, error, variables) => {
      // Invalider pour recharger les vraies données
      queryClient.invalidateQueries({ queryKey: ['bilans', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['bilans', variables.id, 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['bilans'] });
    },
  });
}

/**
 * Hook pour supprimer un bilan
 */
export function useDeleteBilan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/bilans/${id}`);
    },
    onMutate: async (id) => {
      // Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: ['bilans', id] });
      await queryClient.cancelQueries({ queryKey: ['bilans'] });

      // Sauvegarder l'état précédent
      const previousBilan = queryClient.getQueryData(['bilans', id]);
      const previousBilans = queryClient.getQueryData(['bilans']);

      // Optimistic update : retirer du cache
      queryClient.setQueryData(['bilans'], (old: any) =>
        old?.filter((b: any) => b.id !== id)
      );

      return { previousBilan, previousBilans };
    },
    onError: (err, id, context) => {
      // Rollback en cas d'erreur
      if (context?.previousBilans) {
        queryClient.setQueryData(['bilans'], context.previousBilans);
      }
      if (context?.previousBilan) {
        queryClient.setQueryData(['bilans', id], context.previousBilan);
      }
    },
    onSettled: () => {
      // Invalider pour recharger les vraies données
      queryClient.invalidateQueries({ queryKey: ['bilans'] });
    },
  });
}

