import { useState, useCallback } from 'react';
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

export function useBilans() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBilans = useCallback(async (): Promise<Bilan[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<{ bilans: Bilan[] }>('/api/bilans');
      return response.bilans;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des bilans';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBilan = useCallback(async (id: string): Promise<Bilan> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<{ bilan: Bilan }>(`/api/bilans/${id}`);
      return response.bilan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération du bilan';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBilan = useCallback(async (data: CreateBilanData): Promise<Bilan> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{ bilan: Bilan }>('/api/bilans', data);
      return response.bilan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du bilan';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBilan = useCallback(async (id: string, data: UpdateBilanData): Promise<Bilan> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.put<{ bilan: Bilan }>(`/api/bilans/${id}`, data);
      return response.bilan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du bilan';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBilan = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.delete(`/api/bilans/${id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du bilan';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBilanStats = useCallback(async (id: string): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/api/bilans/${id}/stats`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des statistiques';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getBilans,
    getBilan,
    createBilan,
    updateBilan,
    deleteBilan,
    getBilanStats,
  };
}

