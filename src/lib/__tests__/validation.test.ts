import { registerSchema, loginSchema, bilanSchema } from '../validation'

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        full_name: 'Jean Dupont',
        role: 'beneficiaire',
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'SecurePass123!',
        full_name: 'Jean Dupont',
        role: 'beneficiaire',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
        full_name: 'Jean Dupont',
        role: 'beneficiaire',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty full_name', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        full_name: '',
        role: 'beneficiaire',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should accept optional phone', () => {
      const validData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        full_name: 'Jean Dupont',
        role: 'beneficiaire',
        phone: '+33612345678',
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      }

      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'password',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject missing password', () => {
      const invalidData = {
        email: 'test@example.com',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('bilanSchema', () => {
    it('should validate correct bilan data', () => {
      const validData = {
        beneficiaire_id: '123e4567-e89b-12d3-a456-426614174000',
        consultant_id: '123e4567-e89b-12d3-a456-426614174001',
        statut: 'en_attente',
      }

      const result = bilanSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid UUID', () => {
      const invalidData = {
        beneficiaire_id: 'not-a-uuid',
        consultant_id: '123e4567-e89b-12d3-a456-426614174001',
        statut: 'en_attente',
      }

      const result = bilanSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid status', () => {
      const invalidData = {
        beneficiaire_id: '123e4567-e89b-12d3-a456-426614174000',
        consultant_id: '123e4567-e89b-12d3-a456-426614174001',
        statut: 'invalid_status',
      }

      const result = bilanSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should accept optional dates', () => {
      const validData = {
        beneficiaire_id: '123e4567-e89b-12d3-a456-426614174000',
        consultant_id: '123e4567-e89b-12d3-a456-426614174001',
        statut: 'en_cours',
        date_debut: '2025-01-01',
        date_fin: '2025-06-30',
      }

      const result = bilanSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})

