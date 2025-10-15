# 🤝 Demande de Collaboration : Analyse du Projet BilanCompetence.AI v2

## 📋 Contexte

Nous sollicitons votre expertise pour analyser l'architecture, la logique et la structure du projet **BilanCompetence.AI v2**, une plateforme SaaS de bilans de compétences avec intelligence artificielle.

Le projet est actuellement **déployé à 95%** mais rencontre quelques problèmes structurels qui nécessitent un regard expert pour optimiser l'architecture et garantir une base solide pour le développement futur.

---

## 🎯 Objectifs de l'Analyse

Nous recherchons votre point de vue sur :

1. **Architecture globale** : Est-ce que la stack technique (Next.js 15 + Supabase + Services tiers) est optimale ?
2. **Structure du code** : Y a-t-il des incohérences ou des anti-patterns dans l'organisation du projet ?
3. **Schéma de base de données** : Le modèle de données est-il cohérent avec les besoins métier ?
4. **Problèmes identifiés** : Comment résoudre efficacement les blocages actuels (voir section ci-dessous) ?
5. **Recommandations** : Quelles améliorations prioritaires suggérez-vous pour rendre le projet plus robuste et maintenable ?

---

## 🔗 Accès au Projet

### Repository GitHub
**URL principale** : https://github.com/conseil-maker/bilancompetence-ai-v2

### Application Déployée
**URL de production** : https://bilancompetence-ai-v2-9dhbd71gr-netz-informatiques-projects.vercel.app

### Base de Données Supabase
**Projet ID** : `rjklvexwqukhunireqna`
**URL** : https://supabase.com/dashboard/project/rjklvexwqukhunireqna

---

## 📚 Documents Clés à Consulter

### 1. Documentation Principale
- **README.md** : Vue d'ensemble du projet
- **PROJECT_STRUCTURE.md** : Structure détaillée des dossiers et fichiers
- **FINALISATION_PROJET.md** : État actuel et étapes de finalisation

### 2. Schéma de Base de Données
- **supabase/migrations/20251014_initial_schema.sql** : Schéma SQL complet avec toutes les tables

### 3. Configuration
- **.env.local** : Variables d'environnement (Supabase, services tiers)
- **next.config.ts** : Configuration Next.js
- **package.json** : Dépendances et scripts

### 4. Code Source Principal
- **src/app/** : Pages et routes Next.js (App Router)
- **src/components/** : Composants React réutilisables
- **src/services/** : Services métier (AI, Stripe, Calendar, etc.)
- **src/types/** : Définitions TypeScript

---

## 🚧 Problèmes Actuels Identifiés

### 1. Incohérence Schéma de Base de Données vs Code
**Problème** : La table `profiles` dans Supabase a une colonne `full_name`, mais le code de l'application utilise `first_name` et `last_name`.

**Impact** : L'inscription échoue avec l'erreur "Could not find the 'first_name' column of 'profiles' in the schema cache"

**Fichiers concernés** :
- `supabase/migrations/20251014_initial_schema.sql` (définit `full_name`)
- `src/components/forms/RegisterForm.tsx` (utilise `first_name` et `last_name`)
- `src/types/database.types.ts` (définit `first_name` et `last_name`)

**Question** : Quelle est la meilleure approche ? Modifier le schéma SQL ou adapter tout le code ?

### 2. Historique de Corrections Multiples
Le projet a nécessité de nombreuses corrections pendant le déploiement :
- Conflits de routes Next.js (groupes de routes en double)
- Configuration ESLint trop stricte
- Initialisation des services tiers sans clés API
- Erreurs TypeScript avec assertions non-null

**Question** : Ces corrections sont-elles des symptômes d'un problème architectural plus profond ?

### 3. Services Tiers Non Configurés
Les services suivants sont intégrés mais pas encore configurés :
- OpenAI (pour l'analyse IA)
- Stripe (pour les paiements)
- Google Calendar (pour les rendez-vous)

**Question** : L'architecture actuelle permet-elle une intégration propre de ces services ?

---

## 🏗️ Stack Technique

### Frontend
- **Framework** : Next.js 15 (App Router)
- **UI** : React 19, Tailwind CSS, Shadcn/ui
- **Icônes** : Lucide React
- **Validation** : Zod, React Hook Form

### Backend
- **BaaS** : Supabase (PostgreSQL + Auth + Storage)
- **API Routes** : Next.js API Routes
- **Services** : OpenAI, Stripe, Google Calendar

### Déploiement
- **Hébergement** : Vercel
- **CI/CD** : GitHub + Vercel (déploiement automatique)

---

## 👥 Rôles Utilisateurs

Le système gère **3 types d'utilisateurs** :

1. **Bénéficiaires** : Personnes effectuant leur bilan de compétences
2. **Consultants** : Professionnels accompagnant les bénéficiaires
3. **Administrateurs** : Gestion de la plateforme

Chaque rôle a son propre dashboard et ses permissions spécifiques.

---

## 📊 Modèle de Données (Tables Principales)

D'après le schéma SQL :

- **profiles** : Profils utilisateurs (lié à auth.users)
- **bilans** : Dossiers de bilans de compétences
- **tests** : Tests psychométriques
- **documents** : Métadonnées des documents
- **messages** : Messagerie interne
- **activites** : Journal d'activité
- **resources** : Ressources pédagogiques

---

## 🎯 Questions Spécifiques

### Architecture
1. La séparation des routes par rôle (`(admin)`, `(consultant)`, `(beneficiaire)`) est-elle une bonne pratique ?
2. Faut-il utiliser un middleware Next.js pour la gestion des permissions ?
3. Les services dans `src/services/` devraient-ils être refactorisés ?

### Base de Données
1. Le schéma actuel est-il normalisé correctement ?
2. Les relations entre tables sont-elles optimales ?
3. Faut-il ajouter des index pour les performances ?

### Sécurité
1. Les Row Level Security (RLS) policies de Supabase sont-elles suffisantes ?
2. Y a-t-il des failles de sécurité potentielles dans l'architecture actuelle ?

### Performance
1. Y a-t-il des optimisations Next.js à mettre en place (ISR, SSG, etc.) ?
2. La gestion des images et documents est-elle optimale ?

---

## 📦 Livrables Attendus

Nous aimerions recevoir :

1. **Analyse architecturale** : Points forts et points faibles de l'architecture actuelle
2. **Recommandations prioritaires** : Top 5 des améliorations à implémenter immédiatement
3. **Solutions aux problèmes identifiés** : Approches concrètes pour résoudre les blocages actuels
4. **Roadmap technique** : Suggestions pour les prochaines étapes de développement
5. **Best practices** : Conseils pour maintenir la qualité du code à long terme

---

## ⏱️ Contexte Temporel

- **Début du projet** : Octobre 2024
- **Déploiement initial** : 15 octobre 2025
- **État actuel** : Application déployée, fonctionnelle à 95%
- **Blocage principal** : Inscription utilisateur (problème de colonnes DB)

---

## 🙏 Remerciements

Merci d'avance pour votre analyse experte ! Votre regard neuf et vos recommandations nous aideront à solidifier les fondations du projet et à garantir sa scalabilité future.

N'hésitez pas à demander des clarifications ou des fichiers supplémentaires si nécessaire.

---

**Date de la demande** : 15 octobre 2025  
**Demandeur** : Équipe BilanCompetence.AI  
**Analystes sollicités** : Gemini 2.5 Pro & Claude Opus 4.1

