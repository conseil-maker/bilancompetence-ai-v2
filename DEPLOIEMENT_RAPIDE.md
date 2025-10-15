# 🚀 Guide de Déploiement Rapide - BilanCompetence.AI v2

## ✅ Le Projet est Prêt !

Tout est configuré et prêt pour le déploiement. Voici la méthode la plus simple et rapide.

---

## 📋 Méthode Recommandée : Interface Web Vercel (5 minutes)

### Étape 1: Accéder à Vercel
1. Allez sur https://vercel.com/new
2. Connectez-vous avec votre compte GitHub `conseil-maker`

### Étape 2: Importer le Projet
1. Sélectionnez le repository : `conseil-maker/bilancompetence-ai-v2`
2. Cliquez sur **"Import"**

### Étape 3: Configuration (Automatique)
Vercel détectera automatiquement :
- ✅ Framework: Next.js
- ✅ Build Command: `pnpm build`
- ✅ Output Directory: `.next`
- ✅ Install Command: `pnpm install`

**Ne changez rien**, c'est déjà optimal !

### Étape 4: Variables d'Environnement
Les variables sont déjà configurées, mais vérifiez qu'elles sont présentes :

```
NEXT_PUBLIC_SUPABASE_URL=https://rjklvexwqukhunireqna.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Étape 5: Déployer
1. Cliquez sur **"Deploy"**
2. Attendez 3-5 minutes ⏱️
3. C'est fait ! 🎉

---

## 🌐 Après le Déploiement

### URL de Production
Vercel vous donnera une URL comme :
```
https://bilancompetence-ai-v2.vercel.app
```

### Configurer un Domaine Personnalisé
1. Dans Vercel Dashboard > Settings > Domains
2. Ajoutez votre domaine : `bilancompetence.ai`
3. Suivez les instructions DNS

---

## ✅ Vérifications Post-Déploiement

### 1. Tester l'Application
- [ ] Page d'accueil charge
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Dashboard accessible

### 2. Vérifier les Logs
Dans Vercel Dashboard > Deployments > Logs

### 3. Activer le Monitoring
- Sentry sera automatiquement activé (si DSN configuré)
- Analytics Vercel est actif par défaut

---

## 🔄 Déploiements Futurs

### Automatique via GitHub
Chaque push sur `master` déclenchera automatiquement un déploiement !

```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin master
```

### Preview Deployments
Chaque Pull Request créera un déploiement de preview automatique.

---

## 🆘 En Cas de Problème

### Build Échoue
1. Vérifiez les logs dans Vercel
2. Testez localement : `pnpm build`
3. Vérifiez les variables d'environnement

### Application ne Charge Pas
1. Vérifiez que Supabase est accessible
2. Vérifiez les variables d'environnement
3. Consultez les logs Vercel

### Erreur 500
1. Vérifiez Sentry pour les erreurs
2. Vérifiez les logs Vercel
3. Vérifiez la connexion à Supabase

---

## 📊 Monitoring

### Vercel Analytics
Automatiquement actif, consultez dans Dashboard > Analytics

### Sentry (Erreurs)
Si configuré, consultez https://sentry.io

### Supabase (Base de Données)
Consultez https://app.supabase.com

---

## 🎯 Checklist Complète

- [ ] Projet importé dans Vercel
- [ ] Variables d'environnement configurées
- [ ] Premier déploiement réussi
- [ ] Application accessible via URL
- [ ] Tests manuels passés
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Monitoring actif

---

## 💡 Astuces

### Rollback Rapide
Si un déploiement pose problème :
1. Allez dans Deployments
2. Trouvez le dernier déploiement stable
3. Cliquez sur "..." > "Promote to Production"

### Logs en Temps Réel
```bash
vercel logs --follow
```

### Redéployer
```bash
vercel --prod
```

---

## 📞 Support

**Documentation complète** : Voir `DEPLOYMENT_FINAL_GUIDE.md`

**En cas de blocage** :
1. Vérifiez les logs Vercel
2. Consultez la documentation Vercel
3. Vérifiez le statut de Supabase

---

**C'est tout ! Le déploiement devrait prendre moins de 5 minutes.** 🚀

**Version** : 2.0.0  
**Date** : 15 octobre 2025  
**Statut** : ✅ Prêt à déployer

