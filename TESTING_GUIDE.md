# Guide des Tests - BilanCompetence.AI v2

Ce document explique comment écrire, exécuter et maintenir les tests de l'application BilanCompetence.AI v2.

## 📊 Vue d'Ensemble

Nous utilisons une stratégie de test complète avec deux types de tests complémentaires :

- **Tests Unitaires** : Testent les fonctions, hooks et composants isolément avec Jest et React Testing Library
- **Tests E2E** : Testent les parcours utilisateurs complets avec Playwright

Cette approche garantit à la fois la qualité du code individuel et le bon fonctionnement global de l'application.

## 🧪 Tests Unitaires avec Jest

### Installation

Les dépendances de test sont déjà installées. Si vous devez les réinstaller :

```bash
pnpm add -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

### Exécution des Tests

```bash
# Exécuter tous les tests unitaires
pnpm test

# Exécuter les tests en mode watch (re-exécute automatiquement)
pnpm test:watch

# Exécuter les tests avec rapport de couverture
pnpm test:coverage
```

### Structure des Tests

Les tests unitaires sont organisés dans des dossiers `__tests__` à côté du code qu'ils testent :

```
src/
├── hooks/
│   ├── useDebounce.ts
│   └── __tests__/
│       └── useDebounce.test.ts
├── components/
│   └── common/
│       ├── Card.tsx
│       └── __tests__/
│           └── Card.test.tsx
└── lib/
    ├── validation.ts
    └── __tests__/
        └── validation.test.ts
```

### Exemple de Test Unitaire

**Test d'un Hook** :

```typescript
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should debounce the value change', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated' })
    expect(result.current).toBe('initial')

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current).toBe('updated')
  })
})
```

**Test d'un Composant** :

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Card } from '../Card'

describe('Card', () => {
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn()
    
    render(
      <Card onClick={handleClick}>
        <p>Content</p>
      </Card>
    )
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Bonnes Pratiques

**1. Nommer les Tests Clairement**

Utilisez des descriptions qui expliquent ce que le test vérifie :

```typescript
// ✅ Bon
it('should reject invalid email format', () => { ... })

// ❌ Mauvais
it('test email', () => { ... })
```

**2. Tester les Cas Limites**

N'oubliez pas de tester les cas d'erreur et les valeurs limites :

```typescript
describe('registerSchema', () => {
  it('should validate correct data', () => { ... })
  it('should reject invalid email', () => { ... })
  it('should reject short password', () => { ... })
  it('should reject empty name', () => { ... })
})
```

**3. Utiliser les Matchers Appropriés**

React Testing Library fournit des matchers spécifiques pour tester l'accessibilité :

```typescript
// ✅ Bon - teste l'accessibilité
await expect(page.getByRole('button', { name: /Submit/i })).toBeVisible()

// ❌ Moins bon - teste l'implémentation
await expect(page.locator('.submit-btn')).toBeVisible()
```

**4. Mocker les Dépendances Externes**

Les mocks pour Next.js et Supabase sont déjà configurés dans `jest.setup.js`. Pour ajouter d'autres mocks :

```typescript
jest.mock('@/lib/api', () => ({
  fetchUsers: jest.fn(() => Promise.resolve([{ id: 1, name: 'Test' }])),
}))
```

## 🎭 Tests E2E avec Playwright

### Installation

Les dépendances Playwright sont déjà installées. Si vous devez les réinstaller :

```bash
pnpm add -D @playwright/test
pnpm exec playwright install chromium
```

### Exécution des Tests

```bash
# Exécuter tous les tests E2E
pnpm test:e2e

# Exécuter avec l'interface UI interactive
pnpm test:e2e:ui

# Exécuter en mode debug
pnpm test:e2e:debug

# Exécuter un fichier spécifique
pnpm test:e2e e2e/homepage.spec.ts
```

### Structure des Tests

Les tests E2E sont dans le dossier `e2e/` à la racine du projet :

```
e2e/
├── homepage.spec.ts
├── register.spec.ts
├── login.spec.ts
└── dashboard.spec.ts
```

### Exemple de Test E2E

```typescript
import { test, expect } from '@playwright/test'

test.describe('Inscription', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('devrait permettre l\'inscription avec des données valides', async ({ page }) => {
    const timestamp = Date.now()
    const email = `test.${timestamp}@example.com`
    
    await page.getByLabel(/Nom complet/i).fill('Jean Dupont')
    await page.getByLabel(/Email/i).fill(email)
    await page.getByLabel(/Mot de passe/i).fill('SecurePass123!')
    await page.getByLabel(/Rôle/i).selectOption('beneficiaire')
    
    await page.getByRole('button', { name: /S'inscrire/i }).click()
    
    await page.waitForURL(/.*dashboard/, { timeout: 10000 })
  })
})
```

### Bonnes Pratiques

**1. Utiliser des Sélecteurs Accessibles**

Privilégiez les sélecteurs basés sur les rôles ARIA et les labels :

```typescript
// ✅ Bon - accessible et robuste
await page.getByRole('button', { name: /Submit/i })
await page.getByLabel(/Email/i)

// ❌ Mauvais - fragile et non accessible
await page.locator('.submit-btn')
await page.locator('#email-input')
```

**2. Attendre les Éléments Correctement**

Playwright attend automatiquement, mais parfois il faut être explicite :

```typescript
// Attendre une navigation
await page.waitForURL(/.*dashboard/)

// Attendre qu'un élément soit visible
await expect(page.getByText(/Welcome/i)).toBeVisible()

// Attendre une requête réseau
await page.waitForResponse(response => 
  response.url().includes('/api/users') && response.status() === 200
)
```

**3. Isoler les Tests**

Chaque test doit être indépendant et pouvoir s'exécuter seul :

```typescript
test.beforeEach(async ({ page }) => {
  // Réinitialiser l'état avant chaque test
  await page.goto('/')
})

test.afterEach(async ({ page }) => {
  // Nettoyer après chaque test si nécessaire
  await page.evaluate(() => localStorage.clear())
})
```

**4. Tester sur Plusieurs Viewports**

Vérifiez que l'application fonctionne sur mobile et desktop :

```typescript
test('devrait être responsive', async ({ page }) => {
  // Test sur mobile
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  
  await expect(page.getByRole('heading')).toBeVisible()
})
```

## 📈 Couverture de Code

### Objectifs de Couverture

Nous visons les objectifs suivants :

- **Statements** : 80%
- **Branches** : 75%
- **Functions** : 80%
- **Lines** : 80%

### Générer un Rapport

```bash
pnpm test:coverage
```

Le rapport sera généré dans `coverage/lcov-report/index.html`. Ouvrez ce fichier dans un navigateur pour voir les détails.

### Interpréter le Rapport

- **Vert** : Bien couvert (>80%)
- **Jaune** : Couverture moyenne (50-80%)
- **Rouge** : Peu couvert (<50%)

Concentrez vos efforts sur les fichiers rouges et jaunes, en particulier les fonctions critiques.

## 🚀 CI/CD

### GitHub Actions

Les tests s'exécutent automatiquement sur chaque push et pull request via GitHub Actions. La configuration se trouve dans `.github/workflows/test.yml`.

**Workflow typique** :

1. Checkout du code
2. Installation des dépendances
3. Exécution des tests unitaires
4. Exécution des tests E2E
5. Upload des rapports de couverture

### Prérequis pour le Déploiement

Les tests doivent passer avant tout déploiement en production. Si les tests échouent, le déploiement est bloqué automatiquement.

## 🐛 Debugging

### Débugger les Tests Unitaires

```bash
# Exécuter un seul test
pnpm test -- -t "should validate email"

# Mode watch pour re-exécuter automatiquement
pnpm test:watch

# Ajouter des console.log dans les tests
test('should work', () => {
  console.log('Debug info:', someValue)
  expect(someValue).toBe(expected)
})
```

### Débugger les Tests E2E

```bash
# Mode debug avec pause automatique
pnpm test:e2e:debug

# Mode UI interactif
pnpm test:e2e:ui

# Voir les traces après échec
pnpm exec playwright show-report
```

**Ajouter des points d'arrêt** :

```typescript
test('should work', async ({ page }) => {
  await page.goto('/')
  
  // Pause pour inspecter
  await page.pause()
  
  await page.click('button')
})
```

## 📚 Ressources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Auteur** : Manus AI  
**Date** : 15 octobre 2025  
**Version** : 2.0.0

