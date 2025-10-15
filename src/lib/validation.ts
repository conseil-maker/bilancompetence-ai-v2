import { z } from 'zod'

/**
 * Schémas de validation réutilisables
 */

// Validation d'email
export const emailSchema = z.string().email('Email invalide')

// Validation de mot de passe
export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')

// Validation de téléphone français
export const phoneSchema = z
  .string()
  .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Numéro de téléphone invalide')
  .optional()

// Validation de nom complet
export const fullNameSchema = z
  .string()
  .min(2, 'Le nom doit contenir au moins 2 caractères')
  .max(100, 'Le nom ne peut pas dépasser 100 caractères')

// Validation d'UUID
export const uuidSchema = z.string().uuid('ID invalide')

/**
 * Schémas pour les formulaires
 */

// Inscription
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: fullNameSchema,
  phone: phoneSchema,
  role: z.enum(['beneficiaire', 'consultant', 'admin']).optional(),
})

// Connexion
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Le mot de passe est requis'),
})

// Réinitialisation de mot de passe
export const resetPasswordSchema = z.object({
  email: emailSchema,
})

// Mise à jour du profil
export const updateProfileSchema = z.object({
  full_name: fullNameSchema.optional(),
  phone: phoneSchema,
  avatar_url: z.string().url('URL invalide').optional(),
  bio: z.string().max(500, 'La bio ne peut pas dépasser 500 caractères').optional(),
})

/**
 * Schémas pour les entités métier
 */

// Bilan de compétences
export const bilanSchema = z.object({
  beneficiaire_id: uuidSchema,
  consultant_id: uuidSchema.optional(),
  statut: z.enum(['en_attente', 'en_cours', 'termine', 'archive']),
  date_debut: z.string().datetime().optional(),
  date_fin: z.string().datetime().optional(),
})

// Document
export const documentSchema = z.object({
  bilan_id: uuidSchema,
  nom: z.string().min(1, 'Le nom du document est requis'),
  type: z.enum(['cv', 'lettre_motivation', 'rapport', 'autre']),
  url: z.string().url('URL invalide'),
})

// Message
export const messageSchema = z.object({
  bilan_id: uuidSchema,
  expediteur_id: uuidSchema,
  destinataire_id: uuidSchema,
  contenu: z.string().min(1, 'Le message ne peut pas être vide').max(5000),
})

/**
 * Utilitaire pour valider les données
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: Record<string, string>
} {
  try {
    const validData = schema.parse(data)
    return { success: true, data: validData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return { success: false, errors }
    }
    return { success: false, errors: { _general: 'Erreur de validation' } }
  }
}

/**
 * Utilitaire pour valider de manière asynchrone
 */
export async function validateAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{
  success: boolean
  data?: T
  errors?: Record<string, string>
}> {
  try {
    const validData = await schema.parseAsync(data)
    return { success: true, data: validData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return { success: false, errors }
    }
    return { success: false, errors: { _general: 'Erreur de validation' } }
  }
}

