# Guide de Déploiement Manuel sur Vercel

## ✅ État Actuel du Projet

Le projet **BilanCompetence.AI v2** est prêt pour le déploiement :

- ✅ Code source complet et fonctionnel
- ✅ Build réussi localement
- ✅ Repository GitHub à jour : `conseil-maker/bilancompetence-ai-v2`
- ✅ Projet Vercel créé : `bilancompetence-ai-v2`
- ✅ Base de données Supabase configurée
- ✅ Toutes les dépendances installées

## 🚀 Étapes de Déploiement (5-10 minutes)

### Étape 1 : Connexion à Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Login"** (en haut à droite)
3. Choisissez **"Continue with GitHub"**
4. Autorisez l'accès si demandé

### Étape 2 : Accéder au Projet

1. Une fois connecté, allez sur : https://vercel.com/netz-informatiques-projects/bilancompetence-ai-v2
2. Ou cliquez sur le projet **"bilancompetence-ai-v2"** dans votre dashboard

### Étape 3 : Connecter le Repository GitHub

1. Dans les paramètres du projet, allez dans **"Git"**
2. Cliquez sur **"Connect Git Repository"**
3. Sélectionnez le repository : **`conseil-maker/bilancompetence-ai-v2`**
4. Branche à déployer : **`master`**
5. Cliquez sur **"Connect"**

### Étape 4 : Configurer les Variables d'Environnement

1. Allez dans **"Settings"** → **"Environment Variables"**
2. Ajoutez les 3 variables suivantes (une par une) :

#### Variable 1 : NEXT_PUBLIC_SUPABASE_URL
- **Key** : `NEXT_PUBLIC_SUPABASE_URL`
- **Value** : `https://rjklvexwqukhunireqna.supabase.co`
- **Environments** : Cochez **Production**, **Preview**, **Development**
- Cliquez sur **"Save"**

#### Variable 2 : NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key** : `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2x2ZXh3cXVraHVuaXJlcW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzI4ODksImV4cCI6MjA3NjAwODg4OX0.XUAsPZo7LfYuNJpP1YGdsggEfvO8xZOVUXCVZCUVTrw`
- **Environments** : Cochez **Production**, **Preview**, **Development**
- Cliquez sur **"Save"**

#### Variable 3 : SUPABASE_SERVICE_ROLE_KEY
- **Key** : `SUPABASE_SERVICE_ROLE_KEY`
- **Value** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2x2ZXh3cXVraHVuaXJlcW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQzMjg4OSwiZXhwIjoyMDc2MDA4ODg5fQ.v12zFjQGC3v_dTq4iNxTGNg8BbXX3JYo5sc_Z4hn3sM`
- **Environments** : Cochez **Production**, **Preview**, **Development**
- **Type** : Cochez **"Sensitive"** (cette clé est secrète)
- Cliquez sur **"Save"**

### Étape 5 : Lancer le Déploiement

1. Retournez à l'onglet **"Deployments"**
2. Cliquez sur **"Deploy"** ou **"Redeploy"**
3. Ou simplement : faites un push sur GitHub, Vercel déploiera automatiquement

Le déploiement prendra environ 2-3 minutes.

### Étape 6 : Vérifier le Déploiement

Une fois le déploiement terminé :

1. Vercel vous donnera une URL de type : `https://bilancompetence-ai-v2.vercel.app`
2. Cliquez sur **"Visit"** pour ouvrir l'application
3. Vérifiez que la page d'accueil se charge correctement

## 🧪 Tests Post-Déploiement

### Test 1 : Page d'Accueil
- Allez sur l'URL de déploiement
- La page d'accueil doit s'afficher avec le titre "BilanCompetence.AI"

### Test 2 : Authentification
- Cliquez sur **"Connexion"** dans le menu
- La page de connexion doit s'afficher
- Essayez de créer un compte (page **"Inscription"**)

### Test 3 : Connexion Supabase
- Si vous pouvez créer un compte, cela signifie que Supabase est bien connecté ✅

## 📋 Variables Optionnelles (À Configurer Plus Tard)

Ces variables ne sont pas nécessaires pour le déploiement initial, mais seront requises pour activer certaines fonctionnalités :

### Pour les Paiements Stripe
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Pour l'IA (OpenAI)
```
OPENAI_API_KEY=sk-...
```

### Pour Google Calendar
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=...@....iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

## 🔧 Résolution de Problèmes

### Erreur de Build
Si le build échoue :
1. Vérifiez les logs dans l'onglet **"Deployments"**
2. Cliquez sur le déploiement échoué
3. Consultez les **"Build Logs"**

### Erreur de Connexion Supabase
Si l'authentification ne fonctionne pas :
1. Vérifiez que les 3 variables d'environnement sont bien configurées
2. Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs
3. Redéployez le projet

### Page Blanche
Si la page ne s'affiche pas :
1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs JavaScript
3. Consultez les logs Vercel

## 📞 Support

- Documentation Vercel : https://vercel.com/docs
- Documentation Next.js : https://nextjs.org/docs
- Documentation Supabase : https://supabase.com/docs

## 🎯 Prochaines Étapes Après le Déploiement

1. ✅ Tester toutes les pages de l'application
2. ✅ Créer un compte administrateur
3. ✅ Configurer les clés API Stripe (paiements)
4. ✅ Configurer OpenAI API (fonctionnalités IA)
5. ✅ Configurer Google Calendar (rendez-vous)
6. ✅ Configurer un domaine personnalisé
7. ✅ Activer les certificats SSL (automatique avec Vercel)
8. ✅ Configurer les sauvegardes Supabase

## 📊 Informations du Projet

- **Repository GitHub** : https://github.com/conseil-maker/bilancompetence-ai-v2
- **Projet Vercel** : https://vercel.com/netz-informatiques-projects/bilancompetence-ai-v2
- **Team Vercel** : NETZ INFORMATIQUE's projects
- **Framework** : Next.js 15.5.5
- **Node Version** : 22.x
- **Base de données** : Supabase (PostgreSQL)

---

**Note** : Toutes les corrections nécessaires ont été appliquées au code :
- ✅ Conflits de routes résolus (dashboards renommés)
- ✅ Configuration ESLint ajustée
- ✅ Services tiers (Stripe, Google Calendar) avec vérifications
- ✅ Build réussi localement
- ✅ Code poussé sur GitHub

Le projet est **100% prêt** pour le déploiement ! 🚀

