# Guide de Déploiement Final - BilanCompetence.AI v2

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Configuration des Variables d'Environnement](#configuration-des-variables-denvironnement)
3. [Déploiement sur Vercel](#déploiement-sur-vercel)
4. [Configuration de la Base de Données](#configuration-de-la-base-de-données)
5. [Configuration du CI/CD](#configuration-du-cicd)
6. [Configuration du Monitoring](#configuration-du-monitoring)
7. [Tests de Production](#tests-de-production)
8. [Checklist de Déploiement](#checklist-de-déploiement)

---

## 🔧 Prérequis

### Comptes Requis

- ✅ Compte GitHub (pour le code source et CI/CD)
- ✅ Compte Vercel (pour l'hébergement)
- ✅ Compte Supabase (pour la base de données)
- ⚠️ Compte Sentry (optionnel, pour le monitoring)
- ⚠️ Compte Stripe (optionnel, pour les paiements)

### Outils Locaux

```bash
# Node.js 22.x
node --version  # v22.x.x

# pnpm
pnpm --version  # 10.x.x

# Git
git --version
```

---

## 🔐 Configuration des Variables d'Environnement

### 1. Variables Supabase

Récupérez vos clés depuis le [dashboard Supabase](https://app.supabase.com):

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anonyme
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role
```

### 2. Variables OpenAI (pour l'IA)

```env
OPENAI_API_KEY=sk-...
```

### 3. Variables Stripe (optionnel)

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Variables Sentry (optionnel)

```env
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=...
```

### 5. Variables Google Calendar (optionnel)

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=...
```

---

## 🚀 Déploiement sur Vercel

### Méthode 1: Via l'Interface Vercel (Recommandé)

1. **Connecter le Repository GitHub**
   - Aller sur [vercel.com/new](https://vercel.com/new)
   - Sélectionner le repository `bilancompetence-ai-v2`
   - Cliquer sur "Import"

2. **Configurer le Projet**
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

3. **Ajouter les Variables d'Environnement**
   - Aller dans "Environment Variables"
   - Ajouter toutes les variables listées ci-dessus
   - Sélectionner les environnements: Production, Preview, Development

4. **Déployer**
   - Cliquer sur "Deploy"
   - Attendre la fin du déploiement (3-5 minutes)

### Méthode 2: Via CLI

```bash
# Installer Vercel CLI
pnpm add -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod

# Suivre les instructions
```

### Configuration du Domaine Personnalisé

1. Aller dans "Settings" > "Domains"
2. Ajouter votre domaine: `bilancompetence.ai`
3. Configurer les DNS selon les instructions Vercel

---

## 🗄️ Configuration de la Base de Données

### 1. Exécuter les Migrations

```bash
# Se connecter à Supabase
cd supabase

# Exécuter la migration initiale
psql -h db.xxx.supabase.co -U postgres -d postgres -f migrations/20251014_initial_schema.sql

# Exécuter la migration de split des noms
psql -h db.xxx.supabase.co -U postgres -d postgres -f migrations/20251015_split_full_name.sql
```

### 2. Configurer les Politiques RLS

Les politiques Row Level Security sont déjà définies dans les migrations. Vérifiez qu'elles sont actives:

```sql
-- Vérifier RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### 3. Seed des Données (Optionnel)

```bash
# Données de test
psql -h db.xxx.supabase.co -U postgres -d postgres -f seed.sql
```

### 4. Configurer les Webhooks Supabase

1. Aller dans "Database" > "Webhooks"
2. Créer un webhook pour les événements importants:
   - `profiles` INSERT/UPDATE
   - `bilans` INSERT/UPDATE
   - `sessions` INSERT

---

## ⚙️ Configuration du CI/CD

### 1. Secrets GitHub

Aller dans "Settings" > "Secrets and variables" > "Actions" et ajouter:

```
VERCEL_TOKEN=...
VERCEL_ORG_ID=...
VERCEL_PROJECT_ID=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=...
SENTRY_AUTH_TOKEN=... (optionnel)
SNYK_TOKEN=... (optionnel)
```

### 2. Activer les Workflows

Les workflows sont déjà configurés dans `.github/workflows/`:

- ✅ `test.yml` - Tests unitaires et E2E
- ✅ `deploy.yml` - Déploiement automatique
- ✅ `security.yml` - Scans de sécurité
- ✅ `performance.yml` - Tests de performance
- ✅ `codeql.yml` - Analyse de code
- ✅ `dependencies.yml` - Mise à jour des dépendances

### 3. Branch Protection

Configurer les règles de protection pour `main`:

1. Aller dans "Settings" > "Branches"
2. Ajouter une règle pour `main`:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators

---

## 📊 Configuration du Monitoring

### 1. Sentry (Monitoring des Erreurs)

```bash
# Installer Sentry
pnpm add @sentry/nextjs

# Initialiser
npx @sentry/wizard@latest -i nextjs

# Configurer dans instrumentation.ts (déjà fait)
```

### 2. Vercel Analytics

1. Aller dans "Analytics" sur Vercel
2. Activer "Web Analytics"
3. Ajouter le snippet dans `layout.tsx` (déjà fait)

### 3. Google Analytics (Optionnel)

```tsx
// Ajouter dans src/app/layout.tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="afterInteractive"
/>
```

### 4. Uptime Monitoring

Utiliser [UptimeRobot](https://uptimerobot.com/) ou [Better Uptime](https://betteruptime.com/):

- URL à monitorer: `https://bilancompetence.ai/api/health`
- Intervalle: 5 minutes
- Alertes: Email + SMS

---

## 🧪 Tests de Production

### 1. Tests Manuels

Checklist des fonctionnalités à tester:

- [ ] Page d'accueil charge correctement
- [ ] Inscription d'un nouvel utilisateur
- [ ] Connexion avec email/mot de passe
- [ ] Dashboard bénéficiaire accessible
- [ ] Dashboard consultant accessible
- [ ] Dashboard admin accessible
- [ ] Upload de CV fonctionne
- [ ] Analyse IA du CV fonctionne
- [ ] Recommandations de métiers
- [ ] Prise de rendez-vous
- [ ] Génération de documents
- [ ] Paiement Stripe (en mode test)

### 2. Tests Automatisés

```bash
# Tests unitaires
pnpm test

# Tests E2E
pnpm test:e2e

# Tests de performance
pnpm lighthouse
```

### 3. Tests de Charge

Utiliser [k6](https://k6.io/) ou [Artillery](https://www.artillery.io/):

```bash
# Installer k6
brew install k6

# Exécuter le test
k6 run load-test.js
```

### 4. Tests de Sécurité

```bash
# Scan OWASP ZAP
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://bilancompetence.ai

# Audit npm
pnpm audit

# Scan Snyk
npx snyk test
```

---

## ✅ Checklist de Déploiement

### Avant le Déploiement

- [ ] Tous les tests passent localement
- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Documentation à jour
- [ ] Changelog mis à jour
- [ ] Version bumpée dans `package.json`

### Pendant le Déploiement

- [ ] Build réussit sur Vercel
- [ ] Migrations de base de données exécutées
- [ ] DNS configuré
- [ ] SSL/TLS actif
- [ ] Service Worker enregistré

### Après le Déploiement

- [ ] Tests manuels réussis
- [ ] Monitoring actif (Sentry, Analytics)
- [ ] Alertes configurées
- [ ] Backup de la base de données configuré
- [ ] Documentation de production partagée
- [ ] Équipe notifiée

---

## 🔄 Rollback

En cas de problème:

### Méthode 1: Via Vercel Dashboard

1. Aller dans "Deployments"
2. Trouver le dernier déploiement stable
3. Cliquer sur "..." > "Promote to Production"

### Méthode 2: Via Git

```bash
# Revenir au commit précédent
git revert HEAD
git push origin main

# Ou revenir à un commit spécifique
git reset --hard <commit-hash>
git push origin main --force
```

---

## 📞 Support

### En cas de problème:

1. **Vérifier les logs Vercel**: Dashboard > Deployments > Logs
2. **Vérifier Sentry**: Erreurs en temps réel
3. **Vérifier Supabase**: Dashboard > Logs
4. **Contacter l'équipe**: support@bilancompetence.ai

---

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Sentry](https://docs.sentry.io/)
- [Guide Qualiopi](./docs/qualiopi.md)

---

**Version**: 2.0.0  
**Dernière mise à jour**: 15 octobre 2025  
**Auteur**: Équipe BilanCompetence.AI

