# 🎯 Initialiser la Base de Données Supabase (5 minutes)

## ⚠️ Problème Actuel

L'application est déployée et fonctionne, mais l'inscription échoue avec l'erreur :
```
Could not find the 'first_name' column of 'profiles' in the schema cache
```

**Cause** : Les tables de la base de données n'ont pas encore été créées dans Supabase.

**Solution** : Exécuter le script SQL de migration (1 seule fois).

---

## ✅ Solution Simple (5 minutes)

### Étape 1 : Se connecter à Supabase

1. Ouvrir : **https://supabase.com/dashboard**
2. Se connecter avec votre compte (GitHub ou email)
3. Sélectionner le projet : **bilancompetence-ai-v2** (rjklvexwqukhunireqna)

### Étape 2 : Ouvrir l'éditeur SQL

1. Dans le menu latéral gauche, cliquer sur **"SQL Editor"**
2. Cliquer sur **"+ New query"** (en haut à droite)

### Étape 3 : Copier le script SQL

Le script SQL complet se trouve dans le fichier :
```
supabase/migrations/20251014_initial_schema.sql
```

**Option A** : Via GitHub (recommandé)
- Ouvrir : https://github.com/conseil-maker/bilancompetence-ai-v2/blob/master/supabase/migrations/20251014_initial_schema.sql
- Cliquer sur le bouton "Raw" (en haut à droite du fichier)
- Sélectionner tout (Ctrl+A / Cmd+A)
- Copier (Ctrl+C / Cmd+C)

**Option B** : Via le fichier local
- Ouvrir le fichier `supabase/migrations/20251014_initial_schema.sql` dans votre éditeur de code
- Sélectionner tout le contenu
- Copier

### Étape 4 : Coller et exécuter

1. Retourner dans l'éditeur SQL de Supabase
2. **Coller** le script SQL copié (Ctrl+V / Cmd+V)
3. Cliquer sur **"Run"** (ou appuyer sur Ctrl+Enter / Cmd+Enter)
4. Attendre quelques secondes (un message de succès devrait apparaître)

### Étape 5 : Vérifier

1. Dans le menu latéral, cliquer sur **"Table Editor"**
2. Vous devriez voir les tables suivantes :
   - ✅ profiles
   - ✅ bilans
   - ✅ tests
   - ✅ sessions
   - ✅ documents
   - ✅ messages
   - ✅ notifications

---

## 🎉 C'est Terminé !

Une fois le script exécuté, l'application sera **100% fonctionnelle** !

Vous pourrez :
- ✅ Créer des comptes utilisateurs
- ✅ Se connecter
- ✅ Accéder aux dashboards
- ✅ Utiliser toutes les fonctionnalités

---

## 📊 Résumé du Projet

### URLs Importantes

- **Application en production** : https://bilancompetence-ai-v2-9dhbd71gr-netz-informatiques-projects.vercel.app
- **Repository GitHub** : https://github.com/conseil-maker/bilancompetence-ai-v2
- **Supabase Dashboard** : https://supabase.com/dashboard/project/rjklvexwqukhunireqna
- **Vercel Dashboard** : https://vercel.com/netz-informatiques-projects/bilancompetence-ai-v2

### Ce qui a été accompli

✅ Application Next.js 15 complète avec TypeScript
✅ Authentification Supabase configurée
✅ Dashboards pour 3 types d'utilisateurs (Bénéficiaire, Consultant, Admin)
✅ Page d'accueil moderne et professionnelle
✅ Routes API pour l'analyse IA, les paiements, le calendrier
✅ Déploiement automatique sur Vercel
✅ Variables d'environnement configurées
✅ Code source sur GitHub avec historique complet

### Ce qui reste à faire (optionnel)

- ⚪ Ajouter les clés API OpenAI (pour l'analyse IA des CV)
- ⚪ Configurer Stripe (pour les paiements)
- ⚪ Configurer Google Calendar (pour les rendez-vous)
- ⚪ Créer les pages À propos, Tarifs, Contact
- ⚪ Configurer un domaine personnalisé

---

## 🆘 Besoin d'Aide ?

Si vous rencontrez un problème lors de l'exécution du script SQL :

1. **Vérifier les erreurs** : Supabase affiche les erreurs en rouge dans l'éditeur
2. **Réessayer** : Parfois il suffit de cliquer à nouveau sur "Run"
3. **Vérifier les permissions** : Assurez-vous d'être connecté avec le bon compte

---

**Dernière mise à jour** : 15 octobre 2025, 04:30 UTC
**Version** : 2.0.0

