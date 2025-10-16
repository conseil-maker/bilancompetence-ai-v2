# Plan de Corrections Suite aux Rapports d'Expertise

Date : 16 octobre 2025
Basé sur les rapports de Claude (8/10) et Gemini (7.5/10)

## 🔴 PRIORITÉ CRITIQUE (À faire immédiatement)

### 1. Sécurité - Clés API Exposées
**Problème** : Clé Gemini exposée dans les fichiers de code
**Impact** : Risque de vol et utilisation frauduleuse
**Action** :
- [ ] Supprimer toutes les clés API hardcodées du code
- [ ] Vérifier que toutes les clés sont dans .env.local (ignoré par Git)
- [ ] Vérifier que .env.local est bien dans .gitignore
- [ ] Régénérer la clé Gemini si elle a été exposée
- [ ] Configurer les variables d'environnement sur Vercel

### 2. Erreurs de Build TypeScript
**Problème** : Méthodes inexistantes appelées
**Impact** : Déploiement impossible
**Action** :
- [x] Corriger `generateAdaptiveQuestions()` → `generateQuestion()`
- [ ] Vérifier tous les autres appels de méthodes
- [ ] Ajouter des tests unitaires pour éviter ces erreurs

### 3. Données Mockées à Remplacer
**Problème** : Données de test dans le code de production
**Impact** : Expérience utilisateur dégradée
**Action** :
- [ ] Identifier tous les fichiers avec des données mockées
- [ ] Remplacer par des appels API réels ou des données vides
- [ ] Documenter les endpoints API manquants

## 🟡 PRIORITÉ HAUTE (À faire rapidement)

### 4. Tests Insuffisants
**Problème** : Absence de tests automatisés
**Impact** : Risque de régression
**Action** :
- [ ] Configurer Jest correctement
- [ ] Ajouter des tests unitaires pour les modules IA
- [ ] Ajouter des tests d'intégration pour les routes API
- [ ] Configurer CI/CD pour exécuter les tests

### 5. Génération de Documents à Finaliser
**Problème** : Modules de génération PDF incomplets
**Impact** : Fonctionnalité non opérationnelle
**Action** :
- [ ] Finaliser le module de génération de synthèse PDF
- [ ] Finaliser le module de génération de certificat
- [ ] Tester la génération de tous les documents

### 6. Performance Non Optimisée
**Problème** : Appels API séquentiels au lieu de parallèles
**Impact** : Temps de réponse lent
**Action** :
- [ ] Identifier les appels API qui peuvent être parallélisés
- [ ] Utiliser Promise.all() pour les appels parallèles
- [ ] Ajouter du caching pour les données fréquemment utilisées

## 🟢 PRIORITÉ MOYENNE (À faire ensuite)

### 7. Documentation Technique
**Action** :
- [ ] Documenter l'architecture du projet
- [ ] Documenter les endpoints API
- [ ] Créer un guide de contribution

### 8. Monitoring et Logs
**Action** :
- [ ] Configurer Sentry pour le suivi des erreurs
- [ ] Ajouter des logs structurés
- [ ] Configurer des alertes pour les erreurs critiques

### 9. Optimisation du Code
**Action** :
- [ ] Refactoriser le code dupliqué
- [ ] Améliorer la gestion des erreurs
- [ ] Optimiser les requêtes Supabase

## 📋 Ordre d'Exécution Recommandé

1. **Sécurité** : Corriger les clés API exposées
2. **Build** : Corriger toutes les erreurs TypeScript
3. **Données** : Remplacer les données mockées
4. **Tests** : Ajouter des tests de base
5. **Documents** : Finaliser la génération de documents
6. **Performance** : Optimiser les appels API
7. **Déploiement** : Tester et déployer sur Vercel

## 🎯 Objectif Final

Avoir une application :
- ✅ Sécurisée (pas de clés exposées)
- ✅ Fonctionnelle (toutes les features opérationnelles)
- ✅ Testée (tests automatisés)
- ✅ Performante (temps de réponse < 2s)
- ✅ Déployable (build sans erreur)
- ✅ Maintenable (code propre et documenté)

---

**Estimation totale** : 6-8 heures de travail
**Priorité immédiate** : Points 1, 2, 3 (2-3 heures)

