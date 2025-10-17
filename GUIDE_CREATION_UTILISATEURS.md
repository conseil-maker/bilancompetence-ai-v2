# 👥 Guide de Création des Utilisateurs de Test

Ce guide vous explique comment créer les comptes de test pour BilanCompetence.AI v2.

---

## 🎯 Objectif

Créer 3 utilisateurs de test avec des rôles différents :
- 🔴 **Admin** : Accès complet à la plateforme
- 🟡 **Consultant** : Gestion des bilans et bénéficiaires
- 🟢 **Bénéficiaire** : Accès au parcours de bilan

---

## 📋 Étape 1 : Préparer la Base de Données

### 1.1 Accéder à l'Éditeur SQL

1. Allez sur : https://supabase.com/dashboard/project/rjklvexwqukhuniregna
2. Cliquez sur **"SQL Editor"** dans le menu latéral gauche
3. Cliquez sur **"New query"**

### 1.2 Exécuter le Script de Préparation

Copiez et collez le contenu du fichier `scripts/create-test-users.sql` dans l'éditeur SQL, puis cliquez sur **"Run"**.

Ce script va :
- ✅ Créer la table `profiles` si elle n'existe pas
- ✅ Créer un trigger pour auto-créer les profils
- ✅ Configurer les politiques de sécurité (RLS)

---

## 👤 Étape 2 : Créer les Utilisateurs

### 2.1 Accéder à la Gestion des Utilisateurs

1. Cliquez sur **"Authentication"** dans le menu latéral
2. Cliquez sur **"Users"**
3. Cliquez sur **"Add user"** (bouton en haut à droite)

### 2.2 Créer l'Administrateur

**Informations à saisir :**
- **Email** : `admin@bilancompetence.ai`
- **Password** : `Admin123!@#`
- **Auto Confirm User** : ✅ Cocher cette case

**User Metadata (Important !)** :
Cliquez sur **"User Metadata"** et ajoutez :
```json
{
  "role": "admin"
}
```

Cliquez sur **"Create user"**.

### 2.3 Créer le Consultant

Répétez l'opération avec :
- **Email** : `consultant@bilancompetence.ai`
- **Password** : `Consultant123!@#`
- **Auto Confirm User** : ✅ Cocher
- **User Metadata** :
```json
{
  "role": "consultant"
}
```

### 2.4 Créer le Bénéficiaire

Répétez l'opération avec :
- **Email** : `beneficiaire@bilancompetence.ai`
- **Password** : `Beneficiaire123!@#`
- **Auto Confirm User** : ✅ Cocher
- **User Metadata** :
```json
{
  "role": "beneficiaire"
}
```

---

## ✅ Étape 3 : Vérifier les Profils

### 3.1 Vérifier dans la Table Profiles

1. Allez dans **"Table Editor"**
2. Sélectionnez la table **"profiles"**
3. Vérifiez que les 3 utilisateurs apparaissent avec leurs rôles corrects

### 3.2 Si les Rôles Sont Incorrects

Si les rôles ne sont pas corrects, exécutez ces requêtes SQL :

```sql
-- Mettre à jour le rôle admin
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@bilancompetence.ai';

-- Mettre à jour le rôle consultant
UPDATE public.profiles
SET role = 'consultant'
WHERE email = 'consultant@bilancompetence.ai';

-- Mettre à jour le rôle bénéficiaire
UPDATE public.profiles
SET role = 'beneficiaire'
WHERE email = 'beneficiaire@bilancompetence.ai';
```

---

## 🧪 Étape 4 : Tester la Connexion

### 4.1 Tester avec le Compte Admin

1. Allez sur : https://bilancompetence-ai-v2.vercel.app/login
2. Connectez-vous avec :
   - **Email** : `admin@bilancompetence.ai`
   - **Password** : `Admin123!@#`
3. Vous devriez être redirigé vers : `/admin/dashboard`

### 4.2 Tester avec le Compte Consultant

1. Déconnectez-vous
2. Connectez-vous avec :
   - **Email** : `consultant@bilancompetence.ai`
   - **Password** : `Consultant123!@#`
3. Vous devriez être redirigé vers : `/consultant/dashboard`

### 4.3 Tester avec le Compte Bénéficiaire

1. Déconnectez-vous
2. Connectez-vous avec :
   - **Email** : `beneficiaire@bilancompetence.ai`
   - **Password** : `Beneficiaire123!@#`
3. Vous devriez être redirigé vers : `/beneficiaire/dashboard`

---

## 🔧 Dépannage

### Problème : "Email not confirmed"

**Solution** : Retournez dans Supabase > Authentication > Users, trouvez l'utilisateur et cliquez sur "Confirm email".

### Problème : "Invalid login credentials"

**Solution** : Vérifiez que vous avez bien coché "Auto Confirm User" lors de la création.

### Problème : Redirigé vers la mauvaise page

**Solution** : Vérifiez le rôle dans la table `profiles`. Si incorrect, utilisez les requêtes SQL de mise à jour ci-dessus.

### Problème : "User already exists"

**Solution** : Si vous avez déjà créé un utilisateur avec cet email, supprimez-le d'abord ou utilisez un autre email.

---

## 📝 Récapitulatif des Identifiants

| Rôle | Email | Mot de passe | Dashboard |
|------|-------|--------------|-----------|
| 🔴 Admin | `admin@bilancompetence.ai` | `Admin123!@#` | `/admin/dashboard` |
| 🟡 Consultant | `consultant@bilancompetence.ai` | `Consultant123!@#` | `/consultant/dashboard` |
| 🟢 Bénéficiaire | `beneficiaire@bilancompetence.ai` | `Beneficiaire123!@#` | `/beneficiaire/dashboard` |

---

**⚠️ IMPORTANT** : Ces identifiants sont pour les tests uniquement. Ne les utilisez pas en production !

---

**Document créé par** : Manus AI  
**Date** : 17 octobre 2025

