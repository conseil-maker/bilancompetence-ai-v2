# Audit : Backend ↔ Frontend - Analyse

Date : 16 octobre 2025
Auteur : Manus

---

## 📊 Vue d'Ensemble

Le frontend contient **15 appels API** répartis dans 7 fichiers.

### Structure Actuelle

**Appels API Directs** : 15
- Documents (5) : convention, emargement, synthèse, attestation, certificat
- IA (2) : questions/generate, questions/followup

**Hooks Personnalisés** : 5
- `useAuth.ts` - Gestion de l'authentification
- `useDebounce.ts` - Debouncing
- `useErrorHandler.ts` - Gestion des erreurs
- `useIntersectionObserver.ts` - Intersection Observer
- `useToast.ts` - Notifications toast

**Services** : 3
- `services/ai/cv-analyzer.ts` - Analyse de CV
- `services/calendar/google-calendar.ts` - Calendrier Google
- `services/stripe/payment.ts` - Paiements Stripe

---

## 🚨 Problèmes Identifiés

### 1. Pas de Couche d'Abstraction API

**Problème** :
Les appels `fetch` sont dispersés dans les composants, sans centralisation.

**Impact** :
- Code dupliqué (gestion des erreurs, headers, etc.)
- Difficile à maintenir
- Pas de gestion centralisée des erreurs
- Pas de retry automatique
- Pas de cache

**Exemple** :
```tsx
// Dans chaque composant
const response = await fetch('/api/documents/convention', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ bilanId })
});

if (!response.ok) {
  throw new Error('Erreur lors de la génération');
}
```

### 2. Gestion des Erreurs Incohérente

**Problème** :
Chaque composant gère les erreurs différemment.

**Impact** :
- Expérience utilisateur incohérente
- Messages d'erreur non standardisés
- Pas de logging centralisé

### 3. Pas de Types pour les Réponses API

**Problème** :
Les réponses API ne sont pas typées.

**Impact** :
- Pas d'autocomplétion
- Erreurs de typage non détectées
- Maintenance difficile

### 4. Pas de Gestion du Loading State

**Problème** :
Chaque composant gère son propre état de chargement.

**Impact** :
- Code dupliqué
- Incohérence visuelle
- Pas de loading global

### 5. Pas de Cache

**Problème** :
Aucun mécanisme de cache pour les requêtes API.

**Impact** :
- Requêtes inutiles
- Performance dégradée
- Coûts API plus élevés

---

## 📋 Plan de Correction

### Priorité 1 : Créer une Couche d'Abstraction API

Créer un client API centralisé avec :
- Gestion automatique des headers
- Gestion centralisée des erreurs
- Retry automatique
- Logging
- Types TypeScript

### Priorité 2 : Créer des Hooks Personnalisés

Créer des hooks pour chaque endpoint :
- `useBilans()`
- `useDocuments()`
- `useQuestions()`
- etc.

### Priorité 3 : Ajouter les Types

Créer des types pour toutes les réponses API.

### Priorité 4 : Implémenter le Cache

Utiliser React Query ou SWR pour le cache.

---

## 🎯 Architecture Cible

```
Frontend
├── src/lib/api/
│   ├── client.ts          # Client API centralisé
│   ├── endpoints/
│   │   ├── bilans.ts      # Endpoints bilans
│   │   ├── documents.ts   # Endpoints documents
│   │   ├── ai.ts          # Endpoints IA
│   │   └── ...
│   └── types.ts           # Types des réponses API
├── src/hooks/api/
│   ├── useBilans.ts       # Hook pour bilans
│   ├── useDocuments.ts    # Hook pour documents
│   ├── useQuestions.ts    # Hook pour questions IA
│   └── ...
└── src/components/
    └── ...                # Composants utilisent les hooks
```

---

## 📊 Statistiques

| Métrique | Valeur |
|----------|--------|
| Appels API directs | 15 |
| Fichiers avec fetch | 7 |
| Hooks personnalisés | 5 |
| Services | 3 |
| Types API | 0 ❌ |
| Client API centralisé | 0 ❌ |
| Cache | 0 ❌ |

---

## ✅ Prochaine Étape

**Création du client API centralisé et des hooks**

Je vais créer l'infrastructure complète pour une communication Backend ↔ Frontend optimale.

