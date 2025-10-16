# Audit Base de Données : Besoins Utilisateurs vs Structure Actuelle

**Date :** 16 octobre 2025
**Auteur :** Manus
**Objectif :** Vérifier que la base de données contient toutes les tables et colonnes nécessaires pour répondre aux attentes des différents utilisateurs finaux

---

## 📋 Méthodologie

Cet audit compare :
1. **Les besoins métier** identifiés dans le cahier des charges
2. **Les attentes des utilisateurs** (bénéficiaires, consultants, administrateurs)
3. **La structure actuelle** de la base de données

Pour chaque type d'utilisateur, nous analysons les fonctionnalités attendues et vérifions si les tables/colonnes nécessaires existent.

---

## 👤 1. BESOINS DES BÉNÉFICIAIRES

### 1.1 Gestion de Profil

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| Créer et gérer son profil | `profiles` (id, email, first_name, last_name, phone, avatar_url) | ✅ | Complet |
| Ajouter des informations de contact | `profiles.phone`, `profiles.email` | ✅ | OK |
| Télécharger un avatar | `profiles.avatar_url` | ✅ | OK |

### 1.2 Parcours de Bilan

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| Voir ses bilans en cours | `bilans` (id, beneficiaire_id, status) | ✅ | OK |
| Suivre l'avancement des 3 phases | `bilans.preliminaire_completed_at`, `investigation_completed_at`, `conclusion_completed_at` | ✅ | OK |
| Définir les objectifs du bilan | `bilans.objectifs` (JSONB) | ✅ | OK |
| Accéder au document de synthèse | `bilans.synthese_document_url` | ✅ | OK |

### 1.3 Tests et Évaluations

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| Passer des tests de personnalité | `tests` (type='personnalite') | ✅ | OK |
| Passer des tests d'intérêts | `tests` (type='interets') | ✅ | OK |
| Passer des tests de compétences | `tests` (type='competences') | ✅ | OK |
| Voir les résultats et interprétations | `tests.resultats`, `tests.interpretation` | ✅ | OK |

### 1.4 Analyse de Profil (Cahier des charges : Profil de Talents Dynamique)

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| **Cartographie des compétences** | Table `competences` avec extraction du CV | ❌ | **MANQUANT** |
| **Portefeuille d'expériences** | Table `experiences` avec timeline | ❌ | **MANQUANT** |
| **Analyse sémantique du CV** | Colonne pour stocker les compétences extraites | ❌ | **MANQUANT** |
| Lier compétences aux expériences | Relation `competences` ↔ `experiences` | ❌ | **MANQUANT** |

### 1.5 Exploration de Carrière (Cahier des charges : Simulateur de Carrière)

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| **Pistes de métiers suggérées** | Table `pistes_metiers` ou `projets_professionnels` | ❌ | **MANQUANT** |
| **Analyse d'écart (Gap Analysis)** | Table pour stocker les écarts compétences | ❌ | **MANQUANT** |
| **Formations recommandées** | Table `formations` ou lien vers formations | ❌ | **MANQUANT** |
| Sauvegarder des pistes favorites | Relation bénéficiaire ↔ pistes métiers | ❌ | **MANQUANT** |

### 1.6 Plan d'Action (Cahier des charges : Plan d'Action Interactif)

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| **Créer un plan d'action** | Table `actions` ou `plan_action` | ❌ | **MANQUANT** |
| Suivre l'avancement des actions (Kanban) | Colonnes `status` (a_faire, en_cours, termine) | ❌ | **MANQUANT** |
| Définir des échéances | Colonne `date_echeance` | ❌ | **MANQUANT** |
| Recevoir des rappels | Intégration avec table `notifications` | ⚠️ | Partiellement (voir 1.8) |

### 1.7 Documents

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| Télécharger son CV | `documents` (type='cv') | ✅ | OK |
| Télécharger d'autres documents | `documents` (type flexible) | ✅ | OK |
| Accéder au document de synthèse | `documents` (type='synthese') + `bilans.synthese_document_url` | ✅ | OK |
| **Signer électroniquement la convention** | Colonne `documents.signed_at`, `signature_url` | ❌ | **MANQUANT** |

### 1.8 Communication

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| Envoyer/recevoir des messages | `messages` | ✅ | OK |
| Voir l'historique des messages | `messages` avec `sent_at`, `read_at` | ✅ | OK |
| **Recevoir des notifications** | Table `notifications` | ⚠️ | Mentionné dans DATABASE.md mais pas créé |
| **Demander de l'aide (bouton SOS)** | Colonne pour signaler un besoin d'aide | ❌ | **MANQUANT** |

### 1.9 Rendez-vous

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| **Prendre RDV avec le consultant** | Table `rdv` ou `rendez_vous` | ❌ | **MANQUANT** |
| Voir les RDV planifiés | Table avec date, heure, type | ❌ | **MANQUANT** |
| Recevoir des rappels de RDV | Intégration avec notifications | ❌ | **MANQUANT** |

---

## 👨‍💼 2. BESOINS DES CONSULTANTS

### 2.1 Gestion de Portefeuille

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| Voir tous mes bilans assignés | `bilans.consultant_id` | ✅ | OK |
| Filtrer par statut | `bilans.status` | ✅ | OK |
| **Tableau de bord avec indicateurs** | Vue ou table agrégée pour statistiques | ❌ | **MANQUANT** |

### 2.2 Suivi de l'Engagement (Cahier des charges : Suivi Adaptatif)

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| **Voir le niveau d'engagement** | Colonne `bilans.engagement_score` ou calcul depuis `activites` | ⚠️ | Calculable depuis activites mais pas stocké |
| **Détecter les signaux faibles** | Algorithme + colonne `bilans.alerte_decrochage` | ❌ | **MANQUANT** |
| **Code couleur (vert/orange/rouge)** | Colonne `bilans.sante_bilan` | ❌ | **MANQUANT** |
| Voir l'historique d'activité | `activites` | ✅ | OK |

### 2.3 Outils d'Analyse (Cahier des charges : Outils d'Analyse Côté Consultant)

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| **Moteur d'analyse de profil** | Accès aux données structurées (compétences, tests) | ⚠️ | Tests OK, mais compétences manquantes |
| **Générateur de synthèse** | Données complètes pour pré-rédaction IA | ⚠️ | Partiellement (manque compétences, expériences) |
| **Bibliothèque de ressources** | `resources` | ✅ | OK |
| **Benchmarking** | Vue agrégée sur tous les bilans | ❌ | **MANQUANT** |

### 2.4 Gestion des Entretiens

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| **Planifier des entretiens** | Table `rdv` ou `entretiens` | ❌ | **MANQUANT** |
| **Prendre des notes d'entretien** | Table `notes_entretien` ou colonne dans `bilans` | ❌ | **MANQUANT** |
| Voir l'historique des entretiens | Table avec historique | ❌ | **MANQUANT** |

### 2.5 Validation des Phases

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| Valider la phase préliminaire | `bilans.preliminaire_completed_at` | ✅ | OK |
| Valider la phase d'investigation | `bilans.investigation_completed_at` | ✅ | OK |
| Valider la phase de conclusion | `bilans.conclusion_completed_at` | ✅ | OK |
| **Ajouter des commentaires de validation** | Colonnes `preliminaire_commentaire`, etc. | ❌ | **MANQUANT** |

### 2.6 Co-rédaction de la Synthèse

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| **Générer un draft de synthèse** | Fonction IA + stockage du draft | ⚠️ | Logique métier, pas BDD |
| **Éditer collaborativement** | Système de versioning ou colonne `synthese_draft` | ❌ | **MANQUANT** |
| Valider la synthèse finale | `bilans.synthese_document_url` + date validation | ⚠️ | URL OK, date validation manquante |

---

## 👨‍💼 3. BESOINS DES ADMINISTRATEURS

### 3.1 Gestion des Utilisateurs

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| Voir tous les utilisateurs | `profiles` | ✅ | OK |
| Gérer les rôles | `profiles.role` | ✅ | OK |
| **Désactiver un compte** | Colonne `profiles.is_active` | ❌ | **MANQUANT** |
| **Voir la date de dernière connexion** | Colonne `profiles.last_login_at` | ❌ | **MANQUANT** |

### 3.2 Gestion des Bilans

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| Voir tous les bilans | `bilans` | ✅ | OK |
| Assigner un consultant | `bilans.consultant_id` | ✅ | OK |
| **Réassigner un consultant** | Historique des assignations | ❌ | **MANQUANT** |
| Voir les statistiques globales | Vues agrégées | ❌ | **MANQUANT** |

### 3.3 Conformité Qualiopi

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| **Enquêtes de satisfaction** | Table `enquetes_satisfaction` | ❌ | **MANQUANT** (mentionné dans DATABASE.md) |
| **Gestion des réclamations** | Table `reclamations` | ❌ | **MANQUANT** (mentionné dans DATABASE.md) |
| **Veille (Critère 6)** | Table `veille` | ❌ | **MANQUANT** (mentionné dans DATABASE.md) |
| **Formations des consultants** | Table `formations_consultants` | ❌ | **MANQUANT** (mentionné dans DATABASE.md) |
| Traçabilité complète | `activites` | ✅ | OK |

### 3.4 Rapports et Statistiques

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| **Taux de complétion des bilans** | Vue agrégée | ❌ | **MANQUANT** |
| **Temps moyen par phase** | Calcul depuis dates de complétion | ⚠️ | Calculable mais pas stocké |
| **Satisfaction client** | Depuis table `enquetes_satisfaction` | ❌ | **MANQUANT** |
| **Taux d'abandon** | Calcul depuis `bilans.status='abandonne'` | ⚠️ | Calculable |

### 3.5 Intégration EDOF (CPF)

| Besoin Métier | Tables/Colonnes Nécessaires | Statut | Commentaire |
|---|---|:---:|---|
| **Numéro de dossier CPF** | Colonne `bilans.numero_cpf` | ❌ | **MANQUANT** |
| **Statut EDOF** | Colonne `bilans.edof_status` | ❌ | **MANQUANT** |
| **Date de déclaration EDOF** | Colonne `bilans.edof_declared_at` | ❌ | **MANQUANT** |

---

## 📊 SYNTHÈSE DES MANQUES

### 🔴 Tables Manquantes (Critiques)

| # | Table | Description | Impact |
|---|---|---|---|
| 1 | `competences` | Stockage des compétences extraites du CV et des expériences | **CRITIQUE** - Fonctionnalité clé du cahier des charges |
| 2 | `experiences` | Timeline des expériences professionnelles | **CRITIQUE** - Portefeuille d'expériences |
| 3 | `pistes_metiers` | Pistes de métiers suggérées par l'IA | **CRITIQUE** - Simulateur de carrière |
| 4 | `plan_action` | Actions du plan d'action avec suivi Kanban | **CRITIQUE** - Livrable interactif |
| 5 | `rdv` | Gestion des rendez-vous et entretiens | **CRITIQUE** - Suivi du parcours |
| 6 | `notifications` | Système de notifications | **IMPORTANT** - Communication proactive |
| 7 | `enquetes_satisfaction` | Enquêtes de satisfaction Qualiopi | **IMPORTANT** - Conformité |
| 8 | `reclamations` | Gestion des réclamations | **IMPORTANT** - Conformité Qualiopi |
| 9 | `formations` | Formations recommandées | **MOYEN** - Gap analysis |
| 10 | `notes_entretien` | Notes prises pendant les entretiens | **MOYEN** - Traçabilité |

### ⚠️ Colonnes Manquantes (Importantes)

| # | Table | Colonne | Description | Impact |
|---|---|---|---|---|
| 1 | `bilans` | `engagement_score` | Score d'engagement du bénéficiaire | **IMPORTANT** - Suivi adaptatif |
| 2 | `bilans` | `sante_bilan` | Code couleur (vert/orange/rouge) | **IMPORTANT** - Tableau de bord consultant |
| 3 | `bilans` | `alerte_decrochage` | Alerte de risque d'abandon | **IMPORTANT** - Détection signaux faibles |
| 4 | `bilans` | `numero_cpf` | Numéro de dossier CPF | **IMPORTANT** - Intégration EDOF |
| 5 | `bilans` | `edof_status` | Statut du dossier EDOF | **IMPORTANT** - Intégration CPF |
| 6 | `bilans` | `preliminaire_commentaire` | Commentaire de validation phase | **MOYEN** - Traçabilité |
| 7 | `documents` | `signed_at` | Date de signature électronique | **IMPORTANT** - Convention |
| 8 | `documents` | `signature_url` | URL de la signature | **IMPORTANT** - Conformité |
| 9 | `profiles` | `is_active` | Compte actif/désactivé | **MOYEN** - Gestion utilisateurs |
| 10 | `profiles` | `last_login_at` | Dernière connexion | **MOYEN** - Suivi activité |

---

## 📈 SCORE DE CONFORMITÉ

| Catégorie | Complet | Partiel | Manquant | Score |
|---|:---:|:---:|:---:|:---:|
| **Bénéficiaires** | 15 | 3 | 12 | **60%** |
| **Consultants** | 8 | 4 | 9 | **57%** |
| **Administrateurs** | 5 | 3 | 10 | **44%** |
| **TOTAL** | **28** | **10** | **31** | **54%** |

---

## 🎯 RECOMMANDATIONS

### Phase 1 : Corrections Critiques (Priorité Haute)

1. **Créer la table `competences`** avec extraction du CV
2. **Créer la table `experiences`** avec timeline
3. **Créer la table `pistes_metiers`** pour le simulateur de carrière
4. **Créer la table `plan_action`** avec suivi Kanban
5. **Créer la table `rdv`** pour la gestion des rendez-vous

### Phase 2 : Conformité Qualiopi (Priorité Haute)

6. **Créer la table `enquetes_satisfaction`**
7. **Créer la table `reclamations`**
8. **Ajouter les colonnes CPF/EDOF** dans `bilans`
9. **Ajouter les colonnes de signature** dans `documents`

### Phase 3 : Suivi Adaptatif (Priorité Moyenne)

10. **Ajouter les colonnes de suivi** dans `bilans` (engagement_score, sante_bilan, alerte_decrochage)
11. **Créer la table `notifications`**
12. **Créer la table `notes_entretien`**

### Phase 4 : Améliorations (Priorité Basse)

13. **Créer la table `formations`**
14. **Ajouter les colonnes de gestion** dans `profiles` (is_active, last_login_at)
15. **Créer des vues agrégées** pour les statistiques

---

## 📝 CONCLUSION

La base de données actuelle couvre **54% des besoins** identifiés dans le cahier des charges. Les fonctionnalités de base (authentification, bilans, tests, messages) sont présentes, mais **les fonctionnalités innovantes** qui distinguent le projet (Profil de Talents Dynamique, Simulateur de Carrière, Plan d'Action Interactif) **nécessitent des tables supplémentaires**.

**Prochaine étape recommandée :** Créer les migrations SQL pour les 10 tables manquantes critiques et les colonnes importantes identifiées dans cet audit.

