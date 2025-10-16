/**
 * Endpoints API - Intelligence Artificielle
 */

import { apiClient } from '../client';
import type {
  GenerateQuestionsRequest,
  GenerateQuestionsResponse,
  GenerateFollowUpRequest,
  GenerateFollowUpResponse,
  AnalyzeProfileRequest,
  AnalyzeProfileResponse,
  AnalyzeCVRequest,
  AnalyzeCVResponse,
  AnalyzePersonalityRequest,
  AnalyzePersonalityResponse,
  JobRecommendationsRequest,
  JobRecommendationsResponse,
} from '../types';

export const aiAPI = {
  /**
   * Génère des questions adaptatives
   */
  generateQuestions: async (
    request: GenerateQuestionsRequest
  ): Promise<GenerateQuestionsResponse> => {
    return apiClient.post<GenerateQuestionsResponse>(
      '/api/ai/questions/generate',
      request
    );
  },

  /**
   * Génère une question de suivi
   */
  generateFollowUp: async (
    request: GenerateFollowUpRequest
  ): Promise<GenerateFollowUpResponse> => {
    return apiClient.post<GenerateFollowUpResponse>(
      '/api/ai/questions/followup',
      request
    );
  },

  /**
   * Analyse un profil complet
   */
  analyzeProfile: async (
    request: AnalyzeProfileRequest
  ): Promise<AnalyzeProfileResponse> => {
    return apiClient.post<AnalyzeProfileResponse>('/api/ai/analyze', request);
  },

  /**
   * Analyse un CV
   */
  analyzeCV: async (request: AnalyzeCVRequest): Promise<AnalyzeCVResponse> => {
    return apiClient.post<AnalyzeCVResponse>('/api/ai/analyze-cv', request);
  },

  /**
   * Analyse la personnalité
   */
  analyzePersonality: async (
    request: AnalyzePersonalityRequest
  ): Promise<AnalyzePersonalityResponse> => {
    return apiClient.post<AnalyzePersonalityResponse>(
      '/api/ai/analyze-personality',
      request
    );
  },

  /**
   * Recommande des emplois
   */
  recommendJobs: async (
    request: JobRecommendationsRequest
  ): Promise<JobRecommendationsResponse> => {
    return apiClient.post<JobRecommendationsResponse>(
      '/api/ai/job-recommendations',
      request
    );
  },
};

