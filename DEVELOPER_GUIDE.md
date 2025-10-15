# Guide du Développeur - BilanCompetence.AI v2

Ce document fournit toutes les informations nécessaires pour développer et maintenir l'application BilanCompetence.AI v2.

## 📋 Table des Matières

- [Architecture](#architecture)
- [Sécurité](#sécurité)
- [Validation des Données](#validation-des-données)
- [Gestion des Erreurs](#gestion-des-erreurs)
- [API Routes](#api-routes)
- [Logging](#logging)
- [Bonnes Pratiques](#bonnes-pratiques)

## 🏗️ Architecture

L'application est construite avec :

- **Next.js 15** : Framework React avec App Router
- **Supabase** : Base de données PostgreSQL et authentification
- **TypeScript** : Typage statique
- **Tailwind CSS** : Styling
- **Zod** : Validation des données
- **React Hook Form** : Gestion des formulaires

### Structure des Dossiers

```
src/
├── app/                    # Pages et routes Next.js
│   ├── (admin)/           # Routes admin
│   ├── (consultant)/      # Routes consultant
│   ├── (beneficiaire)/    # Routes bénéficiaire
│   └── api/               # API routes
├── components/            # Composants React
│   ├── common/           # Composants réutilisables
│   ├── forms/            # Formulaires
│   └── providers/        # Context providers
├── hooks/                # Custom hooks
├── lib/                  # Utilitaires et configuration
├── services/             # Services métier
└── types/                # Types TypeScript
```

## 🔒 Sécurité

### Middleware

Le middleware protège toutes les routes selon les rôles utilisateurs :

```typescript
// src/middleware.ts
// - Vérifie l'authentification
// - Vérifie les permissions selon le rôle
// - Redirige vers le dashboard approprié
```

### Protection des API Routes

Utilisez les wrappers `withAuth` et `withRole` pour sécuriser vos API routes :

```typescript
import { withAuth, withRole } from '@/lib/api-auth'

// Route nécessitant une authentification
export const GET = withAuth(async (req, { user, supabase }) => {
  // user et supabase sont automatiquement fournis
})

// Route nécessitant un rôle spécifique
export const POST = withRole(['admin', 'consultant'], async (req, { user, profile, supabase }) => {
  // Seuls les admins et consultants peuvent accéder
})
```

## ✅ Validation des Données

Tous les schémas de validation sont centralisés dans `src/lib/validation.ts`.

### Utilisation dans les Formulaires

```typescript
import { registerSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const form = useForm({
  resolver: zodResolver(registerSchema),
})
```

### Utilisation dans les API Routes

```typescript
import { validateRequestBody } from '@/lib/api-auth'
import { bilanSchema } from '@/lib/validation'

export const POST = withAuth(async (req, { user, supabase }) => {
  const { data, error } = await validateRequestBody(req, bilanSchema)
  
  if (error) {
    return error // Retourne automatiquement une erreur 400
  }
  
  // data est maintenant validé et typé
})
```

## 🚨 Gestion des Erreurs

### Hook useErrorHandler

Utilisez ce hook pour gérer les erreurs de manière cohérente :

```typescript
import { useErrorHandler } from '@/hooks/useErrorHandler'

function MyComponent() {
  const { error, handleError, clearError } = useErrorHandler()
  
  const doSomething = async () => {
    try {
      // ...
    } catch (err) {
      handleError(err) // Affiche automatiquement l'erreur
    }
  }
}
```

### ErrorBoundary

Enveloppez vos composants avec ErrorBoundary pour capturer les erreurs React :

```typescript
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

### Notifications Toast

Utilisez le hook useToast pour afficher des notifications :

```typescript
import { useToast } from '@/hooks/useToast'

function MyComponent() {
  const { success, error, warning, info } = useToast()
  
  const handleSubmit = async () => {
    try {
      // ...
      success('Opération réussie !')
    } catch (err) {
      error('Une erreur est survenue')
    }
  }
}
```

## 🛣️ API Routes

### Exemples de Routes

#### GET /api/profile
Récupère le profil de l'utilisateur connecté.

```bash
curl -X GET https://your-app.vercel.app/api/profile \
  -H "Cookie: your-session-cookie"
```

#### PATCH /api/profile
Met à jour le profil de l'utilisateur.

```bash
curl -X PATCH https://your-app.vercel.app/api/profile \
  -H "Cookie: your-session-cookie" \
  -H "Content-Type: application/json" \
  -d '{"full_name": "Jean Dupont", "phone": "+33612345678"}'
```

#### GET /api/bilans
Liste tous les bilans (admin/consultant uniquement).

```bash
curl -X GET https://your-app.vercel.app/api/bilans \
  -H "Cookie: your-session-cookie"
```

#### POST /api/bilans
Crée un nouveau bilan (admin/consultant uniquement).

```bash
curl -X POST https://your-app.vercel.app/api/bilans \
  -H "Cookie: your-session-cookie" \
  -H "Content-Type: application/json" \
  -d '{
    "beneficiaire_id": "uuid",
    "statut": "en_attente"
  }'
```

## 📝 Logging

Utilisez le système de logging structuré pour faciliter le débogage :

```typescript
import { logger, createApiLogger } from '@/lib/logger'

// Logger global
logger.info('Application démarrée')
logger.error('Erreur critique', error, { userId: user.id })

// Logger pour une API route
const apiLogger = createApiLogger('/api/bilans')
apiLogger.info('Création d'un bilan', { bilanId: bilan.id })
```

Les logs sont formatés en JSON en production et en texte lisible en développement.

## 🎯 Bonnes Pratiques

### 1. Toujours Valider les Données

Ne faites jamais confiance aux données entrantes. Utilisez Zod pour valider :

```typescript
// ❌ Mauvais
const { email } = await req.json()

// ✅ Bon
const { data, error } = await validateRequestBody(req, loginSchema)
```

### 2. Gérer les Erreurs Proprement

Utilisez les hooks et utilitaires fournis :

```typescript
// ❌ Mauvais
catch (err) {
  console.error(err)
  alert('Erreur')
}

// ✅ Bon
catch (err) {
  handleError(err) // Utilise useErrorHandler
}
```

### 3. Protéger les Routes Sensibles

Toujours vérifier les permissions :

```typescript
// ❌ Mauvais
export async function GET(req: NextRequest) {
  const { data } = await supabase.from('bilans').select()
  return NextResponse.json(data)
}

// ✅ Bon
export const GET = withRole(['admin'], async (req, { supabase }) => {
  const { data } = await supabase.from('bilans').select()
  return NextResponse.json(data)
})
```

### 4. Utiliser les Types TypeScript

Profitez du typage statique :

```typescript
// ❌ Mauvais
const user: any = await getUser()

// ✅ Bon
const user: User = await getUser()
```

### 5. Logger les Événements Importants

Facilitez le débogage en production :

```typescript
logger.info('Utilisateur connecté', { userId: user.id })
logger.error('Échec de la création du bilan', error, { userId: user.id })
```

## 🔧 Configuration

Toutes les variables d'environnement sont documentées dans `.env.example`.

Les configurations sont centralisées dans `src/lib/config.ts` :

```typescript
import { supabaseConfig, features, isProduction } from '@/lib/config'

if (features.aiAnalysis) {
  // Fonctionnalité IA activée
}

if (isProduction()) {
  // Code spécifique à la production
}
```

## 🧪 Tests

### Tests Unitaires

```bash
pnpm test
```

### Tests E2E

```bash
pnpm test:e2e
```

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Zod](https://zod.dev)
- [Documentation React Hook Form](https://react-hook-form.com)

---

**Auteur** : Manus AI  
**Date** : 15 octobre 2025  
**Version** : 2.0.0

