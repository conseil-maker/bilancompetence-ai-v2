# BilanCompetence.AI v2

> Plateforme de bilans de compétences nouvelle génération, propulsée par l'intelligence artificielle

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-cyan)](https://tailwindcss.com/)

## 🎯 Vision

BilanCompetence.AI révolutionne les bilans de compétences en combinant l'expertise humaine des consultants avec la puissance de l'intelligence artificielle. Notre plateforme offre une expérience personnalisée, efficace et conforme aux exigences Qualiopi.

## ✨ Fonctionnalités Principales

### Pour les Bénéficiaires

- 📊 **Tableau de bord personnalisé** : Suivi en temps réel de la progression
- 🎯 **Parcours structuré** : 3 phases conformes Qualiopi
- 🧪 **Tests psychométriques** : MBTI, RIASEC, compétences, valeurs
- 💬 **Messagerie sécurisée** : Communication directe avec le consultant
- 📄 **Documents** : Accès aux synthèses et livrables

### Pour les Consultants

- 👥 **Gestion de portefeuille** : Suivi de 12+ bilans simultanés
- 📅 **Calendrier intégré** : Planification avec Google Meet
- 🤖 **Assistance IA** : Recommandations métiers automatiques
- 📈 **Statistiques** : Performance et satisfaction
- ⚠️ **Alertes intelligentes** : Notifications pour actions requises

### Pour les Administrateurs

- 🎛️ **Back-office complet** : Gestion utilisateurs et bilans
- 📊 **Analytics** : KPIs et métriques temps réel
- 💰 **Suivi financier** : Revenus et paiements
- 🔍 **Audit** : Conformité Qualiopi et RGPD

### Modules IA

- 📝 **Analyse de CV** : Extraction automatique des compétences
- 🎯 **Recommandations métiers** : 5 métiers personnalisés avec scores
- 🧠 **Analyse de personnalité** : Soft skills et environnement optimal
- 📋 **Plans de développement** : Objectifs SMART et actions concrètes

## 🛠️ Stack Technique

### Frontend
- **Framework** : Next.js 15.5 (App Router)
- **Language** : TypeScript 5.0
- **Styling** : Tailwind CSS 4.0
- **UI Components** : Lucide React
- **Forms** : React Hook Form + Zod

### Backend
- **Database** : Supabase (PostgreSQL)
- **Auth** : Supabase Auth + RBAC
- **API** : Next.js API Routes
- **Storage** : Supabase Storage

### Intégrations
- **IA** : OpenAI GPT-4.1-mini
- **Paiements** : Stripe
- **Calendrier** : Google Calendar API
- **Visio** : Google Meet

### DevOps
- **Hosting** : Vercel
- **Monitoring** : Vercel Analytics
- **Testing** : Jest + Testing Library

## 🚀 Installation

### Prérequis
- Node.js 20+
- pnpm 10+
- Compte Supabase
- Compte Stripe (test mode)
- Compte OpenAI

### Setup Local

```bash
# Cloner le repository
git clone https://github.com/conseil-maker/bilancompetence-ai-v2.git
cd bilancompetence-ai-v2

# Installer les dépendances
pnpm install

# Copier les variables d'environnement
cp .env.local.example .env.local

# Configurer .env.local avec vos clés API

# Lancer le serveur
pnpm dev
```

L'application sera accessible sur http://localhost:3000

## 📚 Documentation

- [Guide de Déploiement](./DEPLOYMENT.md)
- [Modules IA](./AI_MODULES.md)
- [Intégrations Tierces](./INTEGRATIONS.md)
- [Accessibilité RGAA](./ACCESSIBILITY.md)
- [Optimisation Performances](./PERFORMANCE.md)
- [Base de Données](./supabase/DATABASE.md)

## 🏗️ Structure du Projet

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Pages publiques
│   ├── (beneficiaire)/    # Espace bénéficiaire
│   ├── (consultant)/      # Espace consultant
│   ├── (admin)/           # Back-office admin
│   └── api/               # API Routes
├── components/            # Composants React
├── services/              # Services métier
│   ├── ai/               # Services IA
│   ├── stripe/           # Paiements
│   └── calendar/         # Calendrier
└── types/                 # Types TypeScript
```

## 🧪 Tests

```bash
pnpm test              # Lancer les tests
pnpm test:watch        # Mode watch
pnpm test:coverage     # Couverture
pnpm lighthouse        # Audit Lighthouse
pnpm analyze          # Analyse bundle
```

## 🚢 Déploiement

```bash
# Installer Vercel CLI
pnpm add -g vercel

# Déployer en production
vercel --prod
```

Voir le [Guide de Déploiement](./DEPLOYMENT.md) complet.

## 📊 Conformité

- ✅ **Qualiopi** : 32 indicateurs mappés
- ✅ **RGPD** : Consentement, portabilité, droit à l'oubli
- ✅ **RGAA 4.1** : Niveau AA visé

## 📈 Performance

- **Lighthouse** : > 90 sur tous les critères
- **LCP** : < 2.5s
- **FID** : < 100ms
- **CLS** : < 0.1

## 📝 License

Copyright © 2025 Netz Informatique. Tous droits réservés.

## 📞 Support

- **Email** : support@netz-informatique.fr
- **GitHub** : https://github.com/conseil-maker/bilancompetence-ai-v2

---

Développé avec ❤️ par [Netz Informatique](https://netz-informatique.fr)

