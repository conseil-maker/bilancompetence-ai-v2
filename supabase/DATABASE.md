# Documentation de la Base de Données

## Vue d'Ensemble

La base de données est structurée pour supporter un système de gestion de bilans de compétences conforme aux exigences Qualiopi, avec un contrôle d'accès basé sur les rôles (RBAC) et une traçabilité complète des activités.

## Architecture

### Schéma Relationnel

```
auth.users (Supabase Auth)
    ↓
profiles (1:1)
    ↓
bilans (1:N pour bénéficiaire, 1:N pour consultant)
    ↓
    ├── tests (1:N)
    ├── documents (1:N)
    ├── messages (1:N)
    └── activites (1:N)

resources (N:1 avec profiles via created_by)
```

## Tables Principales

### `profiles`
**Description** : Extension du système d'authentification Supabase avec informations utilisateur et rôles.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Clé primaire (référence auth.users) |
| `role` | user_role | Rôle : beneficiaire, consultant, admin |
| `email` | TEXT | Email unique |
| `first_name` | TEXT | Prénom |
| `last_name` | TEXT | Nom |
| `phone` | TEXT | Téléphone |
| `avatar_url` | TEXT | URL de l'avatar |
| `bio` | TEXT | Biographie (pour consultants) |

**Policies RLS** :
- Les utilisateurs peuvent voir et modifier leur propre profil
- Les admins peuvent tout voir et modifier

### `bilans`
**Description** : Dossiers de bilans de compétences avec suivi des 3 phases obligatoires.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Clé primaire |
| `beneficiaire_id` | UUID | Référence au bénéficiaire |
| `consultant_id` | UUID | Référence au consultant assigné |
| `status` | bilan_status | Statut du bilan |
| `titre` | TEXT | Titre du bilan |
| `objectifs` | JSONB | Objectifs définis avec le bénéficiaire |
| `date_debut` | DATE | Date de début |
| `date_fin_prevue` | DATE | Date de fin prévue |
| `preliminaire_completed_at` | TIMESTAMP | Date de fin de la phase préliminaire |
| `investigation_completed_at` | TIMESTAMP | Date de fin de la phase d'investigation |
| `conclusion_completed_at` | TIMESTAMP | Date de fin de la phase de conclusion |
| `synthese_document_url` | TEXT | URL du document de synthèse final |

**Statuts possibles** :
- `en_attente` : Bilan créé, en attente de démarrage
- `preliminaire` : Phase préliminaire en cours
- `investigation` : Phase d'investigation en cours
- `conclusion` : Phase de conclusion en cours
- `termine` : Bilan terminé
- `abandonne` : Bilan abandonné

**Policies RLS** :
- Les bénéficiaires voient leurs propres bilans
- Les consultants voient les bilans qui leur sont assignés
- Les admins voient tous les bilans

### `tests`
**Description** : Tests psychométriques et évaluations réalisés pendant le bilan.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Clé primaire |
| `bilan_id` | UUID | Référence au bilan |
| `type` | test_type | Type de test (personnalite, interets, competences, valeurs, autre) |
| `nom` | TEXT | Nom du test |
| `resultats` | JSONB | Résultats structurés du test |
| `score` | NUMERIC | Score global (si applicable) |
| `interpretation` | TEXT | Interprétation des résultats |
| `completed_at` | TIMESTAMP | Date de complétion |

**Types de tests** :
- `personnalite` : Tests de personnalité (MBTI, Big Five, etc.)
- `interets` : Tests d'intérêts professionnels (RIASEC, STRONG, etc.)
- `competences` : Évaluations de compétences
- `valeurs` : Tests de valeurs professionnelles
- `autre` : Autres types de tests

### `documents`
**Description** : Métadonnées des documents stockés dans Supabase Storage.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Clé primaire |
| `bilan_id` | UUID | Référence au bilan |
| `uploaded_by` | UUID | Utilisateur ayant uploadé le document |
| `nom` | TEXT | Nom du document |
| `type` | TEXT | Type de document (cv, lettre_motivation, synthese, etc.) |
| `file_path` | TEXT | Chemin dans Supabase Storage |
| `file_size` | INTEGER | Taille du fichier en octets |
| `mime_type` | TEXT | Type MIME |

### `messages`
**Description** : Messagerie sécurisée entre bénéficiaire et consultant.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Clé primaire |
| `bilan_id` | UUID | Référence au bilan |
| `sender_id` | UUID | Expéditeur |
| `receiver_id` | UUID | Destinataire |
| `subject` | TEXT | Sujet du message |
| `content` | TEXT | Contenu du message |
| `status` | message_status | Statut (envoye, lu, archive) |
| `sent_at` | TIMESTAMP | Date d'envoi |
| `read_at` | TIMESTAMP | Date de lecture |

### `resources`
**Description** : Bibliothèque de ressources pédagogiques partagées.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Clé primaire |
| `created_by` | UUID | Créateur de la ressource |
| `titre` | TEXT | Titre de la ressource |
| `description` | TEXT | Description |
| `type` | TEXT | Type (article, video, pdf, lien, etc.) |
| `url` | TEXT | URL externe (si applicable) |
| `file_path` | TEXT | Chemin du fichier hébergé (si applicable) |
| `tags` | TEXT[] | Tags pour la recherche |
| `is_public` | BOOLEAN | Visibilité publique |

### `activites`
**Description** : Journal d'activité pour la conformité Qualiopi et le suivi de l'engagement.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Clé primaire |
| `bilan_id` | UUID | Référence au bilan |
| `user_id` | UUID | Utilisateur concerné |
| `type` | TEXT | Type d'activité (connexion, test_complete, message_envoye, etc.) |
| `description` | TEXT | Description de l'activité |
| `metadata` | JSONB | Métadonnées supplémentaires |
| `created_at` | TIMESTAMP | Date de l'activité |

**Types d'activités** :
- `connexion` : Connexion à la plateforme
- `test_complete` : Complétion d'un test
- `message_envoye` : Envoi d'un message
- `document_upload` : Upload d'un document
- `phase_complete` : Complétion d'une phase
- `inactivite_alerte` : Alerte d'inactivité générée

## Row Level Security (RLS)

Toutes les tables ont le RLS activé pour garantir la sécurité des données.

### Principes de base :
1. **Isolation des données** : Chaque utilisateur ne voit que ses propres données ou celles auxquelles il a accès
2. **Contrôle par rôle** : Les permissions sont définies selon le rôle (beneficiaire, consultant, admin)
3. **Traçabilité** : Toutes les actions sont enregistrées dans la table `activites`

### Exemples de policies :

**Bénéficiaires** :
- Peuvent voir et modifier leurs propres bilans
- Peuvent voir leurs tests et documents
- Peuvent envoyer et recevoir des messages liés à leurs bilans

**Consultants** :
- Peuvent voir les bilans qui leur sont assignés
- Peuvent voir les tests et documents de leurs bilans
- Peuvent envoyer et recevoir des messages
- Peuvent créer et gérer des ressources pédagogiques

**Administrateurs** :
- Accès complet à toutes les données
- Peuvent gérer les utilisateurs
- Peuvent générer des rapports Qualiopi

## Migrations

Les migrations sont stockées dans `supabase/migrations/` et doivent être exécutées dans l'ordre chronologique.

### Migration initiale : `20251014_initial_schema.sql`
- Création de tous les types ENUM
- Création de toutes les tables
- Mise en place du RLS
- Création des triggers et fonctions

## Données de Test

Le fichier `supabase/seed.sql` contient des données de test pour le développement.

**⚠️ Important** : Les UUID dans le seed sont fictifs. Vous devez d'abord créer les utilisateurs via Supabase Auth, puis remplacer les UUID dans le seed par les vrais UUID générés.

## Utilisation avec Supabase

### 1. Créer un projet Supabase
- Aller sur [supabase.com](https://supabase.com)
- Créer un nouveau projet
- Choisir une région EU (pour RGPD)

### 2. Exécuter les migrations
- Copier le contenu de `20251014_initial_schema.sql`
- Aller dans SQL Editor de Supabase
- Coller et exécuter le script

### 3. Créer les utilisateurs de test
- Aller dans Authentication > Users
- Créer les utilisateurs manuellement
- Noter les UUID générés

### 4. Charger les données de test
- Modifier `seed.sql` avec les vrais UUID
- Exécuter le script dans SQL Editor

## Bonnes Pratiques

1. **Ne jamais désactiver le RLS** : Toujours garder le RLS activé en production
2. **Utiliser les migrations** : Toute modification de schéma doit passer par une migration
3. **Documenter les changements** : Ajouter des commentaires SQL pour expliquer les modifications
4. **Tester les policies** : Vérifier que les policies RLS fonctionnent correctement avant le déploiement
5. **Sauvegarder régulièrement** : Utiliser les backups automatiques de Supabase

## Prochaines Évolutions

- [ ] Table pour les enquêtes de satisfaction (Qualiopi)
- [ ] Table pour les réclamations (Qualiopi)
- [ ] Table pour la veille (Qualiopi Critère 6)
- [ ] Table pour les formations des consultants (Qualiopi Critère 5)
- [ ] Intégration EDOF (dossiers CPF)
- [ ] Système de notifications en temps réel

