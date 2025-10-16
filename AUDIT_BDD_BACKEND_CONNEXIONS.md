# Audit : Connexions Base de Données ↔ Backend

Date : 16 octobre 2025
Auteur : Manus

---

## 📊 Vue d'Ensemble

Le backend contient **44 connexions Supabase** réparties dans 21 routes API.

### Problème Critique Identifié

❌ **Incohérence dans les imports Supabase**

Deux méthodes différentes sont utilisées pour créer des clients Supabase :

1. **`createClient` de `@/lib/supabase/server`** (Moderne - Next.js 15)
   - Utilise `@supabase/ssr`
   - Gestion automatique des cookies
   - Recommandé pour Next.js 15

2. **`createRouteHandlerClient` de `@supabase/auth-helpers-nextjs`** (Ancien)
   - Package déprécié
   - Gestion manuelle des cookies
   - Peut causer des problèmes d'authentification

---

## 🔍 Analyse Détaillée

### Routes utilisant `createClient` (Moderne) - 13 routes

✅ **Routes IA** (3)
- `/api/ai/analyze-cv`
- `/api/ai/analyze-personality`
- `/api/ai/job-recommendations`

✅ **Routes Documents** (6)
- `/api/documents/attestation`
- `/api/documents/certificat`
- `/api/documents/convention`
- `/api/documents/emargement`
- `/api/documents/emargement/[id]/signature`
- `/api/documents/synthese`

✅ **Autres Routes** (4)
- `/api/analytics`
- `/api/calendar/create-event`
- `/api/parcours/preliminaire`
- `/api/payments/create-checkout`

### Routes utilisant `createRouteHandlerClient` (Ancien) - 5 routes

❌ **Routes IA** (3)
- `/api/ai/analyze`
- `/api/ai/questions/generate`
- `/api/ai/questions/followup`

❌ **Autres Routes** (2)
- `/api/automation/parcours`
- `/api/matching`

---

## 🚨 Problèmes Identifiés

### 1. Incohérence des Imports

**Impact** :
- Comportements différents entre les routes
- Problèmes d'authentification potentiels
- Maintenance difficile

**Solution** :
Standardiser toutes les routes pour utiliser `createClient` de `@/lib/supabase/server`

### 2. Package Déprécié

**Problème** :
`@supabase/auth-helpers-nextjs` est déprécié et remplacé par `@supabase/ssr`

**Impact** :
- Bugs potentiels
- Pas de mises à jour de sécurité
- Incompatibilité avec Next.js 15

**Solution** :
Migrer toutes les routes vers `@supabase/ssr`

---

## 📋 Plan de Correction

### Priorité 1 : Standardiser les Imports (5 routes)

1. **`/api/ai/analyze/route.ts`**
   - Remplacer `createRouteHandlerClient` par `createClient`
   - Remplacer `supabase.auth.getSession()` par `supabase.auth.getUser()`

2. **`/api/ai/questions/generate/route.ts`**
   - Remplacer `createRouteHandlerClient` par `createClient`
   - Remplacer `supabase.auth.getSession()` par `supabase.auth.getUser()`

3. **`/api/ai/questions/followup/route.ts`**
   - Remplacer `createRouteHandlerClient` par `createClient`
   - Remplacer `supabase.auth.getSession()` par `supabase.auth.getUser()`

4. **`/api/automation/parcours/route.ts`**
   - Remplacer `createRouteHandlerClient` par `createClient`
   - Remplacer `supabase.auth.getSession()` par `supabase.auth.getUser()`

5. **`/api/matching/route.ts`**
   - Remplacer `createRouteHandlerClient` par `createClient`
   - Remplacer `supabase.auth.getSession()` par `supabase.auth.getUser()`

### Priorité 2 : Vérifier les Relations entre Tables

Après la standardisation, vérifier que toutes les requêtes utilisent les bonnes clés étrangères :
- `bilan_id` → `bilans.id`
- `user_id` → `profiles.id`
- `consultant_id` → `profiles.id`
- `beneficiaire_id` → `profiles.id`

### Priorité 3 : Optimiser les Requêtes

Vérifier et optimiser :
- Utilisation de `.select('*')` vs sélection de colonnes spécifiques
- Utilisation de `.single()` vs `.maybeSingle()`
- Gestion des erreurs

---

## 🎯 Différences Clés

### `createRouteHandlerClient` (Ancien)

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabase = createRouteHandlerClient({ cookies });
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
}
```

### `createClient` (Moderne)

```typescript
import { createClient } from '@/lib/supabase/server';

const supabase = createClient();
const { data: { user }, error: authError } = await supabase.auth.getUser();
if (authError || !user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Avantages de `createClient`** :
- ✅ Gestion automatique des cookies
- ✅ Compatible Next.js 15
- ✅ Moins de code
- ✅ Plus sûr (vérifie directement l'utilisateur)

---

## 📊 Statistiques

| Métrique | Valeur |
|----------|--------|
| Total connexions Supabase | 44 |
| Routes avec `createClient` | 13 (62%) |
| Routes avec `createRouteHandlerClient` | 5 (24%) |
| Routes à migrer | 5 (24%) |

---

## ✅ Prochaine Étape

**Correction des 5 routes utilisant l'ancien import**

Je vais migrer ces routes immédiatement.

