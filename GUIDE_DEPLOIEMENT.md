# Guide de Déploiement - BilanCompetence.AI v2

Date : 16 octobre 2025
Version : 2.0.0

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Configuration Supabase](#configuration-supabase)
3. [Configuration Vercel](#configuration-vercel)
4. [Variables d'Environnement](#variables-denvironnement)
5. [Déploiement](#déploiement)
6. [Vérification](#vérification)
7. [Dépannage](#dépannage)

---

## 🔧 Prérequis

### Comptes Requis

- [x] Compte GitHub avec accès au dépôt
- [x] Compte Supabase (gratuit ou payant)
- [x] Compte Vercel (gratuit ou payant)
- [x] Clé API Gemini (Google AI Studio)

### Comptes Optionnels

- [ ] Compte Stripe (paiements)
- [ ] Compte Google Cloud (Calendar)
- [ ] Compte Sentry (monitoring)
- [ ] Compte SendGrid (emails)

### Outils Locaux

```bash
# Node.js 22+
node --version  # v22.13.0

# pnpm
pnpm --version  # 9.x

# Git
git --version
```

---

## 🗄️ Configuration Supabase

### 1. Créer un Projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Choisir une région (Europe West pour la France)
4. Noter les informations :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Appliquer les Migrations

Les migrations doivent être appliquées dans l'ordre :

```bash
# Se connecter au projet Supabase
npx supabase login

# Lier le projet local au projet Supabase
npx supabase link --project-ref your-project-ref

# Appliquer les migrations
npx supabase db push
```

**Ordre des migrations** :

1. `20251014_initial_schema.sql` - Schéma initial (15 tables)
2. `20251015_split_full_name.sql` - Séparation prénom/nom
3. `20251015_add_missing_tables.sql` - Tables manquantes
4. `20251015_rls_security_enhancement.sql` - Sécurité RLS
5. `20251016_database_optimization_v2.sql` - Optimisations
6. `20251016_add_bilan_id_to_documents.sql` - Relation documents
7. `20251017_fix_optimization.sql` - Corrections finales

### 3. Vérifier les Tables

```sql
-- Dans l'éditeur SQL Supabase
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Vous devriez voir 15 tables :
- `profiles`
- `bilans`
- `phases`
- `sessions`
- `tests_personnalite`
- `competences`
- `experiences`
- `formations`
- `documents`
- `rdv`
- `messages`
- `notifications`
- `logs`
- `settings`
- `analytics`

### 4. Charger les Données de Test (Optionnel)

```bash
# Exécuter le seed
npx supabase db reset --db-url "postgresql://..."
```

---

## ☁️ Configuration Vercel

### 1. Créer un Projet Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "Add New Project"
3. Importer le dépôt GitHub `conseil-maker/bilancompetence-ai-v2`
4. Configurer le projet :
   - **Framework Preset** : Next.js
   - **Root Directory** : `./`
   - **Build Command** : `pnpm build`
   - **Install Command** : `pnpm install`

### 2. Configurer les Variables d'Environnement

Aller dans **Settings → Environment Variables** et ajouter :

#### Variables OBLIGATOIRES

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Gemini AI
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-2.5-flash

# Application
NEXT_PUBLIC_APP_URL=https://bilancompetence-ai-v2.vercel.app
NEXT_PUBLIC_APP_VERSION=2.0.0

# France Travail API
FRANCE_TRAVAIL_CLIENT_ID=PAR_your_client_id
FRANCE_TRAVAIL_CLIENT_SECRET=your_client_secret
FRANCE_TRAVAIL_API_URL=https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire
```

#### Variables OPTIONNELLES

```bash
# Google Calendar
GOOGLE_SERVICE_ACCOUNT_EMAIL=bilancompetence@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----"
GOOGLE_CALENDAR_ID=primary

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=sntrys_...

# SendGrid
SENDGRID_API_KEY=SG...
EMAIL_FROM=noreply@bilancompetence.ai
```

### 3. Configurer les Environnements

Pour chaque variable, sélectionner les environnements :

- ✅ **Production** : pour le site en production
- ✅ **Preview** : pour les branches de développement
- ⬜ **Development** : pour le développement local (utiliser `.env.local`)

### 4. Configurer le Domaine (Optionnel)

1. Aller dans **Settings → Domains**
2. Ajouter votre domaine personnalisé
3. Configurer les DNS selon les instructions

---

## 🚀 Déploiement

### Déploiement Automatique (Recommandé)

Le déploiement est automatique à chaque push sur `master` :

```bash
# Commiter les changements
git add .
git commit -m "feat: déploiement production v2.0.0"

# Pousser sur GitHub
git push origin master
```

Vercel détectera automatiquement le push et déploiera.

### Déploiement Manuel

```bash
# Installer Vercel CLI
pnpm add -g vercel

# Se connecter
vercel login

# Déployer en production
vercel --prod
```

### Déploiement via Interface Vercel

1. Aller sur le dashboard Vercel
2. Sélectionner le projet
3. Cliquer sur "Deployments"
4. Cliquer sur "Redeploy" sur le dernier déploiement

---

## ✅ Vérification

### 1. Vérifier le Build

```bash
# Vérifier les logs de build sur Vercel
# Aller dans Deployments → Cliquer sur le déploiement → Voir les logs
```

Le build doit se terminer avec succès (✓).

### 2. Vérifier le Health Check

```bash
# Tester la route health
curl https://bilancompetence-ai-v2.vercel.app/api/health
```

Réponse attendue :

```json
{
  "timestamp": "2025-10-16T10:00:00.000Z",
  "version": "2.0.0",
  "environment": "production",
  "status": "ok",
  "services": {
    "supabase": true,
    "gemini": true,
    "stripe": true,
    "calendar": true
  }
}
```

### 3. Vérifier l'Authentification

1. Aller sur `https://bilancompetence-ai-v2.vercel.app/login`
2. Créer un compte test
3. Se connecter
4. Vérifier l'accès au dashboard

### 4. Vérifier les Routes API

```bash
# Tester une route API (nécessite authentification)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://bilancompetence-ai-v2.vercel.app/api/profile
```

### 5. Vérifier les Logs

```bash
# Voir les logs en temps réel
vercel logs bilancompetence-ai-v2 --follow
```

---

## 🔧 Dépannage

### Erreur : "Module not found"

**Cause** : Dépendance manquante

**Solution** :

```bash
# Vérifier package.json
pnpm install

# Redéployer
git push origin master
```

### Erreur : "Supabase connection failed"

**Cause** : Variables d'environnement incorrectes

**Solution** :

1. Vérifier les variables dans Vercel
2. Vérifier que `NEXT_PUBLIC_SUPABASE_URL` est correct
3. Vérifier que les clés sont valides
4. Redéployer

### Erreur : "Gemini API error"

**Cause** : Clé API Gemini invalide ou quota dépassé

**Solution** :

1. Vérifier la clé API sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Vérifier les quotas
3. Mettre à jour `GEMINI_API_KEY` dans Vercel
4. Redéployer

### Erreur : "Database migration failed"

**Cause** : Migrations non appliquées ou ordre incorrect

**Solution** :

```bash
# Réinitialiser la base de données
npx supabase db reset

# Réappliquer les migrations dans l'ordre
npx supabase db push
```

### Erreur : "Build timeout"

**Cause** : Build trop long (limite Vercel : 45min gratuit, 60min pro)

**Solution** :

1. Optimiser les dépendances
2. Utiliser le cache Vercel
3. Upgrader le plan Vercel si nécessaire

### Erreur : "Function timeout"

**Cause** : Fonction serverless trop lente (limite : 10s gratuit, 60s pro)

**Solution** :

1. Optimiser les requêtes SQL
2. Ajouter des indexes
3. Utiliser le cache
4. Utiliser Edge Functions pour les routes rapides

### Logs d'Erreur

```bash
# Voir les logs d'erreur
vercel logs bilancompetence-ai-v2 --follow

# Filtrer par erreur
vercel logs bilancompetence-ai-v2 | grep ERROR
```

---

## 📊 Monitoring

### Vercel Analytics

1. Aller dans **Analytics** sur le dashboard Vercel
2. Voir les métriques :
   - Visites
   - Temps de chargement
   - Core Web Vitals

### Sentry (Optionnel)

Si configuré, voir les erreurs sur [sentry.io](https://sentry.io).

### Supabase Logs

1. Aller sur le dashboard Supabase
2. Cliquer sur **Logs**
3. Voir les requêtes SQL et les erreurs

---

## 🔄 Mises à Jour

### Déployer une Nouvelle Version

```bash
# Mettre à jour la version dans package.json
npm version patch  # ou minor, ou major

# Commiter et pousser
git add .
git commit -m "chore: bump version to X.X.X"
git push origin master

# Créer un tag
git tag vX.X.X
git push origin vX.X.X
```

### Rollback

Si un déploiement échoue :

1. Aller sur Vercel → Deployments
2. Trouver le dernier déploiement fonctionnel
3. Cliquer sur "..." → "Promote to Production"

---

## 📞 Support

### Documentation

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Gemini](https://ai.google.dev/docs)

### Aide

- GitHub Issues : [github.com/conseil-maker/bilancompetence-ai-v2/issues](https://github.com/conseil-maker/bilancompetence-ai-v2/issues)
- Email : support@bilancompetence.ai

---

## ✅ Checklist de Déploiement

### Avant le Déploiement

- [ ] Toutes les migrations SQL sont appliquées sur Supabase
- [ ] Toutes les variables d'environnement sont configurées sur Vercel
- [ ] Le build local fonctionne (`pnpm build`)
- [ ] Les tests passent (`pnpm test`)
- [ ] Le code est poussé sur GitHub

### Après le Déploiement

- [ ] Le build Vercel est réussi
- [ ] Le health check répond correctement
- [ ] L'authentification fonctionne
- [ ] Les routes API répondent
- [ ] Les logs ne montrent pas d'erreurs critiques
- [ ] Les Core Web Vitals sont bons (Vercel Analytics)

---

## 🎯 Prochaines Étapes

Après le déploiement initial :

1. Configurer un domaine personnalisé
2. Configurer les webhooks Stripe
3. Configurer Google Calendar
4. Ajouter des tests E2E
5. Configurer le monitoring Sentry
6. Optimiser les performances
7. Ajouter le CI/CD avec GitHub Actions

---

**Bon déploiement ! 🚀**

