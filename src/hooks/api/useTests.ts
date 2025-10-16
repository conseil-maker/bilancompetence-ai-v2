import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';

export type TestType = 'MBTI' | 'DISC' | 'RIASEC' | 'VALEURS';

export interface Test {
  id: string;
  bilan_id: string;
  type: TestType;
  reponses: Record<string, any>;
  resultats: Record<string, any>;
  statut: 'en_cours' | 'complete';
  duree_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface SubmitTestData {
  bilan_id: string;
  reponses: Record<string, any>;
  duree_minutes?: number;
}

export function useTests() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTests = useCallback(async (bilanId: string, type?: TestType): Promise<Test[]> => {
    setLoading(true);
    setError(null);

    try {
      const url = type 
        ? `/api/tests/${type.toLowerCase()}?bilan_id=${bilanId}`
        : `/api/tests?bilan_id=${bilanId}`;
      
      const response = await apiClient.get<{ tests: Test[] }>(url);
      return response.tests;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des tests';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitTest = useCallback(async (type: TestType, data: SubmitTestData): Promise<Test> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{ test: Test }>(
        `/api/tests/${type.toLowerCase()}`,
        data
      );
      return response.test;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la soumission du test';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTestResults = useCallback(async (bilanId: string, type: TestType): Promise<Test | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<{ tests: Test[] }>(
        `/api/tests/${type.toLowerCase()}?bilan_id=${bilanId}`
      );
      
      // Retourner le test le plus récent
      return response.tests.length > 0 ? response.tests[0] : null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des résultats';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getTests,
    submitTest,
    getTestResults,
  };
}

