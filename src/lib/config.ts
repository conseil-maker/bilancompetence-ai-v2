/**
 * Configuration centralisée de l'application
 * 
 * Ce fichier centralise toutes les variables d'environnement et configurations
 * pour faciliter la maintenance et éviter les erreurs.
 */

// Validation des variables d'environnement requises
function getEnvVar(key: string, required: boolean = true): string {
  const value = process.env[key]
  
  if (required && !value) {
    throw new Error(`Variable d'environnement manquante : ${key}`)
  }
  
  return value || ''
}

/**
 * Configuration Supabase
 */
export const supabaseConfig = {
  url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', false),
} as const

/**
 * Configuration Gemini AI
 */
export const geminiConfig = {
  apiKey: getEnvVar('GEMINI_API_KEY', true),
  model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
} as const

/**
 * Configuration OpenAI (dépréciée - utiliser Gemini)
 * @deprecated Utiliser geminiConfig à la place
 */
export const openaiConfig = {
  apiKey: getEnvVar('OPENAI_API_KEY', false),
  model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
} as const

/**
 * Configuration Stripe
 */
export const stripeConfig = {
  publishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', false),
  secretKey: getEnvVar('STRIPE_SECRET_KEY', false),
  webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET', false),
} as const

/**
 * Configuration Google Calendar
 */
export const googleConfig = {
  clientId: getEnvVar('GOOGLE_CLIENT_ID', false),
  clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET', false),
  redirectUri: getEnvVar('GOOGLE_REDIRECT_URI', false),
} as const

/**
 * Configuration de l'application
 */
export const appConfig = {
  name: 'BilanCompetence.AI',
  version: '2.0.0',
  environment: process.env.NODE_ENV || 'development',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  supportEmail: 'support@bilancompetence-ai.fr',
} as const

/**
 * Configuration des features flags
 */
export const features = {
  aiAnalysis: !!geminiConfig.apiKey,
  payments: !!stripeConfig.secretKey,
  calendar: !!googleConfig.clientId,
  emailNotifications: true, // Toujours activé
} as const

/**
 * Configuration des limites
 */
export const limits = {
  maxFileSize: 10 * 1024 * 1024, // 10 MB
  maxDocumentsPerBilan: 20,
  maxMessagesPerDay: 100,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
} as const

/**
 * Configuration des rôles et permissions
 */
export const rolePermissions = {
  admin: {
    canManageUsers: true,
    canManageBilans: true,
    canViewAnalytics: true,
    canManageSettings: true,
  },
  consultant: {
    canManageUsers: false,
    canManageBilans: true,
    canViewAnalytics: true,
    canManageSettings: false,
  },
  beneficiaire: {
    canManageUsers: false,
    canManageBilans: false,
    canViewAnalytics: false,
    canManageSettings: false,
  },
} as const

/**
 * Vérifie si une feature est activée
 */
export function isFeatureEnabled(feature: keyof typeof features): boolean {
  return features[feature]
}

/**
 * Vérifie si l'environnement est en production
 */
export function isProduction(): boolean {
  return appConfig.environment === 'production'
}

/**
 * Vérifie si l'environnement est en développement
 */
export function isDevelopment(): boolean {
  return appConfig.environment === 'development'
}

