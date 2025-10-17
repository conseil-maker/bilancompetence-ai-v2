# 🔑 Identifiants de Test - BilanCompetence.AI v2

**Application** : https://bilancompetence-ai-v2.vercel.app

---

## 👥 Comptes de Test

### 🔴 Administrateur

- **Email** : `admin@bilancompetence.ai`
- **Mot de passe** : `Admin123!@#`
- **Dashboard** : `/admin/dashboard`
- **Accès** :
  - Gestion complète de la plateforme
  - Gestion des utilisateurs
  - Statistiques globales
  - Audit Qualiopi
  - Configuration système

---

### 🟡 Consultant

- **Email** : `consultant@bilancompetence.ai`
- **Mot de passe** : `Consultant123!@#`
- **Dashboard** : `/consultant/dashboard`
- **Accès** :
  - Gestion des bilans
  - Gestion des bénéficiaires
  - Calendrier des rendez-vous
  - Messagerie
  - Documents (attestations, certificats)

---

### 🟢 Bénéficiaire

- **Email** : `beneficiaire@bilancompetence.ai`
- **Mot de passe** : `Beneficiaire123!@#`
- **Dashboard** : `/beneficiaire/dashboard`
- **Accès** :
  - Mon parcours de bilan
  - Mes expériences
  - Mes compétences
  - Pistes métiers
  - Tests psychométriques
  - Messagerie avec consultant
  - Documents personnels

---

## 📝 Instructions pour Créer les Comptes

### Option 1 : Inscription Manuelle (Recommandée)

1. Allez sur : https://bilancompetence-ai-v2.vercel.app/register
2. Créez un compte avec l'email et le mot de passe ci-dessus
3. Une fois inscrit, **mettez à jour le rôle** dans Supabase :

```sql
-- Aller sur : https://supabase.com/dashboard/project/rjklvexwqukhuniregna
-- Cliquer sur "SQL Editor"
-- Exécuter cette requête :

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@bilancompetence.ai';

UPDATE public.profiles
SET role = 'consultant'
WHERE email = 'consultant@bilancompetence.ai';

-- Le bénéficiaire a déjà le rôle par défaut
```

### Option 2 : Création via SQL (Avancée)

Utilisez le script `scripts/create-test-users.sql` fourni dans le projet.

---

## 🧪 Tests à Effectuer

### Test Admin

1. Connectez-vous avec le compte admin
2. Vérifiez l'accès au dashboard admin
3. Testez la gestion des utilisateurs
4. Consultez les statistiques

### Test Consultant

1. Connectez-vous avec le compte consultant
2. Créez un nouveau bilan
3. Ajoutez un bénéficiaire
4. Planifiez un rendez-vous
5. Envoyez un message

### Test Bénéficiaire

1. Connectez-vous avec le compte bénéficiaire
2. Complétez le parcours préliminaire
3. Ajoutez des expériences
4. Consultez les pistes métiers
5. Passez un test psychométrique

---

## ⚠️ Sécurité

**IMPORTANT** : Ces identifiants sont pour les tests uniquement. 

En production :
- Changez tous les mots de passe
- Utilisez des emails réels
- Activez l'authentification à deux facteurs
- Configurez les politiques de sécurité Supabase

---

## 🔄 Réinitialisation

Pour réinitialiser les comptes de test :

```sql
-- Supprimer tous les utilisateurs de test
DELETE FROM auth.users
WHERE email IN (
  'admin@bilancompetence.ai',
  'consultant@bilancompetence.ai',
  'beneficiaire@bilancompetence.ai'
);
```

Puis recréez-les en suivant les instructions ci-dessus.

---

**Document créé par** : Manus AI  
**Date** : 17 octobre 2025  
**Version** : 1.0

