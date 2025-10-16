/**
 * Hook useQuestions
 * 
 * Gère la génération de questions adaptatives par l'IA
 */

import { useState } from 'react';
import { api, APIError, QuestionContext } from '@/lib/api';
import { useToast } from '../useToast';

export function useQuestions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const generateQuestions = async (
    context: QuestionContext,
    nombreQuestions: number = 5
  ): Promise<string[] | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.ai.generateQuestions({
        context,
        nombreQuestions,
      });

      return response.questions;
    } catch (err) {
      const errorMessage =
        err instanceof APIError
          ? err.data?.error || err.message
          : 'Erreur lors de la génération des questions';

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

  const generateFollowUp = async (
    context: QuestionContext,
    questionOriginale: string,
    reponse: string
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.ai.generateFollowUp({
        context,
        questionOriginale,
        reponse,
      });

      return response.question;
    } catch (err) {
      const errorMessage =
        err instanceof APIError
          ? err.data?.error || err.message
          : 'Erreur lors de la génération de la question de suivi';

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

  return {
    generateQuestions,
    generateFollowUp,
    isLoading,
    error,
  };
}

