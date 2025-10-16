'use client'

import { useState, useCallback } from 'react'
import { PostgrestError } from '@supabase/supabase-js'

export interface AppError {
  message: string
  code?: string
  details?: string
  timestamp: Date
}

export function useErrorHandler() {
  const [error, setError] = useState<AppError | null>(null)
  const [isError, setIsError] = useState(false)

  const handleError = useCallback((err: unknown) => {
    console.error('Error caught:', err)

    let appError: AppError = {
      message: "Une erreur inattendue s\'est produite",
      timestamp: new Date(),
    }

    // Gestion des erreurs Supabase/PostgreSQL
    if (isPostgrestError(err)) {
      appError = {
        message: getPostgrestErrorMessage(err),
        code: err.code,
        details: err.details,
        timestamp: new Date(),
      }
    }
    // Gestion des erreurs standard JavaScript
    else if (err instanceof Error) {
      appError = {
        message: err.message,
        details: err.stack,
        timestamp: new Date(),
      }
    }
    // Gestion des erreurs de type string
    else if (typeof err === 'string') {
      appError = {
        message: err,
        timestamp: new Date(),
      }
    }

    setError(appError)
    setIsError(true)

    // Auto-clear après 10 secondes
    setTimeout(() => {
      clearError()
    }, 10000)

    return appError
  }, [])

  const clearError = useCallback(() => {
    setError(null)
    setIsError(false)
  }, [])

  return {
    error,
    isError,
    handleError,
    clearError,
  }
}

/**
 * Type guard pour vérifier si une erreur est une PostgrestError
 */
function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  )
}

/**
 * Convertit les codes d'erreur PostgreSQL en messages utilisateur friendly
 */
function getPostgrestErrorMessage(error: PostgrestError): string {
  const errorMessages: Record<string, string> = {
    '23505': 'Cette entrée existe déjà dans la base de données',
    '23503': 'Référence invalide - l\'élément lié n\'existe pas',
    '23502': 'Champ requis manquant',
    '42501': 'Permission refusée',
    '42P01': 'Table non trouvée',
    'PGRST116': 'Aucun résultat trouvé',
    'PGRST301': 'Requête invalide',
  }

  return errorMessages[error.code] || error.message || 'Erreur de base de données'
}

