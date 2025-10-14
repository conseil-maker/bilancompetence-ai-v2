# BilanCompetence.AI v2

Plateforme de gestion de bilans de compétences augmentée par l'intelligence artificielle.

## 🎯 Vision

Créer le centre de bilans de compétences de demain, alliant le meilleur de l'humain et de la technologie pour offrir une expérience premium, personnalisée et conforme aux exigences Qualiopi.

## 🚀 Stack Technologique

- **Frontend** : Next.js 15 (App Router) + TypeScript
- **Styling** : Tailwind CSS 4
- **Backend** : Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Déploiement** : Vercel
- **Paiement** : Stripe
- **IA** : OpenAI API
- **Validation** : Zod + React Hook Form

## 📋 Prérequis

- Node.js 20+
- pnpm 10+
- Compte Supabase
- Compte Vercel (pour le déploiement)

## 🛠️ Installation

1. Cloner le repository :
```bash
git clone https://github.com/conseil-maker/bilancompetence-ai-v2.git
cd bilancompetence-ai-v2
```

2. Installer les dépendances :
```bash
pnpm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.local.example .env.local
# Éditer .env.local avec vos clés
```

4. Lancer le serveur de développement :
```bash
pnpm dev
```

5. Ouvrir [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

Voir [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) pour la structure détaillée.

## 🗄️ Base de Données

La base de données Supabase est structurée selon le modèle RBAC (Role-Based Access Control) avec 3 rôles principaux :

- **Bénéficiaire** : Personne réalisant un bilan de compétences
- **Consultant** : Professionnel accompagnant les bénéficiaires
- **Administrateur** : Gestionnaire de la plateforme

### Schéma Principal

- `profiles` : Profils utilisateurs étendus
- `bilans` : Dossiers de bilans de compétences
- `tests` : Tests psychométriques et évaluations
- `documents` : Stockage des documents (CV, synthèses)
- `messages` : Messagerie bénéficiaire-consultant
- `resources` : Bibliothèque de ressources pédagogiques

## 🔐 Authentification

L'authentification est gérée par Supabase Auth avec :
- Email/Password
- FranceConnect+ (pour CPF) - À configurer
- Multi-Factor Authentication (MFA) optionnel

## 🎨 Design System

Les composants UI sont construits avec Tailwind CSS et suivent les principes d'accessibilité RGAA 4.1.

## 📊 Conformité

La plateforme est conçue pour être conforme à :
- **Qualiopi** : Référentiel national qualité
- **RGPD** : Protection des données personnelles
- **RGAA 4.1** : Accessibilité numérique
- **EDOF** : Intégration Mon Compte Formation

## 🚢 Déploiement

Le déploiement se fait automatiquement sur Vercel via GitHub :

```bash
git push origin main
```

Vercel détecte automatiquement Next.js et déploie l'application.

## 📚 Documentation

- [Cahier des Charges](https://github.com/conseil-maker/cahier-charges-bilan-competences)
- [Structure du Projet](./PROJECT_STRUCTURE.md)

## 🤝 Contribution

Ce projet suit une méthodologie Agile avec des sprints de 2 semaines.

## 📝 License

Propriétaire - Netz Informatique

---

**Note** : Ce projet est en cours de développement actif.

