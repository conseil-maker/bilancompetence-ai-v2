# 🔑 Guide : Obtenir les Clés API

## 📋 Vue d'Ensemble

Ce document explique comment obtenir les clés API nécessaires pour BilanCompetence.AI v2 après l'incident de sécurité.

---

## 🚨 Incident de Sécurité Résolu

**Date** : 16 octobre 2025  
**Statut** : ✅ Résolu

Les identifiants France Travail ont été accidentellement exposés dans l'historique Git. France Travail les a **régénérés automatiquement** par mesure de sécurité.

**Actions effectuées** :
- ✅ Historique Git nettoyé
- ✅ Fichiers sensibles supprimés de l'historique
- ✅ `.gitignore` vérifié et renforcé
- ✅ Push forcé sur GitHub pour nettoyer le dépôt distant

---

## 🔐 Clés API Requises

### 1. Supabase (OBLIGATOIRE)

**Où les obtenir** : [https://supabase.com/dashboard](https://supabase.com/dashboard)

1. Créer un nouveau projet Supabase
2. Aller dans **Settings** → **API**
3. Copier les valeurs suivantes :

```env
NEXT_PUBLIC_SUPABASE_URL=https://[votre-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[votre-clé-publique]
SUPABASE_SERVICE_ROLE_KEY=[votre-clé-privée]
```

### 2. Google Gemini API (OBLIGATOIRE)

**Où l'obtenir** : [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

1. Se connecter avec un compte Google
2. Créer une nouvelle clé API
3. Copier la clé :

```env
GEMINI_API_KEY=[votre-clé-gemini]
```

### 3. France Travail API (OBLIGATOIRE)

**⚠️ Les anciennes clés ont été révoquées suite à l'incident de sécurité.**

**Comment obtenir de nouvelles clés** :

#### Option 1 : Via l'Email de Résolution

France Travail vous a envoyé un email avec le sujet **"L'incident INC2518075 a été résolu"**.

Dans cet email, vous devriez trouver :
- Les **nouveaux identifiants** régénérés
- Un lien pour valider la résolution

#### Option 2 : Contacter le Support

Si vous n'avez pas reçu les nouveaux identifiants :

1. **Email** : contact@netzinformatique.fr (votre contact principal)
2. **Plateforme** : [francetravail.io](https://francetravail.io)
3. **Référence** : Incident INC2518075

**Informations à fournir** :
- Nom du projet : BilanCompetence.AI v2
- Ancien Client ID : `PAR_bilancompetenceaiv2_...` (révoqué)
- Raison : Régénération suite à exposition accidentelle

#### Option 3 : Créer une Nouvelle Application

Si nécessaire, vous pouvez créer une nouvelle application :

1. Se connecter sur [https://francetravail.io](https://francetravail.io)
2. Aller dans **Mes Applications**
3. Créer une nouvelle application
4. Demander l'accès aux APIs :
   - **API Offres d'emploi v2**
   - **Scope** : `api_offresdemploiv2 o2dsoffre`

### 4. Autres APIs (OPTIONNELLES)

Ces APIs sont optionnelles mais recommandées pour les fonctionnalités avancées :

#### Google Calendar API
- **Utilité** : Gestion des rendez-vous
- **Où l'obtenir** : [Google Cloud Console](https://console.cloud.google.com/)

#### Stripe API
- **Utilité** : Paiements en ligne
- **Où l'obtenir** : [Stripe Dashboard](https://dashboard.stripe.com/)

#### SendGrid API
- **Utilité** : Envoi d'emails
- **Où l'obtenir** : [SendGrid Dashboard](https://app.sendgrid.com/)

---

## 📝 Configuration des Variables d'Environnement

### Pour le Développement Local

Créer un fichier `.env.local` à la racine du projet :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[votre-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[votre-clé-publique]
SUPABASE_SERVICE_ROLE_KEY=[votre-clé-privée]

# Google Gemini AI
GEMINI_API_KEY=[votre-clé-gemini]

# France Travail (NOUVEAUX IDENTIFIANTS)
FRANCE_TRAVAIL_CLIENT_ID=[nouveau-client-id]
FRANCE_TRAVAIL_CLIENT_SECRET=[nouveau-client-secret]
FRANCE_TRAVAIL_API_URL=https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Pour la Production (Vercel)

Configurer les variables dans Vercel Dashboard :

```bash
# Via Vercel CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GEMINI_API_KEY
vercel env add FRANCE_TRAVAIL_CLIENT_ID
vercel env add FRANCE_TRAVAIL_CLIENT_SECRET
```

---

## ✅ Vérification

Une fois les clés configurées, tester la connexion :

```bash
# Lancer le serveur de développement
pnpm dev

# Tester l'API France Travail
curl http://localhost:3000/api/health
```

---

## 🔒 Bonnes Pratiques de Sécurité

Pour éviter de futurs incidents :

1. **Ne jamais commiter** de fichiers `.env*` (sauf `.env.example`)
2. **Vérifier `.gitignore`** avant chaque commit
3. **Utiliser des secrets managers** en production (Vercel Env, AWS Secrets Manager)
4. **Régénérer les clés** immédiatement en cas d'exposition
5. **Monitorer les accès** via les dashboards des services

---

## 📞 Support

En cas de problème :

1. **France Travail** : contact@netzinformatique.fr
2. **Supabase** : [Support Supabase](https://supabase.com/support)
3. **Google Gemini** : [Google AI Support](https://ai.google.dev/support)

---

**Document créé le** : 17 octobre 2025  
**Dernière mise à jour** : 17 octobre 2025

