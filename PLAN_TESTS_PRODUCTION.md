# 🧪 Plan de Tests - Production

**Application** : BilanCompetence.AI v2  
**Environnement** : Production (Vercel)  
**Date** : 17 octobre 2025

---

## 🎯 Objectifs des Tests

Valider que l'application déployée fonctionne correctement avec toutes les intégrations :
- ✅ Supabase (Base de données)
- ✅ Google Gemini (IA)
- ✅ France Travail (API externe)
- ✅ Authentification
- ✅ Interface utilisateur

---

## 📋 Tests à Effectuer

### 1. Tests d'Infrastructure

#### 1.1 Accessibilité
- [ ] Page d'accueil charge correctement
- [ ] Temps de chargement < 3 secondes
- [ ] Pas d'erreurs 404 ou 500
- [ ] HTTPS activé et certificat valide

#### 1.2 Variables d'Environnement
- [ ] NEXT_PUBLIC_SUPABASE_URL accessible
- [ ] GEMINI_API_KEY configurée
- [ ] FRANCE_TRAVAIL credentials configurés

---

### 2. Tests Supabase

#### 2.1 Connexion à la Base de Données
- [ ] Connexion établie avec succès
- [ ] Requêtes SQL fonctionnent
- [ ] RLS (Row Level Security) activé

#### 2.2 Authentification
- [ ] Page de connexion accessible
- [ ] Inscription d'un nouveau compte
- [ ] Connexion avec email/mot de passe
- [ ] Déconnexion
- [ ] Session persistante

---

### 3. Tests des Fonctionnalités Métier

#### 3.1 Espace Bénéficiaire
- [ ] Accès au tableau de bord
- [ ] Affichage du parcours
- [ ] Création d'expériences
- [ ] Ajout de compétences
- [ ] Visualisation des pistes métiers
- [ ] Téléchargement de documents

#### 3.2 Espace Consultant
- [ ] Accès au tableau de bord
- [ ] Liste des bilans
- [ ] Création d'un nouveau bilan
- [ ] Gestion des rendez-vous
- [ ] Messagerie

#### 3.3 Espace Admin
- [ ] Accès au tableau de bord
- [ ] Gestion des utilisateurs
- [ ] Statistiques
- [ ] Audit Qualiopi

---

### 4. Tests IA (Google Gemini)

#### 4.1 Analyse de CV
- [ ] API `/api/ai/analyze-cv` accessible
- [ ] Upload d'un CV test
- [ ] Extraction des compétences
- [ ] Génération de suggestions

#### 4.2 Analyse de Compétences
- [ ] API `/api/ai/analyze` accessible
- [ ] Analyse d'une expérience
- [ ] Extraction automatique de compétences
- [ ] Pertinence des résultats

#### 4.3 Génération de Contenu
- [ ] Génération de synthèse
- [ ] Suggestions de formations
- [ ] Recommandations personnalisées

---

### 5. Tests API France Travail

#### 5.1 Authentification OAuth
- [ ] Obtention du token d'accès
- [ ] Refresh token fonctionnel
- [ ] Gestion des erreurs d'authentification

#### 5.2 Recherche d'Offres
- [ ] API `/api/france-travail/offres` accessible
- [ ] Recherche par métier
- [ ] Filtrage par localisation
- [ ] Affichage des résultats

---

### 6. Tests d'Expérience Utilisateur

#### 6.1 Navigation
- [ ] Menu principal fonctionnel
- [ ] Liens internes corrects
- [ ] Breadcrumbs affichés
- [ ] Retour arrière fonctionne

#### 6.2 Responsive Design
- [ ] Affichage mobile (< 768px)
- [ ] Affichage tablette (768-1024px)
- [ ] Affichage desktop (> 1024px)
- [ ] Sidebar responsive

#### 6.3 Performance
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Images optimisées

---

### 7. Tests de Sécurité

#### 7.1 Authentification
- [ ] Routes protégées inaccessibles sans auth
- [ ] Redirection vers login si non authentifié
- [ ] Vérification des rôles (bénéficiaire, consultant, admin)
- [ ] Pas d'accès cross-role

#### 7.2 Données Sensibles
- [ ] Pas de clés API exposées dans le code client
- [ ] Variables d'environnement sécurisées
- [ ] CORS configuré correctement
- [ ] Headers de sécurité présents

---

### 8. Tests de Régression

#### 8.1 Fonctionnalités Critiques
- [ ] Création d'un bilan complet
- [ ] Parcours utilisateur de bout en bout
- [ ] Génération de documents PDF
- [ ] Envoi d'emails de notification

#### 8.2 Intégrations
- [ ] Supabase + Auth
- [ ] Gemini + Analyse
- [ ] France Travail + Recherche
- [ ] Toutes les APIs fonctionnent ensemble

---

## 📊 Critères de Validation

### Critères Bloquants (Must Have)
- ✅ Application accessible en HTTPS
- ✅ Authentification fonctionnelle
- ✅ Connexion Supabase établie
- ✅ Pas d'erreurs critiques en console

### Critères Importants (Should Have)
- ✅ IA Gemini fonctionnelle
- ✅ API France Travail accessible
- ✅ Performance < 3s
- ✅ Responsive design correct

### Critères Optionnels (Nice to Have)
- ✅ Performance < 1.5s
- ✅ Score Lighthouse > 90
- ✅ Accessibilité WCAG AA
- ✅ PWA fonctionnelle

---

## 🚀 Procédure de Test

### Étape 1 : Tests Automatisés
```bash
# Tests unitaires
pnpm test

# Tests E2E (si disponibles)
pnpm test:e2e
```

### Étape 2 : Tests Manuels
1. Ouvrir l'application en production
2. Suivre la checklist ci-dessus
3. Noter les résultats dans un rapport
4. Capturer les screenshots des erreurs

### Étape 3 : Tests de Charge (Optionnel)
```bash
# Simuler 100 utilisateurs concurrents
# Vérifier la stabilité du serveur
```

---

## 📝 Rapport de Tests

### Résultats Attendus
- **Taux de réussite** : > 95%
- **Temps de réponse moyen** : < 500ms
- **Erreurs critiques** : 0
- **Warnings acceptables** : < 5

### Actions en Cas d'Échec
1. Identifier la cause racine
2. Corriger le problème
3. Redéployer
4. Re-tester

---

**Document préparé par** : Manus AI  
**Statut** : En attente du déploiement

