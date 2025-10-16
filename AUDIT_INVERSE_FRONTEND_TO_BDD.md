# Audit Inverse : Frontend → Backend → Base de Données

Date : 16 octobre 2025
Auteur : Manus

---

## 📊 Vue d'Ensemble

Cet audit trace les actions utilisateur depuis le frontend jusqu'à la base de données pour identifier les incohérences et fonctionnalités incomplètes.

### Inventaire Frontend

**Pages** : 23 pages
- 2 pages auth (login, register)
- 2 pages admin (dashboard, utilisateurs)
- 2 pages consultant (dashboard, bilans)
- 11 pages bénéficiaire (dashboard, documents, parcours, tests)
- 6 pages publiques (home, à propos, contact, tarifs, offline)

**Composants** : 15 composants
- auth (2)
- forms (2)
- layouts (3)
- common (4)
- parcours (2)
- ai (2)

**Appels API** : 14 appels identifiés

---

## 🔍 Traçage 1 : Inscription Utilisateur

### Flux Complet

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND : /register/page.tsx                                   │
├─────────────────────────────────────────────────────────────────┤
│ 1. Utilisateur remplit le formulaire                           │
│    - Email, mot de passe, first_name, last_name, role          │
│ 2. Clique sur "S'inscrire"                                     │
│ 3. Appelle : supabase.auth.signUp()                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ SUPABASE AUTH : Authentification                               │
├─────────────────────────────────────────────────────────────────┤
│ 1. Crée l'utilisateur dans auth.users                          │
│ 2. Envoie email de confirmation                                │
│ 3. Trigger : on_auth_user_created()                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BASE DE DONNÉES : Supabase PostgreSQL                          │
├─────────────────────────────────────────────────────────────────┤
│ 1. INSERT INTO auth.users (email, ...)                         │
│ 2. INSERT INTO public.profiles (id, first_name, last_name, ...) │
│    via trigger                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### ✅ Statut : COMPLET

- ✅ Formulaire frontend existe
- ✅ Appel Supabase Auth
- ✅ Trigger BDD configuré
- ✅ Table profiles existe

---

## 🔍 Traçage 2 : Création de Bilan

### Flux Complet

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND : /consultant-dashboard/page.tsx                      │
├─────────────────────────────────────────────────────────────────┤
│ 1. Consultant clique sur "Nouveau bilan"                       │
│ 2. Formulaire : bénéficiaire, objectifs, date_debut            │
│ 3. Appelle : fetch('/api/bilans', { method: 'POST', ... })     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND : /api/bilans/route.ts                                 │
├─────────────────────────────────────────────────────────────────┤
│ STATUT : ❌ ROUTE N'EXISTE PAS !                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BASE DE DONNÉES : Table bilans                                 │
├─────────────────────────────────────────────────────────────────┤
│ STATUT : ✅ Table existe                                        │
│ Colonnes : id, beneficiaire_id, consultant_id, statut, ...     │
└─────────────────────────────────────────────────────────────────┘
```

### 🚨 Problème : ROUTE MANQUANTE

**Impact** :
- ❌ Impossible de créer un bilan depuis le frontend
- ❌ Fonctionnalité non implémentée
- ❌ Consultant ne peut pas travailler

**Solution Requise** :
Créer `/api/bilans/route.ts` avec POST, GET, PUT, DELETE

---

## 🔍 Traçage 3 : Affichage des Tests

### Flux Complet

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND : /tests/page.tsx                                     │
├─────────────────────────────────────────────────────────────────┤
│ 1. Bénéficiaire accède à la page tests                         │
│ 2. Page affiche des tests mockés (MBTI, DISC, RIASEC)          │
│ 3. Clique sur "Passer le test"                                 │
│ 4. Appelle : fetch('/api/tests/[type]', { method: 'POST' })    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND : /api/tests/[type]/route.ts                           │
├─────────────────────────────────────────────────────────────────┤
│ STATUT : ❌ ROUTE N'EXISTE PAS !                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BASE DE DONNÉES : Table tests                                  │
├─────────────────────────────────────────────────────────────────┤
│ STATUT : ✅ Table existe                                        │
│ Colonnes : id, bilan_id, type, reponses, resultats, ...        │
└─────────────────────────────────────────────────────────────────┘
```

### 🚨 Problème : ROUTE MANQUANTE

**Impact** :
- ❌ Impossible de passer les tests
- ❌ Fonctionnalité non implémentée
- ❌ Bénéficiaire ne peut pas progresser

**Solution Requise** :
Créer `/api/tests/[type]/route.ts` avec POST (soumettre), GET (récupérer)

---

## 🔍 Traçage 4 : Parcours Préliminaire

### Flux Complet

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND : /parcours/preliminaire/page.tsx                     │
├─────────────────────────────────────────────────────────────────┤
│ 1. Bénéficiaire accède à la phase préliminaire                 │
│ 2. Formulaire : objectifs, attentes, disponibilités            │
│ 3. Clique sur "Valider"                                        │
│ 4. Appelle : fetch('/api/automation/parcours', { POST })       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND : /api/automation/parcours/route.ts                    │
├─────────────────────────────────────────────────────────────────┤
│ STATUT : ✅ ROUTE EXISTE                                        │
│ Fonction : POST - Crée la phase préliminaire                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BASE DE DONNÉES : Table phases_preliminaires                   │
├─────────────────────────────────────────────────────────────────┤
│ STATUT : ✅ Table existe (créée dans migration)                 │
│ Colonnes : id, bilan_id, objectifs, attentes, ...              │
└─────────────────────────────────────────────────────────────────┘
```

### ✅ Statut : COMPLET

- ✅ Page frontend existe
- ✅ Route backend existe
- ✅ Table BDD existe

---

## 🔍 Traçage 5 : Génération de Documents

### Flux Complet

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND : /documents/convention/page.tsx                      │
├─────────────────────────────────────────────────────────────────┤
│ 1. Bénéficiaire remplit le formulaire de convention            │
│ 2. Clique sur "Générer"                                        │
│ 3. Appelle : useDocuments().generateDocument('convention', id) │
│ 4. Hook appelle : api.documents.generateConvention(bilanId)    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ API CLIENT : src/lib/api/client.ts                             │
├─────────────────────────────────────────────────────────────────┤
│ POST /api/documents/convention                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND : /api/documents/convention/route.ts                   │
├─────────────────────────────────────────────────────────────────┤
│ STATUT : ✅ ROUTE EXISTE                                        │
│ Fonction : POST - Génère le PDF et enregistre                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BASE DE DONNÉES : Table documents                              │
├─────────────────────────────────────────────────────────────────┤
│ STATUT : ✅ Table existe + bilan_id ajouté                      │
│ Colonnes : id, type, url, bilan_id, created_at, ...            │
└─────────────────────────────────────────────────────────────────┘
```

### ✅ Statut : COMPLET

- ✅ Page frontend existe
- ✅ Hook useDocuments existe
- ✅ Route backend existe
- ✅ Table BDD existe avec relation

---

## 🔍 Traçage 6 : Dashboard Bénéficiaire

### Flux Complet

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND : /beneficiaire-dashboard/page.tsx                    │
├─────────────────────────────────────────────────────────────────┤
│ 1. Page charge                                                  │
│ 2. Affiche : "Bonjour {user.first_name}"                       │
│ 3. Affiche des stats mockées (PROBLÈME !)                      │
│ 4. Devrait appeler : fetch('/api/bilans/[id]/stats')           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND : /api/bilans/[id]/stats/route.ts                      │
├─────────────────────────────────────────────────────────────────┤
│ STATUT : ✅ ROUTE EXISTE (créée dans audit précédent)          │
│ Fonction : GET - Retourne les vraies stats                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BASE DE DONNÉES : Tables bilans, tests, documents, activites   │
├─────────────────────────────────────────────────────────────────┤
│ STATUT : ✅ Tables existent                                     │
│ Agrégation : progression, heures, tests, documents             │
└─────────────────────────────────────────────────────────────────┘
```

### ⚠️ Problème : FRONTEND NON CONNECTÉ

**Impact** :
- ⚠️ Stats mockées affichées
- ⚠️ Route backend existe mais pas utilisée
- ⚠️ Utilisateur voit des données fausses

**Solution Requise** :
Mettre à jour `/beneficiaire-dashboard/page.tsx` pour appeler la route stats

---

## 📋 Synthèse des Problèmes

### 🔴 Routes Backend Manquantes (2)

1. **`/api/bilans/route.ts`** - CRUD bilans
   - POST : Créer un bilan
   - GET : Lister les bilans
   - PUT : Mettre à jour un bilan
   - DELETE : Supprimer un bilan

2. **`/api/tests/[type]/route.ts`** - Gestion des tests
   - POST : Soumettre un test
   - GET : Récupérer les résultats

### ⚠️ Composants Non Connectés (3)

1. **`/beneficiaire-dashboard/page.tsx`**
   - Stats mockées au lieu d'appeler `/api/bilans/[id]/stats`

2. **`/consultant-dashboard/page.tsx`**
   - Probablement aussi des stats mockées

3. **`/admin-dashboard/page.tsx`**
   - Probablement aussi des stats mockées

### 📊 Fonctionnalités Incomplètes (2)

1. **Création de bilan** - Frontend existe, backend manquant
2. **Tests psychométriques** - Frontend existe, backend manquant

---

## 📊 Tableau de Cohérence

| Page Frontend | Route Backend | Table BDD | Statut |
|---------------|---------------|-----------|--------|
| /register | Supabase Auth | profiles | ✅ |
| /login | Supabase Auth | profiles | ✅ |
| /consultant-dashboard | ❌ /api/bilans | ✅ bilans | ⚠️ |
| /beneficiaire-dashboard | ⚠️ /api/bilans/[id]/stats | ✅ bilans | ⚠️ |
| /documents/convention | ✅ /api/documents/convention | ✅ documents | ✅ |
| /documents/emargement | ✅ /api/documents/emargement | ✅ documents | ✅ |
| /documents/synthese | ✅ /api/documents/synthese | ✅ documents | ✅ |
| /documents/attestation | ✅ /api/documents/attestation | ✅ documents | ✅ |
| /documents/certificat | ✅ /api/documents/certificat | ✅ documents | ✅ |
| /tests | ❌ /api/tests/[type] | ✅ tests | ❌ |
| /parcours/preliminaire | ✅ /api/automation/parcours | ✅ phases_preliminaires | ✅ |

**Légende** :
- ✅ Complet et fonctionnel
- ⚠️ Existe mais non connecté/utilisé
- ❌ Manquant

---

## 📊 Statistiques

| Métrique | Valeur | Statut |
|----------|--------|--------|
| Pages frontend | 23 | ✅ |
| Routes backend requises | 24 | ⚠️ |
| Routes backend existantes | 22 | 92% |
| Routes manquantes | 2 | ❌ |
| Tables BDD requises | 15 | ✅ |
| Tables BDD existantes | 15 | 100% |
| Composants non connectés | 3 | ⚠️ |
| **Score Global** | **8.5/10** | ⚠️ |

---

## ✅ Plan de Correction

### Priorité 1 : Créer les Routes Manquantes

1. **`/api/bilans/route.ts`**
   ```typescript
   POST /api/bilans - Créer un bilan
   GET /api/bilans - Lister les bilans
   ```

2. **`/api/bilans/[id]/route.ts`**
   ```typescript
   GET /api/bilans/[id] - Récupérer un bilan
   PUT /api/bilans/[id] - Mettre à jour un bilan
   DELETE /api/bilans/[id] - Supprimer un bilan
   ```

3. **`/api/tests/[type]/route.ts`**
   ```typescript
   POST /api/tests/[type] - Soumettre un test
   GET /api/tests/[type] - Récupérer les résultats
   ```

### Priorité 2 : Connecter les Dashboards

1. **`/beneficiaire-dashboard/page.tsx`**
   - Remplacer stats mockées par appel à `/api/bilans/[id]/stats`

2. **`/consultant-dashboard/page.tsx`**
   - Créer `/api/consultants/[id]/stats` si nécessaire
   - Connecter au backend

3. **`/admin-dashboard/page.tsx`**
   - Créer `/api/admin/stats` si nécessaire
   - Connecter au backend

### Priorité 3 : Créer les Hooks Manquants

1. **`useBilans()`** - Gestion des bilans
2. **`useTests()`** - Gestion des tests
3. **`useStats()`** - Récupération des stats

---

## 🎯 Prochaines Étapes

1. ✅ Créer les 2 routes backend manquantes
2. ✅ Connecter les 3 dashboards aux vraies données
3. ✅ Créer les 3 hooks manquants
4. ✅ Tester les flux end-to-end
5. ✅ Valider la cohérence complète

Je vais maintenant appliquer ces corrections.

