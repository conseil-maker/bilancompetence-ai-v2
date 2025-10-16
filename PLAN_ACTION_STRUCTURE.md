# Plan d'Action Structuré - BilanCompetence.AI v2

Date : 16 octobre 2025
Approche : Base de données → Backend → Frontend → Déploiement

---

## PHASE 1 : BASE DE DONNÉES (Supabase) 🗄️

### 1.1 Audit de la Structure
- [ ] Lire tous les fichiers de migration SQL
- [ ] Vérifier la cohérence des schémas
- [ ] Identifier les tables manquantes ou incomplètes
- [ ] Vérifier les relations (foreign keys)
- [ ] Vérifier les index pour la performance

### 1.2 Corrections de la Structure
- [ ] Corriger les incohérences de nommage (first_name/last_name vs prenom/nom)
- [ ] Ajouter les contraintes manquantes
- [ ] Ajouter les index manquants
- [ ] Créer les vues nécessaires

### 1.3 Données de Test
- [ ] Créer un script de seed pour les données de test
- [ ] Supprimer les données mockées du code
- [ ] Créer des données réalistes pour les tests

### 1.4 Sécurité Base de Données
- [ ] Vérifier les Row Level Security (RLS) policies
- [ ] Vérifier les permissions des rôles
- [ ] Tester l'accès aux données

**Estimation** : 2-3 heures
**Livrable** : Base de données propre, cohérente et sécurisée

---

## PHASE 2 : BACKEND (API Routes & Services) ⚙️

### 2.1 Audit du Backend
- [ ] Lister toutes les routes API
- [ ] Vérifier les imports et dépendances
- [ ] Identifier les méthodes inexistantes
- [ ] Vérifier la gestion des erreurs

### 2.2 Modules IA (Gemini)
- [ ] Vérifier que tous les modules utilisent Gemini
- [ ] Tester chaque module IA individuellement
- [ ] Corriger les erreurs de typage
- [ ] Optimiser les prompts

### 2.3 Services Métier
- [ ] Vérifier le service d'analyse CV
- [ ] Vérifier le service de recommandation
- [ ] Vérifier le service de génération de documents
- [ ] Corriger les appels de méthodes

### 2.4 Intégrations Externes
- [ ] Vérifier l'intégration France Travail API
- [ ] Vérifier l'intégration Supabase
- [ ] Tester les appels API externes

### 2.5 Sécurité Backend
- [ ] Vérifier l'authentification sur toutes les routes
- [ ] Vérifier les validations des données
- [ ] Supprimer les clés API hardcodées
- [ ] Ajouter la gestion des erreurs

**Estimation** : 3-4 heures
**Livrable** : Backend fonctionnel avec toutes les routes opérationnelles

---

## PHASE 3 : FRONTEND (React/Next.js) 🎨

### 3.1 Audit du Frontend
- [ ] Lister tous les composants
- [ ] Vérifier les imports
- [ ] Identifier les composants cassés
- [ ] Vérifier les hooks personnalisés

### 3.2 Composants IA
- [ ] Vérifier QuestionnaireIA
- [ ] Vérifier AnalyseProfile
- [ ] Vérifier RecommandationMetiers
- [ ] Corriger les erreurs de syntaxe

### 3.3 Pages
- [ ] Vérifier toutes les pages du parcours
- [ ] Vérifier les pages de documents
- [ ] Vérifier les pages d'administration
- [ ] Corriger les erreurs de routing

### 3.4 Intégration Backend
- [ ] Vérifier les appels API depuis le frontend
- [ ] Vérifier la gestion des états
- [ ] Vérifier la gestion des erreurs
- [ ] Tester le flux utilisateur complet

### 3.5 UX/UI
- [ ] Vérifier la responsive design
- [ ] Vérifier l'accessibilité
- [ ] Optimiser les performances
- [ ] Ajouter les loading states

**Estimation** : 2-3 heures
**Livrable** : Frontend fonctionnel avec une UX fluide

---

## PHASE 4 : TESTS & QUALITÉ 🧪

### 4.1 Tests Unitaires
- [ ] Configurer Jest correctement
- [ ] Ajouter des tests pour les modules IA
- [ ] Ajouter des tests pour les services
- [ ] Atteindre 60% de couverture minimum

### 4.2 Tests d'Intégration
- [ ] Tester les routes API
- [ ] Tester les flux utilisateur
- [ ] Tester l'intégration Supabase

### 4.3 Tests Manuels
- [ ] Tester le parcours complet d'un bénéficiaire
- [ ] Tester la génération de documents
- [ ] Tester l'analyse IA
- [ ] Tester sur mobile

**Estimation** : 2 heures
**Livrable** : Application testée et validée

---

## PHASE 5 : DÉPLOIEMENT 🚀

### 5.1 Préparation
- [ ] Vérifier que le build local fonctionne
- [ ] Vérifier les variables d'environnement
- [ ] Créer un script de déploiement
- [ ] Documenter le processus

### 5.2 Déploiement Vercel
- [ ] Configurer les variables d'environnement sur Vercel
- [ ] Déployer sur un environnement de staging
- [ ] Tester le staging
- [ ] Déployer en production

### 5.3 Post-Déploiement
- [ ] Vérifier que tout fonctionne
- [ ] Configurer le monitoring
- [ ] Configurer les alertes
- [ ] Documenter l'infrastructure

**Estimation** : 1 heure
**Livrable** : Application déployée et opérationnelle

---

## RÉCAPITULATIF

| Phase | Durée | Priorité |
|-------|-------|----------|
| 1. Base de données | 2-3h | 🔴 Critique |
| 2. Backend | 3-4h | 🔴 Critique |
| 3. Frontend | 2-3h | 🟡 Haute |
| 4. Tests | 2h | 🟡 Haute |
| 5. Déploiement | 1h | 🟢 Normale |

**Total estimé** : 10-13 heures de travail

---

## PROCHAINE ÉTAPE

🎯 **Commencer par la Phase 1 : Audit de la Base de Données**

