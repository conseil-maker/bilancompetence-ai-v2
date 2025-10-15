import { test, expect } from '@playwright/test'

test.describe('Inscription', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('devrait afficher le formulaire d\'inscription', async ({ page }) => {
    // Vérifier que tous les champs sont présents
    await expect(page.getByLabel(/Nom complet/i)).toBeVisible()
    await expect(page.getByLabel(/Email/i)).toBeVisible()
    await expect(page.getByLabel(/Mot de passe/i)).toBeVisible()
    await expect(page.getByLabel(/Rôle/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /S'inscrire/i })).toBeVisible()
  })

  test('devrait afficher des erreurs de validation', async ({ page }) => {
    // Soumettre le formulaire vide
    await page.getByRole('button', { name: /S'inscrire/i }).click()
    
    // Vérifier que des messages d'erreur apparaissent
    // Note: Ceci dépend de l'implémentation de la validation dans le formulaire
    await expect(page.getByText(/requis/i).first()).toBeVisible()
  })

  test('devrait rejeter un email invalide', async ({ page }) => {
    await page.getByLabel(/Nom complet/i).fill('Jean Dupont')
    await page.getByLabel(/Email/i).fill('email-invalide')
    await page.getByLabel(/Mot de passe/i).fill('SecurePass123!')
    await page.getByLabel(/Rôle/i).selectOption('beneficiaire')
    
    await page.getByRole('button', { name: /S'inscrire/i }).click()
    
    // Vérifier le message d'erreur pour l'email
    await expect(page.getByText(/email.*invalide/i)).toBeVisible()
  })

  test('devrait rejeter un mot de passe trop court', async ({ page }) => {
    await page.getByLabel(/Nom complet/i).fill('Jean Dupont')
    await page.getByLabel(/Email/i).fill('jean.dupont@example.com')
    await page.getByLabel(/Mot de passe/i).fill('123')
    await page.getByLabel(/Rôle/i).selectOption('beneficiaire')
    
    await page.getByRole('button', { name: /S'inscrire/i }).click()
    
    // Vérifier le message d'erreur pour le mot de passe
    await expect(page.getByText(/mot de passe.*8 caractères/i)).toBeVisible()
  })

  test('devrait permettre l\'inscription avec des données valides', async ({ page }) => {
    const timestamp = Date.now()
    const email = `test.${timestamp}@example.com`
    
    await page.getByLabel(/Nom complet/i).fill('Jean Dupont')
    await page.getByLabel(/Email/i).fill(email)
    await page.getByLabel(/Mot de passe/i).fill('SecurePass123!')
    await page.getByLabel(/Rôle/i).selectOption('beneficiaire')
    
    await page.getByRole('button', { name: /S'inscrire/i }).click()
    
    // Attendre la redirection ou le message de succès
    // Note: Ajuster selon le comportement réel de l'application
    await page.waitForURL(/.*dashboard|login/, { timeout: 10000 })
  })

  test('devrait avoir un lien vers la page de connexion', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Déjà un compte/i })).toBeVisible()
    
    await page.getByRole('link', { name: /Déjà un compte/i }).click()
    await expect(page).toHaveURL(/.*login/)
  })

  test('devrait être responsive', async ({ page }) => {
    // Test sur mobile
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Vérifier que le formulaire est toujours utilisable
    await expect(page.getByLabel(/Nom complet/i)).toBeVisible()
    await expect(page.getByLabel(/Email/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /S'inscrire/i })).toBeVisible()
  })
})

