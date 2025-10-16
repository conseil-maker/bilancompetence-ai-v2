/**
 * Gestionnaire d'erreurs standardisé pour les routes API
 * 
 * Fournit des méthodes pour retourner des erreurs HTTP cohérentes
 * avec des messages appropriés et des codes de statut corrects.
 */

import { NextResponse } from 'next/server';

export interface ApiError {
  error: string;
  message?: string;
  code?: string;
  details?: unknown;
}

/**
 * Erreur 400 - Bad Request
 * Utilisée quand les données envoyées par le client sont invalides
 */
export function badRequest(message: string, details?: unknown): NextResponse {
  return NextResponse.json(
    {
      error: 'Bad Request',
      message,
      details,
    } as ApiError,
    { status: 400 }
  );
}

/**
 * Erreur 401 - Unauthorized
 * Utilisée quand l'utilisateur n'est pas authentifié
 */
export function unauthorized(message = 'Non authentifié'): NextResponse {
  return NextResponse.json(
    {
      error: 'Unauthorized',
      message,
    } as ApiError,
    { status: 401 }
  );
}

/**
 * Erreur 403 - Forbidden
 * Utilisée quand l'utilisateur est authentifié mais n'a pas les permissions
 */
export function forbidden(message = 'Accès refusé'): NextResponse {
  return NextResponse.json(
    {
      error: 'Forbidden',
      message,
    } as ApiError,
    { status: 403 }
  );
}

/**
 * Erreur 404 - Not Found
 * Utilisée quand la ressource demandée n'existe pas
 */
export function notFound(message = 'Ressource non trouvée'): NextResponse {
  return NextResponse.json(
    {
      error: 'Not Found',
      message,
    } as ApiError,
    { status: 404 }
  );
}

/**
 * Erreur 409 - Conflict
 * Utilisée quand il y a un conflit (ex: ressource déjà existante)
 */
export function conflict(message: string): NextResponse {
  return NextResponse.json(
    {
      error: 'Conflict',
      message,
    } as ApiError,
    { status: 409 }
  );
}

/**
 * Erreur 422 - Unprocessable Entity
 * Utilisée quand les données sont valides mais ne peuvent pas être traitées
 */
export function unprocessableEntity(message: string, details?: unknown): NextResponse {
  return NextResponse.json(
    {
      error: 'Unprocessable Entity',
      message,
      details,
    } as ApiError,
    { status: 422 }
  );
}

/**
 * Erreur 500 - Internal Server Error
 * Utilisée uniquement pour les erreurs serveur inattendues
 */
export function internalServerError(error: unknown): NextResponse {
  // Log l'erreur pour le debugging
  console.error('Internal Server Error:', error);

  // Ne pas exposer les détails de l'erreur en production
  const isDevelopment = process.env.NODE_ENV === 'development';

  return NextResponse.json(
    {
      error: 'Internal Server Error',
      message: 'Une erreur interne est survenue',
      ...(isDevelopment && {
        details: error instanceof Error ? error.message : String(error),
      }),
    } as ApiError,
    { status: 500 }
  );
}

/**
 * Gestionnaire d'erreurs générique
 * Détermine automatiquement le type d'erreur et retourne la réponse appropriée
 */
export function handleApiError(error: unknown): NextResponse {
  // Erreur de validation Zod
  if (error && typeof error === 'object' && 'issues' in error) {
    return badRequest('Données invalides', error);
  }

  // Erreur Supabase
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as { code: string; message: string };
    
    switch (supabaseError.code) {
      case 'PGRST116':
        return notFound('Ressource non trouvée');
      case '23505':
        return conflict('Cette ressource existe déjà');
      case '42501':
        return forbidden('Permissions insuffisantes');
      default:
        return internalServerError(error);
    }
  }

  // Erreur générique
  return internalServerError(error);
}

/**
 * Wrapper pour les routes API
 * Gère automatiquement les erreurs et retourne des réponses cohérentes
 */
export function withErrorHandler<T>(
  handler: () => Promise<T>
): Promise<T | NextResponse> {
  return handler().catch((error) => handleApiError(error));
}

