# Guide d'application des migrations Supabase

## 📋 Migrations à appliquer

### 1. Migration complète des triggers (PRIORITAIRE)

**Fichier** : `supabase/migrations/20251017_complete_triggers_setup.sql`

**Ce qu'elle fait** :
- ✅ Crée automatiquement les profils utilisateurs
- ✅ Met à jour last_login_at à chaque connexion
- ✅ Valide les dates des bilans
- ✅ Envoie des notifications automatiques pour les RDV
- ✅ Archive les anciennes notifications
- ✅ Valide le format des emails
- ✅ Ajoute des fonctions de statistiques
- ✅ Optimise les performances avec des index

**Comment l'appliquer** :

1. Allez sur : https://supabase.com/dashboard/project/rjklvexwqukhuniregna/sql/new
2. Copiez tout le contenu du fichier `20251017_complete_triggers_setup.sql`
3. Collez dans l'éditeur SQL
4. Cliquez sur **"Run"**
5. Vérifiez que vous voyez : `✅ Migration terminée avec succès !`

---

## 🧪 Vérification après migration

### Vérifier que les triggers sont créés

```sql
SELECT 
  trigger_name, 
  event_object_table, 
  action_timing, 
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

### Vérifier que les fonctions sont créées

```sql
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'handle_new_user',
    'update_last_login',
    'validate_bilan_dates',
    'auto_notify_rdv',
    'archive_old_notifications',
    'validate_email',
    'get_user_stats',
    'cleanup_old_data'
  )
ORDER BY routine_name;
```

### Tester la création automatique de profil

```sql
-- Cette requête devrait retourner TRUE si le trigger existe
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.triggers 
  WHERE trigger_name = 'on_auth_user_created'
);
```

---

## 🔧 En cas de problème

### Si une fonction existe déjà

Les fonctions utilisent `CREATE OR REPLACE`, donc elles seront mises à jour automatiquement.

### Si un trigger existe déjà

Les triggers sont supprimés avec `DROP TRIGGER IF EXISTS` avant d'être recréés.

### Si vous voyez des erreurs

1. Vérifiez que toutes les tables existent
2. Vérifiez que les types ENUM sont définis (`user_role`, `bilan_status`, etc.)
3. Contactez-moi avec l'erreur exacte

---

## 📊 Ordre d'application des migrations

Si vous partez de zéro, appliquez les migrations dans cet ordre :

1. `20251014_initial_schema.sql` - Schéma de base
2. `20251015_add_missing_tables.sql` - Tables manquantes
3. `20251015_rls_security_enhancement.sql` - Sécurité RLS
4. `20251015_split_full_name.sql` - Séparation nom/prénom
5. `20251016_add_bilan_id_to_documents.sql` - Lien documents
6. `20251016_database_optimization_v2.sql` - Optimisations
7. `20251017_add_competences_experiences.sql` - Compétences
8. `20251017_add_conformite_qualiopi.sql` - Qualiopi
9. `20251017_add_pistes_metiers_formations.sql` - Métiers
10. `20251017_add_plan_action.sql` - Plan d'action
11. `20251017_add_rdv_notifications.sql` - RDV et notifications
12. `20251017_fix_optimization.sql` - Corrections
13. **`20251017_complete_triggers_setup.sql`** - Triggers complets ⭐

---

## ✅ Après l'application

Une fois la migration appliquée, vous pourrez :

1. ✅ Créer des comptes utilisateurs sans erreur
2. ✅ Recevoir des notifications automatiques
3. ✅ Voir les statistiques en temps réel
4. ✅ Profiter d'une base de données optimisée

---

## 🚀 Prochaines étapes

Après avoir appliqué la migration :

1. Testez l'inscription d'un utilisateur
2. Vérifiez que le profil est créé automatiquement
3. Testez la connexion
4. Vérifiez que `last_login_at` est mis à jour

**Dites-moi quand c'est fait pour que je teste l'application !**

