import { test, expect } from '@playwright/test'

test.describe('Page d\'accueil', () => {
  test('devrait afficher le titre principal', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier que le titre principal est visible
    await expect(page.getByRole('heading', { name: /Transformez votre carrière/i })).toBeVisible()
  })

  test('devrait afficher les boutons d\'action', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier que les boutons CTA sont visibles
    await expect(page.getByRole('link', { name: /Commencer mon bilan/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /En savoir plus/i })).toBeVisible()
  })

  test('devrait afficher les 4 fonctionnalités principales', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier que les 4 cartes de fonctionnalités sont présentes
    await expect(page.getByText(/Analyse IA avancée/i)).toBeVisible()
    await expect(page.getByText(/Accompagnement personnalisé/i)).toBeVisible()
    await expect(page.getByText(/Tests psychométriques/i)).toBeVisible()
    await expect(page.getByText(/Suivi en temps réel/i)).toBeVisible()
  })

  test('devrait naviguer vers la page d\'inscription', async ({ page }) => {
    await page.goto('/')
    
    // Cliquer sur le bouton "S'inscrire"
    await page.getByRole('link', { name: /S'inscrire/i }).click()
    
    // Vérifier la navigation vers /register
    await expect(page).toHaveURL(/.*register/)
  })

  test('devrait naviguer vers la page de connexion', async ({ page }) => {
    await page.goto('/')
    
    // Cliquer sur le bouton "Connexion"
    await page.getByRole('link', { name: /Connexion/i }).click()
    
    // Vérifier la navigation vers /login
    await expect(page).toHaveURL(/.*login/)
  })

  test('devrait être responsive', async ({ page }) => {
    // Test sur mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Vérifier que le contenu est visible sur mobile
    await expect(page.getByRole('heading', { name: /Transformez votre carrière/i })).toBeVisible()
  })

  test('devrait scroller vers les témoignages', async ({ page }) => {
    await page.goto('/')
    
    // Scroller vers le bas
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    // Vérifier que la section témoignages est visible
    await expect(page.getByText(/Ce que disent nos utilisateurs/i)).toBeVisible()
  })
})

