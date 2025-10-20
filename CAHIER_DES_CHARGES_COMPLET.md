# Cahier des Charges - BilanCompetence.AI v2

**Date de création** : 17 octobre 2025  
**Version** : 2.0  
**Client** : NETZ INFORMATIQUE  
**Projet** : Plateforme SaaS de Bilans de Compétences avec Intelligence Artificielle

---

## 1. CONTEXTE ET OBJECTIFS

### 1.1 Contexte

Le projet BilanCompetence.AI v2 vise à créer une plateforme web moderne et innovante pour la réalisation de bilans de compétences professionnels. La plateforme doit intégrer l'intelligence artificielle pour automatiser et enrichir le processus d'évaluation des compétences.

### 1.2 Objectifs Principaux

1. **Digitaliser le processus de bilan de compétences** pour le rendre accessible en ligne
2. **Automatiser l'analyse des compétences** grâce à l'IA (Google Gemini)
3. **Faciliter la collaboration** entre bénéficiaires et consultants
4. **Intégrer les données France Travail** via API officielle
5. **Offrir une expérience utilisateur exceptionnelle** et intuitive
6. **Garantir la conformité RGAA 4.1** et la sécurité des données

---

## 2. PÉRIMÈTRE FONCTIONNEL

### 2.1 Types d'Utilisateurs

#### 2.1.1 Bénéficiaire
- Personne réalisant un bilan de compétences
- Accès à son espace personnel
- Suivi de son parcours
- Communication avec son consultant

#### 2.1.2 Consultant
- Professionnel accompagnant les bénéficiaires
- Gestion de plusieurs bilans simultanés
- Outils d'analyse et de reporting
- Planification des rendez-vous

#### 2.1.3 Administrateur
- Gestion globale de la plateforme
- Supervision des utilisateurs et des bilans
- Accès aux statistiques et tableaux de bord
- Configuration du système

### 2.2 Modules Fonctionnels

#### 2.2.1 Module d'Authentification
- **Inscription** avec validation par email
- **Connexion** sécurisée (email/mot de passe)
- **Gestion des rôles** (bénéficiaire, consultant, admin)
- **Récupération de mot de passe**
- **Profil utilisateur** (prénom, nom, email, téléphone)

#### 2.2.2 Module Bilan de Compétences
- **Création de bilan** par le consultant
- **Phases du bilan** :
  - Phase préliminaire
  - Phase d'investigation
  - Phase de conclusion
- **Statuts** : brouillon, en cours, terminé, archivé
- **Dates** : date de début, date de fin prévue
- **Documents** : upload et gestion de fichiers

#### 2.2.3 Module Compétences
- **Catalogue de compétences** prédéfini
- **Évaluation des compétences** (auto-évaluation + évaluation consultant)
- **Niveau de maîtrise** (débutant, intermédiaire, avancé, expert)
- **Compétences transversales** et **compétences métier**
- **Analyse IA** des compétences via Gemini

#### 2.2.4 Module France Travail (Pôle Emploi)
- **Intégration API France Travail**
- **Recherche d'offres d'emploi** selon le profil
- **Synchronisation des compétences** avec le référentiel ROME
- **Authentification OAuth2** avec les identifiants fournis

#### 2.2.5 Module Intelligence Artificielle
- **Analyse automatique des compétences** via Google Gemini
- **Suggestions de parcours professionnels**
- **Génération de rapports** personnalisés
- **Recommandations de formations**
- **Modèle** : `gemini-2.0-flash-exp`

#### 2.2.6 Module Rendez-vous
- **Planification de RDV** entre bénéficiaire et consultant
- **Calendrier interactif**
- **Notifications** par email
- **Visioconférence** (intégration future)

#### 2.2.7 Module Messagerie
- **Messagerie interne** entre bénéficiaire et consultant
- **Notifications** en temps réel
- **Historique des conversations**

#### 2.2.8 Module Plan d'Action
- **Création de plan d'action** personnalisé
- **Objectifs SMART** (Spécifiques, Mesurables, Atteignables, Réalistes, Temporels)
- **Suivi des actions**
- **Validation par le consultant**

#### 2.2.9 Module Statistiques (Admin)
- **Dashboard administrateur**
- **Nombre de bilans** (total, en cours, terminés)
- **Nombre d'utilisateurs** par rôle
- **Taux de complétion** des bilans
- **Graphiques et visualisations**

#### 2.2.10 Module Qualiopi
- **Conformité Qualiopi** pour les organismes de formation
- **Gestion des indicateurs qualité**
- **Suivi des certifications**

---

## 3. SPÉCIFICATIONS TECHNIQUES

### 3.1 Architecture

#### 3.1.1 Frontend
- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **Composants** : Shadcn/UI
- **Validation** : Zod
- **Gestion d'état** : React Context API

#### 3.1.2 Backend
- **Framework** : Next.js API Routes
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **Storage** : Supabase Storage (fichiers)
- **Temps réel** : Supabase Realtime

#### 3.1.3 Intégrations Externes
- **IA** : Google Gemini API (`gemini-2.0-flash-exp`)
- **Emploi** : France Travail API (OAuth2)
- **Paiement** : Stripe (à implémenter)
- **Email** : Service d'emailing (à définir)

### 3.2 Base de Données

#### 3.2.1 Tables Principales

**Table `profiles`**
```sql
- id (UUID, PK, FK vers auth.users)
- email (TEXT, UNIQUE)
- role (ENUM: admin, consultant, beneficiaire)
- first_name (TEXT)
- last_name (TEXT)
- phone (TEXT, optionnel)
- avatar_url (TEXT, optionnel)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- last_login_at (TIMESTAMP)
```

**Table `bilans`**
```sql
- id (UUID, PK)
- beneficiaire_id (UUID, FK vers profiles)
- consultant_id (UUID, FK vers profiles)
- status (ENUM: brouillon, en_cours, termine, archive)
- phase (ENUM: preliminaire, investigation, conclusion)
- date_debut (DATE)
- date_fin_prevue (DATE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Table `competences`**
```sql
- id (UUID, PK)
- bilan_id (UUID, FK vers bilans)
- nom (TEXT)
- categorie (TEXT)
- niveau (ENUM: debutant, intermediaire, avance, expert)
- auto_evaluation (INTEGER, 1-5)
- evaluation_consultant (INTEGER, 1-5)
- created_at (TIMESTAMP)
```

**Table `rdv`**
```sql
- id (UUID, PK)
- bilan_id (UUID, FK vers bilans)
- beneficiaire_id (UUID, FK vers profiles)
- consultant_id (UUID, FK vers profiles)
- date (TIMESTAMP)
- duree (INTEGER, minutes)
- statut (ENUM: planifie, confirme, annule, termine)
- notes (TEXT)
```

**Table `messages`**
```sql
- id (UUID, PK)
- bilan_id (UUID, FK vers bilans)
- sender_id (UUID, FK vers profiles)
- receiver_id (UUID, FK vers profiles)
- content (TEXT)
- read (BOOLEAN)
- created_at (TIMESTAMP)
```

**Table `plan_actions`**
```sql
- id (UUID, PK)
- bilan_id (UUID, FK vers bilans)
- objectif (TEXT)
- actions (JSONB)
- echeance (DATE)
- statut (ENUM: en_cours, termine, abandonne)
```

#### 3.2.2 Triggers et Fonctions

**Trigger `handle_new_user()`**
- Création automatique du profil lors de l'inscription
- Copie des métadonnées (first_name, last_name, phone, role)

**Trigger `update_last_login()`**
- Mise à jour de `last_login_at` lors de la connexion

**Fonction `get_user_statistics()`**
- Calcul des statistiques pour le dashboard admin

### 3.3 APIs

#### 3.3.1 API Routes Next.js

**Authentification**
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/reset-password` - Réinitialisation

**Bilans**
- `GET /api/bilans` - Liste des bilans
- `POST /api/bilans` - Créer un bilan
- `GET /api/bilans/[id]` - Détails d'un bilan
- `PATCH /api/bilans/[id]` - Mettre à jour un bilan
- `DELETE /api/bilans/[id]` - Supprimer un bilan

**Compétences**
- `GET /api/competences` - Liste des compétences
- `POST /api/competences` - Ajouter une compétence
- `PATCH /api/competences/[id]` - Modifier une compétence
- `DELETE /api/competences/[id]` - Supprimer une compétence

**IA**
- `POST /api/ai/analyze-competences` - Analyser les compétences
- `POST /api/ai/generate-report` - Générer un rapport
- `POST /api/ai/suggest-parcours` - Suggérer un parcours

**France Travail**
- `GET /api/france-travail/offres` - Rechercher des offres
- `GET /api/france-travail/competences` - Référentiel ROME

**Santé**
- `GET /api/health` - État de santé de l'application

### 3.4 Variables d'Environnement

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]

# Google Gemini
GEMINI_API_KEY=[API_KEY]
GEMINI_MODEL=gemini-2.0-flash-exp

# France Travail
FRANCE_TRAVAIL_CLIENT_ID=[CLIENT_ID]
FRANCE_TRAVAIL_CLIENT_SECRET=[CLIENT_SECRET]
FRANCE_TRAVAIL_API_URL=https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire

# Application
NEXT_PUBLIC_APP_VERSION=2.0.0
NODE_ENV=production
```

---

## 4. INTERFACE UTILISATEUR

### 4.1 Pages Publiques

1. **Page d'accueil** (`/`)
   - Présentation de la plateforme
   - Avantages et fonctionnalités
   - Témoignages
   - Call-to-action (Commencer, Se connecter)

2. **Page Tarifs** (`/tarifs`)
   - Grille tarifaire
   - Comparaison des offres
   - FAQ

3. **Page À propos** (`/a-propos`)
   - Présentation de l'équipe
   - Mission et valeurs
   - Certifications

4. **Page Contact** (`/contact`)
   - Formulaire de contact
   - Coordonnées
   - Carte

5. **Page Connexion** (`/login`)
   - Formulaire de connexion
   - Lien vers inscription
   - Mot de passe oublié

6. **Page Inscription** (`/register`)
   - Formulaire d'inscription
   - Validation en temps réel
   - Lien vers connexion

### 4.2 Espace Bénéficiaire

1. **Dashboard** (`/beneficiaire/dashboard`)
   - Vue d'ensemble du bilan
   - Prochains rendez-vous
   - Messages non lus
   - Progression

2. **Mon Bilan** (`/mon-bilan`)
   - Détails du bilan en cours
   - Phase actuelle
   - Documents
   - Historique

3. **Mes Compétences** (`/mes-competences`)
   - Liste des compétences évaluées
   - Auto-évaluation
   - Graphiques de progression

4. **Mes Rendez-vous** (`/mes-rdv`)
   - Calendrier des RDV
   - Planifier un RDV
   - Historique

5. **Ma Messagerie** (`/ma-messagerie`)
   - Conversations avec le consultant
   - Notifications

6. **Mon Plan d'Action** (`/plan-action`)
   - Objectifs définis
   - Actions à réaliser
   - Suivi

7. **Mon Profil** (`/profil`)
   - Informations personnelles
   - Paramètres
   - Sécurité

### 4.3 Espace Consultant

1. **Dashboard** (`/consultant/dashboard`)
   - Bilans en cours
   - Rendez-vous du jour
   - Statistiques

2. **Mes Bilans** (`/consultant/bilans`)
   - Liste des bilans gérés
   - Filtres et recherche
   - Création de bilan

3. **Détail Bilan** (`/consultant/bilans/[id]`)
   - Informations bénéficiaire
   - Compétences évaluées
   - Documents
   - Notes

4. **Mes Rendez-vous** (`/consultant/rdv`)
   - Calendrier
   - Planification
   - Visioconférence

5. **Messagerie** (`/consultant/messagerie`)
   - Conversations avec bénéficiaires

6. **Profil** (`/consultant/profil`)
   - Informations professionnelles
   - Certifications

### 4.4 Espace Administrateur

1. **Dashboard Admin** (`/admin/dashboard`)
   - Statistiques globales
   - Graphiques
   - Indicateurs clés

2. **Gestion Utilisateurs** (`/utilisateurs`)
   - Liste des utilisateurs
   - Création/modification
   - Attribution de rôles

3. **Gestion Bilans** (`/tous-bilans`)
   - Vue globale des bilans
   - Supervision
   - Exports

4. **Statistiques** (`/statistiques`)
   - Rapports détaillés
   - Exports CSV/PDF

5. **Qualiopi** (`/qualiopi`)
   - Indicateurs qualité
   - Certifications
   - Audits

6. **Tests** (`/tests`)
   - Tests techniques
   - Monitoring

7. **Paramètres** (`/parametres`)
   - Configuration globale
   - Intégrations
   - Sécurité

### 4.5 Composants Réutilisables

#### 4.5.1 Layouts
- **Header** : Logo, navigation, actions utilisateur
- **Footer** : Liens, mentions légales, réseaux sociaux
- **Sidebar** : Navigation latérale pour espaces authentifiés

#### 4.5.2 Formulaires
- **LoginForm** : Connexion
- **RegisterForm** : Inscription
- **BilanForm** : Création/édition de bilan
- **CompetenceForm** : Ajout de compétence
- **RdvForm** : Planification de rendez-vous

#### 4.5.3 Composants UI
- **Button** : Boutons avec variantes
- **Input** : Champs de saisie
- **Select** : Listes déroulantes
- **Card** : Cartes d'information
- **Table** : Tableaux de données
- **Modal** : Fenêtres modales
- **Toast** : Notifications
- **Loader** : Indicateurs de chargement

---

## 5. EXIGENCES NON FONCTIONNELLES

### 5.1 Performance

- **Temps de chargement** : < 3 secondes (First Contentful Paint)
- **First Load JS** : < 250 KB
- **Optimisation images** : WebP, lazy loading
- **Cache** : Stratégie de cache efficace

### 5.2 Sécurité

- **Authentification** : JWT via Supabase Auth
- **Chiffrement** : HTTPS obligatoire
- **Validation** : Validation côté client et serveur
- **Protection CSRF** : Tokens CSRF
- **RLS** : Row Level Security sur Supabase
- **Secrets** : Variables d'environnement sécurisées
- **Pas de secrets dans Git** : .gitignore strict

### 5.3 Accessibilité

- **Conformité RGAA 4.1**
- **Contraste** : Ratio minimum 4.5:1
- **Navigation clavier** : Complète
- **ARIA** : Labels et rôles appropriés
- **Screen readers** : Compatible

### 5.4 Responsive Design

- **Mobile First**
- **Breakpoints** : sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly** : Zones de clic adaptées

### 5.5 SEO

- **Meta tags** : Title, description, OG tags
- **Sitemap** : Généré automatiquement
- **Robots.txt** : Configuration appropriée
- **URLs sémantiques**

### 5.6 Monitoring

- **Logs** : Supabase Logs
- **Erreurs** : Tracking des erreurs
- **Analytics** : Suivi des utilisateurs (à définir)

---

## 6. DÉPLOIEMENT

### 6.1 Environnements

1. **Développement** : Local
2. **Preview** : Vercel Preview (par branche)
3. **Production** : Vercel Production

### 6.2 CI/CD

- **GitHub** : Repository principal
- **Vercel** : Déploiement automatique
- **Build** : Vérification TypeScript + Linting
- **Tests** : Tests unitaires (à implémenter)

### 6.3 Domaines

- **Production** : `bilancompetence-ai-v2.vercel.app`
- **Custom domain** : À configurer

---

## 7. LIVRABLES

### 7.1 Code Source

- **Repository GitHub** : https://github.com/conseil-maker/bilancompetence-ai-v2
- **Documentation technique** : README.md
- **Guide de contribution** : CONTRIBUTING.md

### 7.2 Documentation

- **Cahier des charges** (ce document)
- **Guide d'utilisation** : Manuel utilisateur
- **Guide administrateur** : Configuration et maintenance
- **Documentation API** : Endpoints et exemples

### 7.3 Migrations

- **Scripts SQL** : Migrations Supabase
- **Données de test** : Jeu de données initial

### 7.4 Comptes de Test

- **Admin** : `admin@bilancompetence.ai` / `Admin123!@#`
- **Consultant** : `consultant@bilancompetence.ai` / `Consultant123!@#`
- **Bénéficiaire** : `beneficiaire@bilancompetence.ai` / `Beneficiaire123!@#`

---

## 8. PLANNING ET JALONS

### Phase 1 : Fondations (Terminée)
- ✅ Setup projet Next.js + TypeScript
- ✅ Configuration Supabase
- ✅ Authentification de base
- ✅ Structure des tables

### Phase 2 : Modules Principaux (Terminée)
- ✅ Module Bilans
- ✅ Module Compétences
- ✅ Module Rendez-vous
- ✅ Module Messagerie

### Phase 3 : Intégrations (En cours)
- ✅ Google Gemini API
- ✅ France Travail API
- ⏳ Stripe (à faire)

### Phase 4 : UX/UI (En cours)
- ✅ Design system
- ⚠️ Formulaires (bugs à corriger)
- ✅ Responsive design
- ✅ Accessibilité

### Phase 5 : Tests et Déploiement (En cours)
- ✅ Déploiement Vercel
- ⚠️ Tests utilisateurs (bloqué)
- ⏳ Optimisations
- ⏳ Documentation

### Phase 6 : Mise en Production
- ⏳ Formation utilisateurs
- ⏳ Migration données
- ⏳ Lancement

---

## 9. CONTRAINTES ET RISQUES

### 9.1 Contraintes

- **Budget** : À définir
- **Délai** : À définir
- **Ressources** : 1 développeur (Manus AI)

### 9.2 Risques Identifiés

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Problèmes d'inscription | ⚠️ Critique | Élevée | Correction urgente du formulaire |
| Complexité IA | Moyen | Moyenne | Tests approfondis |
| API France Travail | Moyen | Faible | Gestion des erreurs |
| Performance | Faible | Faible | Monitoring continu |

---

## 10. POINTS BLOQUANTS ACTUELS

### 10.1 Formulaire d'Inscription

**Problème** : Le formulaire d'inscription ne se soumet pas.

**Causes possibles** :
1. Validation du champ téléphone (malgré correction)
2. Problème de gestion d'état React
3. Erreur JavaScript non visible

**Actions nécessaires** :
1. Audit complet du composant RegisterForm
2. Tests unitaires du formulaire
3. Simplification de la validation
4. Tests end-to-end

### 10.2 Création des Comptes de Test

**Problème** : Impossible de créer les comptes via l'interface.

**Solution alternative** :
1. Création manuelle via Supabase Dashboard
2. Script SQL d'insertion directe
3. API admin pour création de comptes

---

## 11. RECOMMANDATIONS

### 11.1 Court Terme (Urgent)

1. **Corriger le formulaire d'inscription** en priorité absolue
2. **Créer les comptes de test** manuellement via Supabase
3. **Tester le flux complet** de création de bilan
4. **Documenter les bugs** rencontrés

### 11.2 Moyen Terme

1. **Implémenter les tests automatisés** (Jest, Playwright)
2. **Optimiser les performances** (images, bundle size)
3. **Améliorer l'accessibilité** (audit RGAA complet)
4. **Ajouter Stripe** pour les paiements

### 11.3 Long Terme

1. **Intégration visioconférence** (Zoom, Google Meet)
2. **Application mobile** (React Native)
3. **Exports PDF** avancés
4. **Multilingue** (i18n)

---

## 12. CONCLUSION

Le projet BilanCompetence.AI v2 est **techniquement avancé** avec une architecture solide, des intégrations IA innovantes et un design moderne. Cependant, des **problèmes critiques d'UX** (formulaire d'inscription) doivent être résolus avant la mise en production.

**Prochaines étapes prioritaires** :
1. ✅ Corriger le formulaire d'inscription
2. ✅ Créer les comptes de test
3. ✅ Tester le parcours utilisateur complet
4. ✅ Documenter les fonctionnalités
5. ✅ Former les utilisateurs
6. ✅ Lancer en production

---

**Document rédigé par** : Manus AI  
**Date** : 17 octobre 2025  
**Version** : 1.0

