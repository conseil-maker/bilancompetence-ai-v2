# Configuration Vercel - Guide Étape par Étape

## ✅ Code Poussé sur GitHub

Le code avec la migration Gemini a été poussé avec succès sur GitHub :
- Repository: `conseil-maker/bilancompetence-ai-v2`
- Branche: `master`
- Commit: Migration complète vers Google Gemini API

---

## 🚀 Étapes de Déploiement sur Vercel

### Étape 1: Accéder à Vercel

1. Aller sur https://vercel.com
2. Se connecter avec votre compte

### Étape 2: Importer le Projet

1. Cliquer sur **"Add New..."** puis **"Project"**
2. Sélectionner **"Import Git Repository"**
3. Chercher et sélectionner `conseil-maker/bilancompetence-ai-v2`
4. Cliquer sur **"Import"**

### Étape 3: Configurer le Projet

Vercel détectera automatiquement Next.js. Vérifier :

- **Framework Preset**: Next.js
- **Root Directory**: `./` (racine)
- **Build Command**: `pnpm run build` (détecté automatiquement)
- **Output Directory**: `.next` (détecté automatiquement)
- **Install Command**: `pnpm install` (détecté automatiquement)

### Étape 4: Configurer les Variables d'Environnement

**IMPORTANT**: Avant de déployer, ajouter ces variables d'environnement :

#### Variables OBLIGATOIRES

Cliquer sur **"Environment Variables"** et ajouter :

```
NEXT_PUBLIC_SUPABASE_URL
https://gvxpnfzjdqhqcgmvqoqv.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2eHBuZnpqZHFocWNnbXZxb3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5MDQ5NzEsImV4cCI6MjA0NDQ4MDk3MX0.bFyBvMBqRKlWGSUeVVPJFCDXyMHVHcGFPNwFPLPpZqk

SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2eHBuZnpqZHFocWNnbXZxb3F2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODkwNDk3MSwiZXhwIjoyMDQ0NDgwOTcxfQ.KxOvQWvBRqjZmVNVJbgOXdGkVxQBjQGPfCkNJqCFQCg

GEMINI_API_KEY
AIzaSyCanwPlXB0b78ay3jmOnq4XWRfTWAcNzEI

FRANCE_TRAVAIL_CLIENT_ID
PAR_bilancompetenceaiv2_18dcbf45de0cc17727f8521c50e8981379ec452cf6aa68aa9066a00d3d0acc97

FRANCE_TRAVAIL_CLIENT_SECRET
6c44a89177dc912b4faf7e799d025146d03a56b9533c3a7b39f659ecb9c60767

FRANCE_TRAVAIL_API_URL
https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire
```

**Pour chaque variable** :
- Coller le nom dans "Key"
- Coller la valeur dans "Value"
- Sélectionner les environnements : **Production**, **Preview**, **Development**
- Cliquer sur "Add"

### Étape 5: Déployer

1. Une fois toutes les variables ajoutées, cliquer sur **"Deploy"**
2. Vercel va :
   - Installer les dépendances (pnpm install)
   - Compiler le projet (pnpm run build)
   - Déployer sur le CDN global

**Durée estimée** : 3-5 minutes

### Étape 6: Vérifier le Déploiement

Une fois le déploiement terminé :

1. Cliquer sur **"Visit"** pour voir le site
2. L'URL sera du type : `https://bilancompetence-ai-v2-xxx.vercel.app`

---

## ✅ Checklist Post-Déploiement

### Tests à Effectuer

- [ ] Page d'accueil accessible
- [ ] Inscription/Connexion fonctionne
- [ ] Routes API répondent (tester `/api/health` si disponible)
- [ ] Fonctionnalités IA testées :
  - [ ] Génération de questions
  - [ ] Analyse de profil
  - [ ] Recommandations de métiers

### Configuration Optionnelle

#### Domaine Personnalisé

1. Aller dans **Settings** > **Domains**
2. Ajouter votre domaine (ex: `bilancompetence-ai.fr`)
3. Suivre les instructions DNS

#### Monitoring

1. Activer **Vercel Analytics** dans Settings
2. Configurer **Sentry** (optionnel) pour le monitoring d'erreurs

#### Déploiements Automatiques

✅ Déjà configuré ! Chaque push sur `master` déclenchera automatiquement un nouveau déploiement.

---

## 🐛 Dépannage

### Erreur de Build

Si le build échoue :

1. Aller dans **Deployments** > Cliquer sur le déploiement échoué
2. Consulter les logs dans **Build Logs**
3. Vérifier que toutes les variables d'environnement sont configurées

### Erreur 500 en Production

1. Aller dans **Functions** pour voir les logs d'erreur
2. Vérifier que `GEMINI_API_KEY` est bien configurée
3. Vérifier la connexion Supabase

### Variables d'Environnement Manquantes

1. Aller dans **Settings** > **Environment Variables**
2. Ajouter les variables manquantes
3. **Redéployer** : Deployments > ... > Redeploy

---

## 📊 Monitoring des Coûts

### Gemini API

- Dashboard : https://aistudio.google.com/app/apikey
- Surveiller l'usage quotidien
- Quota gratuit : 1500 requêtes/jour

### Vercel

- Dashboard : https://vercel.com/dashboard
- Surveiller la bande passante
- Plan gratuit : 100 GB/mois

### Supabase

- Dashboard : https://supabase.com/dashboard
- Surveiller les requêtes DB
- Plan gratuit : 500 MB

---

## 🎯 Prochaines Étapes

1. **Tester en production** toutes les fonctionnalités
2. **Configurer un domaine** personnalisé (optionnel)
3. **Activer le monitoring** (Analytics, Sentry)
4. **Former les utilisateurs** sur la nouvelle plateforme

---

## 📞 Support

- Vercel Support : https://vercel.com/support
- Documentation : https://vercel.com/docs
- GitHub Issues : https://github.com/conseil-maker/bilancompetence-ai-v2/issues

---

**Le code est prêt et poussé sur GitHub. Suivez ces étapes pour déployer sur Vercel !** 🚀

