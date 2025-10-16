# 🚀 BilanCompetence.AI v2 - Migration Gemini Complète

[![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Gemini API](https://img.shields.io/badge/Gemini-1.5%20Flash-green)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)

## ✨ Nouveautés - Migration Gemini

**Date**: 16 octobre 2025  
**Version**: 2.0.0

### 🎯 Migration OpenAI → Google Gemini

La plateforme a été entièrement migrée de l'API OpenAI vers Google Gemini API, offrant :

- **💰 95% de réduction des coûts** d'intelligence artificielle
- **⚡ Performances équivalentes** avec Gemini 1.5 Flash
- **📈 Capacité accrue** jusqu'à 1M tokens de contexte
- **🔒 Fiabilité** avec l'infrastructure Google

### 📦 Modules IA Migrés

| Module | Description | Statut |
|--------|-------------|--------|
| **Question Generator** | Génération de questions adaptatives | ✅ |
| **Analysis Engine** | Analyse croisée des tests psychométriques | ✅ |
| **CV Analyzer** | Analyse de CV et extraction de compétences | ✅ |
| **Job Recommender** | Recommandations de métiers intelligentes | ✅ |
| **Personality Analyzer** | Analyse de personnalité professionnelle | ✅ |
| **Document Synthesis** | Génération de synthèses personnalisées | ✅ |

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- pnpm 8+
- Compte Supabase
- **Clé API Google Gemini** (gratuite sur https://aistudio.google.com/)

### Installation

```bash
# Cloner le repository
git clone https://github.com/conseil-maker/bilancompetence-ai-v2.git
cd bilancompetence-ai-v2

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés API
```

### Configuration .env.local

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# Google Gemini AI (NOUVEAU - OBLIGATOIRE)
GEMINI_API_KEY=votre_cle_gemini

# France Travail API
FRANCE_TRAVAIL_CLIENT_ID=votre_client_id
FRANCE_TRAVAIL_CLIENT_SECRET=votre_client_secret
```

### Lancement

```bash
# Développement
pnpm run dev

# Production
pnpm run build
pnpm run start
```

## 📚 Documentation

- [Migration Gemini Complète](./MIGRATION_GEMINI_COMPLETE.md)
- [Guide de Déploiement Vercel](./DEPLOIEMENT_VERCEL_GEMINI.md)
- [Modules IA Finaux](./MODULES_IA_FINAL.md)
- [Configuration API](./CONFIGURATION_API.md)

## 🏗️ Architecture

```
bilancompetence-ai-v2/
├── src/
│   ├── app/                    # Routes Next.js App Router
│   │   ├── (public)/          # Pages publiques
│   │   ├── (beneficiaire)/    # Espace bénéficiaire
│   │   ├── (consultant)/      # Espace consultant
│   │   ├── (admin)/           # Back-office admin
│   │   └── api/               # Routes API
│   ├── components/            # Composants React
│   ├── lib/
│   │   ├── ai/               # 🆕 Modules IA Gemini
│   │   ├── tests/            # Tests psychométriques
│   │   ├── matching/         # Matching emploi/formation
│   │   └── automation/       # Automatisation parcours
│   └── services/             # Services externes
├── supabase/                 # Migrations et schéma DB
└── public/                   # Assets statiques
```

## 🔑 Fonctionnalités Principales

### Intelligence Artificielle (Gemini)
- ✅ Génération de questions personnalisées et adaptatives
- ✅ Analyse croisée de 4 tests psychométriques (MBTI, DISC, Big Five, RIASEC)
- ✅ Recommandations de métiers basées sur le profil complet
- ✅ Analyse de CV et extraction de compétences
- ✅ Génération de synthèses professionnelles
- ✅ Plans de développement personnalisés

### Tests Psychométriques
- MBTI (16 personnalités)
- DISC (4 profils comportementaux)
- Big Five (5 traits de personnalité)
- RIASEC (6 types d'intérêts professionnels)

### Matching Intelligent
- Recommandations de métiers (France Travail API)
- Formations adaptées au profil
- Analyse du marché de l'emploi

### Gestion de Parcours
- Phase préliminaire (objectifs et motivations)
- Phase d'investigation (tests et exploration)
- Phase de conclusion (projet professionnel)
- Phase de suivi (accompagnement post-bilan)

### Documents Qualiopi
- Convention de formation
- Feuilles d'émargement (signature électronique)
- Synthèse de bilan
- Attestation de fin de formation
- Certificat de réalisation

## 🧪 Tests

```bash
# Tests unitaires
pnpm run test

# Tests E2E
pnpm run test:e2e

# Linting
pnpm run lint
```

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Via CLI
vercel --prod

# Via GitHub
# Push sur main déclenche automatiquement le déploiement
git push origin main
```

Voir [DEPLOIEMENT_VERCEL_GEMINI.md](./DEPLOIEMENT_VERCEL_GEMINI.md) pour les détails.

## 📊 Coûts Estimés

| Service | Coût mensuel (estimé) |
|---------|----------------------|
| Vercel Pro | 20€ |
| Supabase Pro | 25€ |
| **Gemini API** | **~5€** (vs ~100€ avec OpenAI) |
| France Travail API | Gratuit |
| **Total** | **~50€/mois** |

**Économie**: 95% sur les coûts IA = ~1140€/an économisés

## 🔒 Sécurité & Conformité

- ✅ **Qualiopi**: Conformité certification qualité
- ✅ **RGPD**: Protection des données personnelles
- ✅ **RGAA 4.1**: Accessibilité numérique
- ✅ **RLS Supabase**: Sécurité au niveau des lignes
- ✅ **HTTPS**: Chiffrement des communications
- ✅ **CSP**: Content Security Policy

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](./CONTRIBUTING.md).

## 📝 Licence

Propriétaire - © 2025 BilanCompetence.AI

## 📞 Support

- Email: support@bilancompetence-ai.fr
- GitHub Issues: https://github.com/conseil-maker/bilancompetence-ai-v2/issues
- Documentation: https://docs.bilancompetence-ai.fr

---

**Développé avec ❤️ par l'équipe BilanCompetence.AI**

Propulsé par Next.js, Supabase, et Google Gemini AI
