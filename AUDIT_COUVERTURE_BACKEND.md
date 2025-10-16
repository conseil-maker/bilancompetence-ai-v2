# 🔍 Audit de Couverture Backend

**Date** : 17 octobre 2025  
**Objectif** : Vérifier que toutes les tables et colonnes de la base de données sont correctement utilisées dans le backend

## 1. Inventaire des Tables

La base de données contient **22 tables** :

| # | Table | Module Responsable | Statut |
|---|-------|-------------------|--------|
| 1 | `profiles` | ❌ Manquant | 🔴 Non couvert |
| 2 | `bilans` | ❌ Manquant | 🔴 Non couvert |
| 3 | `experiences` | ✅ `competences` | ✅ Couvert |
| 4 | `competences` | ✅ `competences` | ✅ Couvert |
| 5 | `competences_experiences` | ✅ `competences` | ✅ Couvert |
| 6 | `pistes_metiers` | ✅ `pistes-metiers` | ✅ Couvert |
| 7 | `ecarts_competences` | ✅ `pistes-metiers` | ✅ Couvert |
| 8 | `formations` | ✅ `pistes-metiers` | ✅ Couvert |
| 9 | `formations_ecarts` | ⚠️ Partiel | ⚠️ Liaison créée mais pas de fonctions dédiées |
| 10 | `plan_action` | ✅ `plan-action` | ✅ Couvert |
| 11 | `rdv` | ✅ `rdv` | ✅ Couvert |
| 12 | `notes_entretien` | ✅ `rdv` | ✅ Couvert |
| 13 | `notifications` | ✅ `notifications` | ✅ Couvert |
| 14 | `enquetes_satisfaction` | ✅ `qualiopi` | ✅ Couvert |
| 15 | `reclamations` | ✅ `qualiopi` | ✅ Couvert |
| 16 | `veille` | ✅ `qualiopi` | ✅ Couvert |
| 17 | `formations_consultants` | ✅ `qualiopi` | ✅ Couvert |
| 18 | `tests` | ❌ Manquant | 🔴 Non couvert |
| 19 | `documents` | ❌ Manquant | 🔴 Non couvert |
| 20 | `messages` | ❌ Manquant | 🔴 Non couvert |
| 21 | `resources` | ❌ Manquant | 🔴 Non couvert |
| 22 | `activites` | ❌ Manquant | 🔴 Non couvert |

## 2. Analyse de Couverture

### ✅ Tables Couvertes (15/22 = 68%)

Les tables suivantes ont un module dédié avec des fonctions CRUD complètes :
- Compétences et expériences (3 tables)
- Pistes métiers et formations (3 tables)
- Plan d'action (1 table)
- RDV et notes (2 tables)
- Notifications (1 table)
- Qualiopi (4 tables)

### 🔴 Tables Non Couvertes (6/22 = 27%)

Les tables suivantes n'ont **aucun module** dédié :

1. **`profiles`** - Table centrale des utilisateurs
2. **`bilans`** - Table centrale des dossiers de bilans
3. **`tests`** - Tests psychométriques
4. **`documents`** - Gestion documentaire
5. **`messages`** - Messagerie interne
6. **`resources`** - Ressources pédagogiques
7. **`activites`** - Journal d'activité

### ⚠️ Tables Partiellement Couvertes (1/22 = 5%)

- **`formations_ecarts`** : Table de liaison créée dans l'API route mais pas de fonctions dédiées pour la gérer directement

## 3. Problèmes Identifiés

### 🔴 Critique : Tables Centrales Manquantes

Les tables **`profiles`** et **`bilans`** sont les tables les plus importantes du système et n'ont pas de module dédié. Cela signifie :

- ❌ Pas de fonctions pour gérer les utilisateurs (création, mise à jour, recherche)
- ❌ Pas de fonctions pour gérer les bilans (création, changement de phase, statistiques)
- ❌ Les autres modules font référence à ces tables mais ne peuvent pas les manipuler facilement

### 🔴 Important : Fonctionnalités de Base Manquantes

Les tables **`tests`**, **`documents`**, **`messages`**, **`resources`** sont essentielles pour le fonctionnement de base de l'application :

- ❌ Pas de gestion des tests psychométriques
- ❌ Pas de gestion documentaire (upload, téléchargement, signature)
- ❌ Pas de messagerie entre bénéficiaire et consultant
- ❌ Pas de bibliothèque de ressources pédagogiques

### ⚠️ Moyen : Traçabilité Manquante

La table **`activites`** sert de journal d'audit mais n'a pas de module :

- ⚠️ Les activités sont créées dans les API routes mais pas de fonctions pour les consulter
- ⚠️ Pas de fonctions pour générer des rapports d'activité

## 4. Liaisons Entre Tables

### Liaisons Correctement Implémentées

| Table Source | Table Cible | Clé Étrangère | Implémentation |
|--------------|-------------|---------------|----------------|
| `experiences` | `bilans` | `bilan_id` | ✅ Fonction `getExperiences(bilanId)` |
| `competences` | `bilans` | `bilan_id` | ✅ Fonction `getCompetences(bilanId)` |
| `competences_experiences` | `competences` | `competence_id` | ✅ Fonction `getCompetencesForExperience()` |
| `competences_experiences` | `experiences` | `experience_id` | ✅ Fonction `getExperienceWithCompetences()` |
| `pistes_metiers` | `bilans` | `bilan_id` | ✅ Fonction `getPistesMetiers(bilanId)` |
| `ecarts_competences` | `pistes_metiers` | `piste_metier_id` | ✅ Fonction `getEcartsCompetences()` |
| `formations` | `pistes_metiers` | `piste_metier_id` | ✅ Fonction `getFormationsForPisteMetier()` |
| `plan_action` | `bilans` | `bilan_id` | ✅ Fonction `getActions(bilanId)` |
| `rdv` | `bilans` | `bilan_id` | ✅ Fonction `getRdvs(bilanId)` |
| `notes_entretien` | `rdv` | `rdv_id` | ✅ Fonction `getNotesEntretien(rdvId)` |
| `notifications` | `profiles` | `user_id` | ✅ Fonction `getNotifications(userId)` |

### Liaisons Non Implémentées

| Table Source | Table Cible | Clé Étrangère | Problème |
|--------------|-------------|---------------|----------|
| `bilans` | `profiles` | `beneficiaire_id` | ❌ Pas de fonction `getBilansByBeneficiaire()` |
| `bilans` | `profiles` | `consultant_id` | ❌ Pas de fonction `getBilansByConsultant()` |
| `tests` | `bilans` | `bilan_id` | ❌ Module `tests` manquant |
| `documents` | `bilans` | `bilan_id` | ❌ Module `documents` manquant |
| `messages` | `bilans` | `bilan_id` | ❌ Module `messages` manquant |
| `resources` | N/A | N/A | ❌ Module `resources` manquant |
| `activites` | `bilans` | `bilan_id` | ❌ Module `activites` manquant |
| `rdv` | `profiles` | `beneficiaire_id` | ⚠️ Fonction existe mais pas via `profiles` |
| `rdv` | `profiles` | `consultant_id` | ⚠️ Fonction existe mais pas via `profiles` |

## 5. Recommandations

### Priorité 1 : Créer les Modules Manquants Critiques

1. **Module `profiles`** - Gestion des utilisateurs
2. **Module `bilans`** - Gestion des dossiers de bilans

### Priorité 2 : Créer les Modules Fonctionnels

3. **Module `tests`** - Gestion des tests psychométriques
4. **Module `documents`** - Gestion documentaire
5. **Module `messages`** - Messagerie interne

### Priorité 3 : Créer les Modules Secondaires

6. **Module `resources`** - Bibliothèque de ressources
7. **Module `activites`** - Journal d'audit et rapports

### Priorité 4 : Compléter les Liaisons

8. Ajouter des fonctions pour naviguer depuis `profiles` vers `bilans`, `rdv`, etc.
9. Ajouter des fonctions pour gérer la table de liaison `formations_ecarts`

## 6. Score de Conformité

| Catégorie | Score |
|-----------|-------|
| **Couverture des tables** | 68% (15/22) |
| **Tables critiques** | 0% (0/2) |
| **Liaisons implémentées** | 65% (11/17) |
| **Score global** | **44%** |

> ⚠️ **Conclusion** : Le backend couvre bien les fonctionnalités innovantes (compétences, pistes métiers, plan d'action) mais **manque les modules de base** (utilisateurs, bilans, tests, documents, messages) qui sont essentiels au fonctionnement de l'application.

