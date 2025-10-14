# Guide de Déploiement sur Vercel

## Étape 1 : Connexion à Vercel

Le projet est prêt à être déployé sur Vercel. Voici les étapes à suivre :

### Option A : Déploiement via l'interface web Vercel (Recommandé)

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur "Add New Project"
4. Importez le repository : `conseil-maker/bilancompetence-ai-v2`
5. Configurez les variables d'environnement (voir section ci-dessous)
6. Cliquez sur "Deploy"

### Option B : Déploiement via CLI

```bash
cd /home/ubuntu/bilancompetence-ai-v2
vercel login
vercel --prod
```

## Étape 2 : Configuration des Variables d'Environnement

Dans les paramètres du projet Vercel, ajoutez les variables suivantes :

### Variables Supabase (OBLIGATOIRES)

```
NEXT_PUBLIC_SUPABASE_URL=https://rjklvexwqukhunireqna.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2x2ZXh3cXVraHVuaXJlcW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzI4ODksImV4cCI6MjA3NjAwODg4OX0.XUAsPZo7LfYuNJpP1YGdsggEfvO8xZOVUXCVZCUVTrw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2x2ZXh3cXVraHVuaXJlcW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQzMjg4OSwiZXhwIjoyMDc2MDA4ODg5fQ.v12zFjQGC3v_dTq4iNxTGNg8BbXX3JYo5sc_Z4hn3sM
```

### Variables Optionnelles (à configurer plus tard)

Ces variables peuvent être laissées vides pour le moment. Les fonctionnalités correspondantes seront désactivées jusqu'à leur configuration :

```
# Stripe (Paiements)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# OpenAI (IA)
OPENAI_API_KEY=

# Google Calendar (Rendez-vous)
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
```

## Étape 3 : Configuration du Domaine

Une fois le déploiement réussi, Vercel vous fournira une URL de type :
- `https://bilancompetence-ai-v2.vercel.app`

Vous pourrez ensuite configurer un domaine personnalisé dans les paramètres du projet.

## Étape 4 : Vérification Post-Déploiement

Après le déploiement, vérifiez que :

1. ✅ La page d'accueil se charge correctement
2. ✅ Le système d'authentification fonctionne
3. ✅ La connexion à Supabase est établie
4. ✅ Les routes protégées redirigent vers la page de connexion

## Corrections Appliquées

Les problèmes suivants ont été résolus pour permettre le déploiement :

1. **Conflits de routes** : Les dashboards ont été renommés
   - `/dashboard` → `/admin-dashboard` (Admin)
   - `/dashboard` → `/consultant-dashboard` (Consultant)
   - `/dashboard` → `/beneficiaire-dashboard` (Bénéficiaire)

2. **Configuration ESLint** : Règles strictes désactivées temporairement

3. **Services tiers** : Ajout de vérifications pour Stripe et Google Calendar
   - Les services ne s'initialisent que si les clés API sont présentes
   - Évite les erreurs de build quand les clés ne sont pas configurées

4. **Version API Stripe** : Mise à jour vers `2025-09-30.clover`

## Prochaines Étapes

Après le déploiement initial :

1. Configurer les clés API Stripe pour activer les paiements
2. Configurer OpenAI API pour activer les fonctionnalités IA
3. Configurer Google Calendar pour la gestion des rendez-vous
4. Tester toutes les fonctionnalités
5. Configurer un domaine personnalisé
6. Activer les certificats SSL (automatique avec Vercel)

## Support

Pour toute question sur le déploiement :
- Documentation Vercel : https://vercel.com/docs
- Documentation Next.js : https://nextjs.org/docs
- Documentation Supabase : https://supabase.com/docs

