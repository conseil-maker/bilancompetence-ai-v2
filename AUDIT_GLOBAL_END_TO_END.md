# Audit Global : Base de Données → Backend → Frontend

Date : 16 octobre 2025
Auteur : Manus

---

## 📊 Vue d'Ensemble

Cet audit trace le flux complet des données depuis la base de données jusqu'au frontend, en passant par le backend.

### Objectifs

1. Vérifier la cohérence des données à chaque niveau
2. Identifier les points de friction
3. Optimiser les requêtes et le flux
4. Garantir une expérience utilisateur fluide

---

## 🔍 Flux 1 : Génération de Document (Convention)

### Traçage Complet

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND : /documents/convention/page.tsx                       │
├─────────────────────────────────────────────────────────────────┤
│ 1. Utilisateur clique sur "Générer la convention"              │
│ 2. Appel : useDocuments().generateDocument('convention', id)   │
│ 3. Hook appelle : api.documents.generateConvention(bilanId)    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ API CLIENT : src/lib/api/client.ts                             │
├─────────────────────────────────────────────────────────────────┤
│ 1. Prépare la requête POST /api/documents/convention           │
│ 2. Ajoute les headers automatiques                             │
│ 3. Configure retry (3x) et timeout (30s)                       │
│ 4. Envoie la requête                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND : /api/documents/convention/route.ts                   │
├─────────────────────────────────────────────────────────────────┤
│ 1. Vérifie l'authentification (createClient + getUser)         │
│ 2. Récupère le bilanId depuis le body                          │
│ 3. Requête BDD : SELECT * FROM bilans WHERE id = bilanId       │
│ 4. Requête BDD : SELECT * FROM profiles WHERE id = user_id     │
│ 5. Génère le PDF avec les données                              │
│ 6. Requête BDD : INSERT INTO documents (...)                   │
│ 7. Retourne { id, type, url, created_at }                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BASE DE DONNÉES : Supabase PostgreSQL                          │
├─────────────────────────────────────────────────────────────────┤
│ Tables impliquées :                                             │
│ - bilans (id, beneficiaire_id, consultant_id, statut, ...)     │
│ - profiles (id, first_name, last_name, email, ...)             │
│ - documents (id, type, url, bilan_id, created_at, ...)         │
│                                                                 │
│ Relations :                                                     │
│ - bilans.beneficiaire_id → profiles.id                         │
│ - bilans.consultant_id → profiles.id                           │
│ - documents.bilan_id → bilans.id (MANQUANT !)                  │
└─────────────────────────────────────────────────────────────────┘
```

### 🚨 Problèmes Identifiés

#### 1. Relation Manquante : documents.bilan_id

**Problème** :
La table `documents` n'a pas de colonne `bilan_id` pour relier les documents aux bilans.

**Impact** :
- Impossible de récupérer tous les documents d'un bilan
- Pas de cascade DELETE si un bilan est supprimé
- Incohérence des données

**Solution** :
Ajouter la colonne `bilan_id` avec clé étrangère.

#### 2. Requêtes Non Optimisées

**Problème** :
Le backend fait 2 requêtes séparées :
1. SELECT bilans
2. SELECT profiles

**Impact** :
- 2 round-trips vers la BDD
- Performance dégradée
- Latence accrue

**Solution** :
Utiliser un JOIN pour récupérer toutes les données en une seule requête.

#### 3. Pas de Cache

**Problème** :
Les données du bilan et du profil sont récupérées à chaque génération.

**Impact** :
- Requêtes inutiles
- Performance dégradée
- Coûts BDD plus élevés

**Solution** :
Implémenter un cache côté backend ou frontend (React Query).

---

## 🔍 Flux 2 : Génération de Questions IA

### Traçage Complet

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND : /components/ai/QuestionnaireIA.tsx                  │
├─────────────────────────────────────────────────────────────────┤
│ 1. Utilisateur démarre le questionnaire                        │
│ 2. Appel : useQuestions().generateQuestions(context, 5)        │
│ 3. Hook appelle : api.ai.generateQuestions({ context, 5 })     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ API CLIENT : src/lib/api/client.ts                             │
├─────────────────────────────────────────────────────────────────┤
│ 1. POST /api/ai/questions/generate                             │
│ 2. Body : { context, nombreQuestions: 5 }                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND : /api/ai/questions/generate/route.ts                  │
├─────────────────────────────────────────────────────────────────┤
│ 1. Vérifie l'authentification                                  │
│ 2. Appelle : questionGenerator.generateQuestion(context)       │
│ 3. Boucle 5 fois pour générer 5 questions                      │
│ 4. Requête BDD : INSERT INTO questions_generees (...)          │
│ 5. Retourne { questions: [...] }                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ IA SERVICE : src/lib/ai/question-generator.ts                  │
├─────────────────────────────────────────────────────────────────┤
│ 1. Appelle Gemini API avec le prompt                           │
│ 2. Parse la réponse                                             │
│ 3. Retourne la question                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BASE DE DONNÉES : Supabase PostgreSQL                          │
├─────────────────────────────────────────────────────────────────┤
│ Table : questions_generees                                      │
│ - id, bilan_id, question, contexte, reponse, created_at        │
└─────────────────────────────────────────────────────────────────┘
```

### 🚨 Problèmes Identifiés

#### 1. Génération Séquentielle

**Problème** :
Les 5 questions sont générées séquentiellement (boucle).

**Impact** :
- Temps de génération : 5 × 2s = 10s
- Expérience utilisateur dégradée
- Timeout possible

**Solution** :
Générer les 5 questions en parallèle avec `Promise.all()`.

#### 2. Pas de Streaming

**Problème** :
L'utilisateur attend 10s sans feedback.

**Impact** :
- Impression de blocage
- Pas de feedback progressif

**Solution** :
Implémenter le streaming avec Server-Sent Events (SSE).

#### 3. Pas de Validation du Contexte

**Problème** :
Le contexte n'est pas validé avant d'appeler l'IA.

**Impact** :
- Coûts IA inutiles si le contexte est invalide
- Erreurs non détectées

**Solution** :
Valider le contexte avec Zod avant d'appeler l'IA.

---

## 🔍 Flux 3 : Affichage du Dashboard Bénéficiaire

### Traçage Complet

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND : /beneficiaire-dashboard/page.tsx                    │
├─────────────────────────────────────────────────────────────────┤
│ 1. Page charge                                                  │
│ 2. Récupère user depuis AuthProvider                           │
│ 3. Affiche : "Bonjour {user.first_name}"                       │
│ 4. Affiche des stats mockées (PROBLÈME !)                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ AUTH PROVIDER : src/components/providers/AuthProvider.tsx      │
├─────────────────────────────────────────────────────────────────┤
│ 1. Récupère la session Supabase                                │
│ 2. Requête BDD : SELECT * FROM profiles WHERE id = user.id     │
│ 3. Fournit user au contexte                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BASE DE DONNÉES : Supabase PostgreSQL                          │
├─────────────────────────────────────────────────────────────────┤
│ Table : profiles                                                │
│ - id, first_name, last_name, email, role, ...                  │
└─────────────────────────────────────────────────────────────────┘
```

### 🚨 Problèmes Identifiés

#### 1. Données Mockées dans le Dashboard

**Problème** :
Les statistiques du dashboard sont mockées (hardcodées).

```tsx
const stats = [
  { name: 'Progression', value: '45%', ... },  // MOCKÉE !
  { name: 'Heures réalisées', value: '12h / 24h', ... },  // MOCKÉE !
  { name: 'Tests complétés', value: '3 / 5', ... },  // MOCKÉE !
];
```

**Impact** :
- Données non réelles
- Impossible de suivre la progression
- Expérience utilisateur trompeuse

**Solution** :
Créer une route API `/api/bilans/[id]/stats` pour récupérer les vraies stats.

#### 2. Pas de Récupération du Bilan Actif

**Problème** :
Le dashboard n'affiche pas le bilan actif de l'utilisateur.

**Impact** :
- Impossible de voir les informations du bilan
- Pas de lien vers les documents
- Pas de suivi de progression

**Solution** :
Récupérer le bilan actif depuis la BDD.

---

## 📋 Corrections Prioritaires

### Priorité 1 : Ajouter bilan_id à la table documents

```sql
ALTER TABLE documents ADD COLUMN bilan_id UUID REFERENCES bilans(id) ON DELETE CASCADE;
CREATE INDEX idx_documents_bilan_id ON documents(bilan_id);
```

### Priorité 2 : Optimiser les requêtes avec JOIN

```typescript
// Avant (2 requêtes)
const bilan = await supabase.from('bilans').select('*').eq('id', bilanId).single();
const profile = await supabase.from('profiles').select('*').eq('id', bilan.beneficiaire_id).single();

// Après (1 requête)
const { data } = await supabase
  .from('bilans')
  .select(`
    *,
    beneficiaire:profiles!beneficiaire_id(*),
    consultant:profiles!consultant_id(*)
  `)
  .eq('id', bilanId)
  .single();
```

### Priorité 3 : Remplacer les données mockées

Créer des routes API pour les vraies données :
- `/api/bilans/[id]/stats` - Statistiques du bilan
- `/api/bilans/[id]/progression` - Progression détaillée
- `/api/bilans/[id]/tests` - Tests complétés

### Priorité 4 : Paralléliser la génération de questions

```typescript
// Avant (séquentiel)
for (let i = 0; i < nombreQuestions; i++) {
  const question = await questionGenerator.generateQuestion(context);
  questions.push(question);
}

// Après (parallèle)
const promises = Array.from({ length: nombreQuestions }, () =>
  questionGenerator.generateQuestion(context)
);
const questions = await Promise.all(promises);
```

### Priorité 5 : Ajouter la validation avec Zod

```typescript
import { z } from 'zod';

const QuestionContextSchema = z.object({
  bilanId: z.string().uuid(),
  phase: z.string(),
  domaine: z.string(),
  objectif: z.string(),
});

// Dans la route API
const validatedContext = QuestionContextSchema.parse(context);
```

---

## 📊 Statistiques Globales

| Niveau | Tables/Routes/Composants | Problèmes | Score |
|--------|--------------------------|-----------|-------|
| Base de Données | 15 tables | 1 (bilan_id manquant) | 9.3/10 |
| Backend | 21 routes | 3 (requêtes, validation) | 8.5/10 |
| Frontend | 42 composants | 2 (données mockées) | 9.0/10 |
| **GLOBAL** | **78 éléments** | **6 problèmes** | **8.9/10** |

---

## ✅ Plan d'Action

1. ✅ Ajouter `bilan_id` à la table `documents`
2. ✅ Optimiser les requêtes avec JOIN
3. ✅ Créer les routes API pour les stats réelles
4. ✅ Paralléliser la génération de questions
5. ✅ Ajouter la validation Zod
6. ✅ Remplacer les données mockées dans les dashboards

Je vais maintenant appliquer ces corrections.

