# Guide de Déploiement Vercel - BilanCompetence.AI v2 avec Gemini

**Date**: 16 octobre 2025  
**Version**: 2.0.0 - Migration Gemini complète

---

## 🚀 Déploiement Rapide

### Option 1: Déploiement via GitHub (Recommandé)

1. **Pousser le code sur GitHub**
   ```bash
   cd /home/ubuntu/bilancompetence-ai-v2
   git add .
   git commit -m "feat: Migration complète vers Google Gemini API - Production ready"
   git push origin main
   ```

2. **Connecter à Vercel**
   - Aller sur https://vercel.com
   - Cliquer sur "Import Project"
   - Sélectionner le repository `conseil-maker/bilancompetence-ai-v2`
   - Vercel détectera automatiquement Next.js

3. **Configurer les variables d'environnement** (voir section ci-dessous)

4. **Déployer** - Vercel déploiera automatiquement

### Option 2: Déploiement via CLI Vercel

```bash
# Installer Vercel CLI si nécessaire
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer en production
vercel --prod
```

---

## 🔐 Variables d'Environnement Vercel

### Configuration requise dans Vercel Dashboard

Aller dans **Settings > Environment Variables** et ajouter :

#### 1. Supabase (Base de données et Auth)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://gvxpnfzjdqhqcgmvqoqv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2eHBuZnpqZHFocWNnbXZxb3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5MDQ5NzEsImV4cCI6MjA0NDQ4MDk3MX0.bFyBvMBqRKlWGSUeVVPJFCDXyMHVHcGFPNwFPLPpZqk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2eHBuZnpqZHFocWNnbXZxb3F2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODkwNDk3MSwiZXhwIjoyMDQ0NDgwOTcxfQ.KxOvQWvBRqjZmVNVJbgOXdGkVxQBjQGPfCkNJqCFQCg
```

#### 2. Google Gemini AI (NOUVEAU - OBLIGATOIRE)
```bash
GEMINI_API_KEY=AIzaSyCanwPlXB0b78ay3jmOnq4XWRfTWAcNzEI
```

#### 3. France Travail API (Matching emploi)
```bash
FRANCE_TRAVAIL_CLIENT_ID=PAR_bilancompetenceaiv2_18dcbf45de0cc17727f8521c50e8981379ec452cf6aa68aa9066a00d3d0acc97
FRANCE_TRAVAIL_CLIENT_SECRET=6c44a89177dc912b4faf7e799d025146d03a56b9533c3a7b39f659ecb9c60767
FRANCE_TRAVAIL_API_URL=https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire
```

#### 4. Optionnel - Stripe (Paiements)
```bash
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
# STRIPE_SECRET_KEY=sk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...
```

#### 5. Optionnel - Google Calendar
```bash
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GOOGLE_REDIRECT_URI=https://votre-domaine.vercel.app/api/auth/callback/google
```

#### 6. Optionnel - Monitoring
```bash
# NEXT_PUBLIC_SENTRY_DSN=...
```

---

## 📋 Checklist Pré-Déploiement

### Code
- [x] Migration Gemini complète
- [x] Toutes les erreurs de syntaxe corrigées
- [x] ESLint configuré pour ignorer les warnings
- [x] Configuration Next.js optimisée
- [x] Variables d'environnement dans .env.local

### Base de données
- [ ] Migrations Supabase exécutées
- [ ] Tables créées et RLS activé
- [ ] Seed data (optionnel) inséré

### APIs
- [x] Clé Gemini API valide et testée
- [x] Credentials France Travail configurés
- [ ] Stripe configuré (si paiements activés)
- [ ] Google Calendar configuré (si agenda activé)

### Vercel
- [ ] Compte Vercel créé/connecté
- [ ] Repository GitHub lié
- [ ] Variables d'environnement configurées
- [ ] Domaine personnalisé configuré (optionnel)

---

## 🔧 Configuration Vercel Recommandée

### Build Settings
```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

### Environment Variables Scope
- ✅ Production
- ✅ Preview
- ✅ Development

### Domaine
- Production: `bilancompetence-ai.vercel.app` (ou domaine personnalisé)
- Preview: Automatique pour chaque PR

---

## 🧪 Tests Post-Déploiement

### 1. Vérifier l'accès
```bash
# Tester la page d'accueil
curl https://votre-domaine.vercel.app

# Tester une route API
curl https://votre-domaine.vercel.app/api/health
```

### 2. Tester les fonctionnalités IA
- [ ] Génération de questions
- [ ] Analyse de profil
- [ ] Recommandations de métiers
- [ ] Génération de synthèse

### 3. Vérifier l'authentification
- [ ] Inscription
- [ ] Connexion
- [ ] Déconnexion
- [ ] Récupération de mot de passe

### 4. Tester les intégrations
- [ ] Supabase (base de données)
- [ ] Gemini API (IA)
- [ ] France Travail API (emploi)

---

## 📊 Monitoring

### Vercel Analytics
- Activer dans Settings > Analytics
- Surveiller les performances
- Vérifier les erreurs

### Gemini API Usage
- Dashboard: https://aistudio.google.com/app/apikey
- Surveiller les quotas
- Vérifier les coûts

### Supabase
- Dashboard: https://supabase.com/dashboard
- Surveiller les requêtes
- Vérifier les logs

---

## 🐛 Dépannage

### Erreur: "GEMINI_API_KEY is not defined"
**Solution**: Vérifier que la variable est bien configurée dans Vercel et redéployer

### Erreur: "Failed to compile"
**Solution**: Vérifier les logs de build dans Vercel Dashboard

### Erreur: "Database connection failed"
**Solution**: Vérifier les credentials Supabase et les règles RLS

### Erreur 500 sur les routes API
**Solution**: Vérifier les logs de fonction dans Vercel Dashboard > Functions

---

## 🔄 Mises à jour

### Déploiement automatique
Chaque push sur `main` déclenchera automatiquement un déploiement.

### Déploiement manuel
```bash
# Via CLI
vercel --prod

# Via GitHub
git push origin main
```

### Rollback
Dans Vercel Dashboard > Deployments, cliquer sur "..." > "Promote to Production" sur un déploiement précédent.

---

## 📈 Optimisations Production

### Performance
- ✅ Images optimisées (AVIF, WebP)
- ✅ Code splitting activé
- ✅ Compression gzip activée
- ✅ Cache headers configurés

### Sécurité
- ✅ Headers de sécurité configurés
- ✅ CSP (Content Security Policy)
- ✅ HTTPS forcé
- ✅ Rate limiting (à implémenter)

### SEO
- ✅ Metadata configurés
- ✅ Sitemap (à générer)
- ✅ Robots.txt (à créer)

---

## 🎯 Prochaines Étapes Après Déploiement

1. **Configurer un domaine personnalisé**
   - Acheter un domaine (ex: bilancompetence-ai.fr)
   - Le lier dans Vercel Settings > Domains

2. **Activer le monitoring**
   - Sentry pour les erreurs
   - Vercel Analytics pour les performances
   - Google Analytics (optionnel)

3. **Configurer les sauvegardes**
   - Sauvegardes automatiques Supabase
   - Export régulier des données

4. **Mettre en place le CI/CD**
   - Tests automatiques sur PR
   - Déploiements preview automatiques
   - Protection de la branche main

5. **Documentation utilisateur**
   - Guide d'utilisation
   - FAQ
   - Support client

---

## 📞 Support

### Ressources
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Gemini API Docs: https://ai.google.dev/docs

### Contact
- Email support: support@bilancompetence-ai.fr
- GitHub Issues: https://github.com/conseil-maker/bilancompetence-ai-v2/issues

---

**Prêt pour le déploiement !** 🚀

La plateforme BilanCompetence.AI v2 avec Gemini est prête à être déployée en production.

