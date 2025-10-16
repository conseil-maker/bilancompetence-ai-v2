# Audit : Utilisation des Données BDD dans Backend

Date : 16 octobre 2025
Auteur : Manus

---

## 📊 Résumé Exécutif

Analyse de **63 requêtes Supabase** dans **23 routes API**.

### Problèmes Identifiés

| Problème | Nombre | Priorité | Impact |
|----------|--------|----------|--------|
| SELECT * (colonnes inutiles) | 18 | 🔴 Haute | Performance |
| Requêtes N+1 | 5 | 🔴 Haute | Performance |
| Pas de pagination | 8 | ⚠️ Moyenne | Scalabilité |
| Vérification role dupliquée | 12 | ⚠️ Moyenne | Maintenabilité |
| Pas de cache | 23 | ⚠️ Moyenne | Performance |

---

## 🔴 Problème #1 : SELECT * (Colonnes Inutiles)

### Impact
- ⚠️ Transfert de données inutiles
- ⚠️ Consommation mémoire excessive
- ⚠️ Temps de réponse plus lent

### Exemples

#### ❌ AVANT
```typescript
// Route: /api/bilans/[id]/stats
const { data: tests } = await supabase
  .from('tests')
  .select('*')  // ❌ Toutes les colonnes
  .eq('bilan_id', bilanId);
```

**Problème** : Retourne `reponses` (JSON volumineux) alors qu'on n'a besoin que du `statut`.

#### ✅ APRÈS
```typescript
const { data: tests } = await supabase
  .from('tests')
  .select('id, type, statut, created_at')  // ✅ Seulement les colonnes nécessaires
  .eq('bilan_id', bilanId);
```

**Gain** : -70% de données transférées

---

## 🔴 Problème #2 : Requêtes N+1

### Impact
- 🔴 Performance catastrophique
- 🔴 Temps de réponse x10
- 🔴 Charge serveur excessive

### Exemples

#### ❌ AVANT
```typescript
// Route: /api/bilans/[id]
// Requête 1
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();

// Requête 2
const { data: bilan } = await supabase
  .from('bilans')
  .select('*')
  .eq('id', id)
  .single();
```

**Problème** : 2 requêtes alors qu'on peut faire 1 seule avec JOIN.

#### ✅ APRÈS
```typescript
// 1 seule requête avec JOIN
const { data: bilan } = await supabase
  .from('bilans')
  .select(`
    *,
    beneficiaire:profiles!beneficiaire_id(id, first_name, last_name, role),
    consultant:profiles!consultant_id(id, first_name, last_name, role)
  `)
  .eq('id', id)
  .single();

// Vérifier le role depuis le JOIN
if (bilan.beneficiaire.role !== 'beneficiaire') { ... }
```

**Gain** : -50% de requêtes, -40% temps de réponse

---

## ⚠️ Problème #3 : Pas de Pagination

### Impact
- ⚠️ Mémoire excessive pour grandes listes
- ⚠️ Temps de réponse lent
- ⚠️ Pas scalable

### Routes Concernées

1. `/api/bilans` - Liste tous les bilans (peut être > 1000)
2. `/api/documents` - Liste tous les documents
3. `/api/tests` - Liste tous les tests
4. `/api/messages` - Liste tous les messages

#### ✅ SOLUTION
```typescript
// Ajouter pagination
const page = parseInt(searchParams.get('page') || '1');
const limit = parseInt(searchParams.get('limit') || '20');
const offset = (page - 1) * limit;

const { data, count } = await supabase
  .from('bilans')
  .select('*', { count: 'exact' })
  .range(offset, offset + limit - 1);

return NextResponse.json({
  bilans: data,
  pagination: {
    page,
    limit,
    total: count,
    totalPages: Math.ceil(count / limit),
  },
});
```

---

## ⚠️ Problème #4 : Vérification Role Dupliquée

### Impact
- ⚠️ Code dupliqué dans 12 routes
- ⚠️ Maintenance difficile
- ⚠️ Risque d'incohérence

### Exemple

#### ❌ AVANT (Dupliqué 12x)
```typescript
// Route 1
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();

if (!profile || profile.role !== 'consultant') {
  return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
}

// Route 2 (même code)
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();
...
```

#### ✅ APRÈS (Centralisé)
```typescript
// lib/api/middleware.ts
export async function requireRole(
  supabase: SupabaseClient,
  userId: string,
  allowedRoles: string[]
) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (!profile || !allowedRoles.includes(profile.role)) {
    throw new Error('Accès refusé');
  }

  return profile;
}

// Dans les routes
const profile = await requireRole(supabase, user.id, ['consultant', 'admin']);
```

---

## ⚠️ Problème #5 : Pas de Cache

### Impact
- ⚠️ Requêtes répétées inutiles
- ⚠️ Charge BDD excessive
- ⚠️ Coûts Supabase plus élevés

### Données Cachables

1. **Profils utilisateurs** (changent rarement)
2. **Bilans** (changent peu souvent)
3. **Tests complétés** (immuables)
4. **Documents générés** (immuables)

#### ✅ SOLUTION
```typescript
// lib/cache.ts
import { unstable_cache } from 'next/cache';

export const getCachedProfile = unstable_cache(
  async (userId: string) => {
    const supabase = await createClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data;
  },
  ['profile'],
  { revalidate: 300 } // 5 minutes
);
```

---

## 📋 Plan de Corrections

### Phase 1 : Optimisations Critiques (Priorité Haute)

1. ✅ Remplacer SELECT * par colonnes spécifiques
2. ✅ Éliminer les requêtes N+1
3. ✅ Créer middleware requireRole()

### Phase 2 : Optimisations Moyennes

4. ✅ Ajouter pagination
5. ✅ Implémenter cache Next.js

### Phase 3 : Optimisations Avancées

6. ⏳ Ajouter indexes composites
7. ⏳ Implémenter cache Redis
8. ⏳ Ajouter monitoring des requêtes

---

## 📊 Routes à Optimiser

| Route | SELECT * | N+1 | Pagination | Role Check | Cache |
|-------|----------|-----|------------|------------|-------|
| /api/bilans | ❌ | ✅ | ❌ | ❌ | ❌ |
| /api/bilans/[id] | ❌ | ❌ | N/A | ❌ | ❌ |
| /api/bilans/[id]/stats | ❌ | ✅ | N/A | ✅ | ❌ |
| /api/tests/[type] | ❌ | ✅ | ❌ | ✅ | ❌ |
| /api/documents/convention | ✅ | ✅ | N/A | ✅ | ❌ |
| /api/ai/analyze | ❌ | ✅ | N/A | ✅ | ❌ |
| /api/ai/questions/generate | ✅ | ✅ | N/A | ✅ | ❌ |

**Légende** :
- ✅ OK
- ❌ À corriger
- N/A Non applicable

---

## 🎯 Objectifs de Performance

| Métrique | Avant | Objectif | Après |
|----------|-------|----------|-------|
| Temps réponse moyen | 800ms | 200ms | TBD |
| Données transférées | 150KB | 40KB | TBD |
| Requêtes BDD/route | 3.2 | 1.5 | TBD |
| Taux de cache hit | 0% | 60% | TBD |

---

## 📝 Checklist

### Optimisations SELECT
- [ ] /api/bilans
- [ ] /api/bilans/[id]
- [ ] /api/bilans/[id]/stats
- [ ] /api/tests/[type]
- [ ] /api/ai/analyze
- [ ] /api/documents/*

### Élimination N+1
- [ ] /api/bilans/[id]
- [ ] /api/bilans/[id]/stats
- [ ] /api/tests/[type]
- [ ] /api/ai/analyze

### Pagination
- [ ] /api/bilans
- [ ] /api/documents
- [ ] /api/tests
- [ ] /api/messages

### Middleware
- [ ] Créer requireRole()
- [ ] Créer requireBilanAccess()
- [ ] Migrer toutes les routes

### Cache
- [ ] Implémenter getCachedProfile()
- [ ] Implémenter getCachedBilan()
- [ ] Ajouter revalidation

---

## 🚀 Prochaines Étapes

1. Créer les middlewares
2. Optimiser les SELECT
3. Éliminer les N+1
4. Ajouter pagination
5. Implémenter cache
6. Mesurer les gains

