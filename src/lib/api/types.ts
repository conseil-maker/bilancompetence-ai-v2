/**
 * Types des Réponses API
 * 
 * Définit tous les types pour les réponses du backend
 */

import { UserRole, BilanStatus, TestType } from '@/types/database.types';

// ============================================================================
// Réponses Communes
// ============================================================================

export interface APIResponse<T> {
  data: T;
  message?: string;
}

export interface APIError {
  error: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// Bilans
// ============================================================================

export interface BilanResponse {
  id: string;
  beneficiaire_id: string;
  consultant_id: string | null;
  statut: BilanStatus;
  date_debut: string;
  date_fin: string | null;
  objectifs: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBilanRequest {
  beneficiaire_id: string;
  consultant_id?: string;
  objectifs?: string;
}

export interface UpdateBilanRequest {
  statut?: BilanStatus;
  consultant_id?: string;
  objectifs?: string;
  date_fin?: string;
}

// ============================================================================
// Documents
// ============================================================================

export interface DocumentResponse {
  id: string;
  type: string;
  url: string;
  created_at: string;
}

export interface GenerateDocumentRequest {
  bilanId: string;
  type: 'convention' | 'emargement' | 'synthese' | 'attestation' | 'certificat';
  data?: any;
}

// ============================================================================
// IA - Questions
// ============================================================================

export interface QuestionContext {
  bilanId: string;
  phase: string;
  domaine: string;
  objectif: string;
}

export interface GenerateQuestionsRequest {
  context: QuestionContext;
  nombreQuestions: number;
}

export interface GenerateQuestionsResponse {
  questions: string[];
}

export interface GenerateFollowUpRequest {
  context: QuestionContext;
  questionOriginale: string;
  reponse: string;
}

export interface GenerateFollowUpResponse {
  question: string;
}

// ============================================================================
// IA - Analyse
// ============================================================================

export interface AnalyzeProfileRequest {
  bilanId: string;
}

export interface AnalyzeProfileResponse {
  analyse: {
    forces: string[];
    faiblesses: string[];
    opportunites: string[];
    menaces: string[];
    recommandations: string[];
  };
}

export interface AnalyzeCVRequest {
  cvText: string;
  bilanId?: string;
}

export interface AnalyzeCVResponse {
  competences: string[];
  experiences: {
    titre: string;
    entreprise: string;
    duree: string;
    description: string;
  }[];
  formations: {
    diplome: string;
    etablissement: string;
    annee: string;
  }[];
  recommandations: string[];
}

export interface AnalyzePersonalityRequest {
  responses: Record<string, any>;
  bilanId?: string;
}

export interface AnalyzePersonalityResponse {
  type: string;
  traits: {
    nom: string;
    score: number;
    description: string;
  }[];
  recommandations: string[];
}

// ============================================================================
// IA - Recommandations
// ============================================================================

export interface JobRecommendationsRequest {
  bilanId: string;
  competences?: string[];
  interets?: string[];
  localisation?: string;
}

export interface JobRecommendationsResponse {
  emplois: {
    titre: string;
    entreprise: string;
    localisation: string;
    description: string;
    competences_requises: string[];
    score_matching: number;
  }[];
}

// ============================================================================
// Matching
// ============================================================================

export interface MatchingRequest {
  bilanId: string;
  type: 'emplois' | 'formations';
  params?: {
    localisation?: string;
    secteur?: string;
    niveau?: string;
  };
}

export interface MatchingResponse {
  resultats: {
    id: string;
    titre: string;
    description: string;
    score: number;
    details: any;
  }[];
}

// ============================================================================
// Parcours
// ============================================================================

export interface ParcoursPreliminaireRequest {
  bilanId: string;
  data: {
    objectifs?: string[];
    attentes?: string[];
    disponibilites?: string;
  };
}

export interface ParcoursPreliminaireResponse {
  phase: {
    id: string;
    statut: string;
    progression: number;
  };
}

// ============================================================================
// Analytics
// ============================================================================

export interface AnalyticsEvent {
  event_type: string;
  event_data?: any;
}

export interface AnalyticsResponse {
  success: boolean;
}

// ============================================================================
// Calendrier
// ============================================================================

export interface CreateEventRequest {
  bilanId: string;
  titre: string;
  date: string;
  duree: number;
  description?: string;
}

export interface CreateEventResponse {
  eventId: string;
  eventUrl: string;
}

// ============================================================================
// Paiements
// ============================================================================

export interface CreateCheckoutRequest {
  bilanId: string;
  priceId: string;
}

export interface CreateCheckoutResponse {
  sessionId: string;
  url: string;
}

