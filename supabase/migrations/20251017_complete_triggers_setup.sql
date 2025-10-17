-- Migration: 20251017_complete_triggers_setup.sql
-- Description: Configuration complète de tous les triggers et fonctions nécessaires
-- Date: 2025-10-17
-- =====================================================

-- =====================================================
-- 1. TRIGGER: Création automatique du profil utilisateur
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, first_name, last_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'beneficiaire'),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    role = COALESCE(EXCLUDED.role, profiles.role),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS 'Crée automatiquement un profil dans public.profiles quand un utilisateur s''inscrit';

-- =====================================================
-- 2. TRIGGER: Mise à jour automatique de last_login_at
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET last_login_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at)
  EXECUTE FUNCTION public.update_last_login();

COMMENT ON FUNCTION public.update_last_login() IS 'Met à jour last_login_at dans profiles quand l''utilisateur se connecte';

-- =====================================================
-- 3. TRIGGER: Validation des dates de bilan
-- =====================================================

CREATE OR REPLACE FUNCTION public.validate_bilan_dates()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier que date_fin_prevue >= date_debut
  IF NEW.date_fin_prevue IS NOT NULL AND NEW.date_debut IS NOT NULL THEN
    IF NEW.date_fin_prevue < NEW.date_debut THEN
      RAISE EXCEPTION 'La date de fin prévue ne peut pas être antérieure à la date de début';
    END IF;
  END IF;
  
  -- Vérifier que date_fin_reelle >= date_debut
  IF NEW.date_fin_reelle IS NOT NULL AND NEW.date_debut IS NOT NULL THEN
    IF NEW.date_fin_reelle < NEW.date_debut THEN
      RAISE EXCEPTION 'La date de fin réelle ne peut pas être antérieure à la date de début';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_bilan_dates_trigger ON bilans;
CREATE TRIGGER validate_bilan_dates_trigger
  BEFORE INSERT OR UPDATE ON bilans
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_bilan_dates();

-- =====================================================
-- 4. TRIGGER: Notification automatique pour les RDV
-- =====================================================

CREATE OR REPLACE FUNCTION public.auto_notify_rdv()
RETURNS TRIGGER AS $$
BEGIN
  -- Créer une notification pour le bénéficiaire
  INSERT INTO notifications (
    user_id,
    type,
    titre,
    message,
    lien,
    metadata
  )
  SELECT
    b.beneficiaire_id,
    'rdv_cree',
    'Nouveau rendez-vous planifié',
    'Un rendez-vous a été planifié pour le ' || TO_CHAR(NEW.date_heure, 'DD/MM/YYYY à HH24:MI'),
    '/mes-rdv',
    jsonb_build_object('rdv_id', NEW.id, 'date', NEW.date_heure)
  FROM bilans b
  WHERE b.id = NEW.bilan_id;
  
  -- Créer une notification pour le consultant si assigné
  INSERT INTO notifications (
    user_id,
    type,
    titre,
    message,
    lien,
    metadata
  )
  SELECT
    b.consultant_id,
    'rdv_cree',
    'Nouveau rendez-vous planifié',
    'Un rendez-vous a été planifié pour le ' || TO_CHAR(NEW.date_heure, 'DD/MM/YYYY à HH24:MI'),
    '/mes-rdv',
    jsonb_build_object('rdv_id', NEW.id, 'date', NEW.date_heure)
  FROM bilans b
  WHERE b.id = NEW.bilan_id AND b.consultant_id IS NOT NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS auto_notify_rdv_trigger ON rendez_vous;
CREATE TRIGGER auto_notify_rdv_trigger
  AFTER INSERT ON rendez_vous
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_notify_rdv();

-- =====================================================
-- 5. TRIGGER: Archivage automatique des anciennes notifications
-- =====================================================

CREATE OR REPLACE FUNCTION public.archive_old_notifications()
RETURNS void AS $$
BEGIN
  UPDATE notifications
  SET est_archive = TRUE
  WHERE created_at < NOW() - INTERVAL '30 days'
    AND est_lu = TRUE
    AND est_archive = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.archive_old_notifications() IS 'Archive les notifications lues de plus de 30 jours';

-- =====================================================
-- 6. TRIGGER: Validation de l'email
-- =====================================================

CREATE OR REPLACE FUNCTION public.validate_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Format d''email invalide: %', NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_email_trigger ON profiles;
CREATE TRIGGER validate_email_trigger
  BEFORE INSERT OR UPDATE OF email ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_email();

-- =====================================================
-- 7. FONCTION: Statistiques en temps réel
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS TABLE (
  total_bilans BIGINT,
  bilans_en_cours BIGINT,
  bilans_termines BIGINT,
  total_rdv BIGINT,
  rdv_a_venir BIGINT,
  notifications_non_lues BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM bilans WHERE beneficiaire_id = user_uuid OR consultant_id = user_uuid),
    (SELECT COUNT(*) FROM bilans WHERE (beneficiaire_id = user_uuid OR consultant_id = user_uuid) AND status NOT IN ('termine', 'abandonne')),
    (SELECT COUNT(*) FROM bilans WHERE (beneficiaire_id = user_uuid OR consultant_id = user_uuid) AND status = 'termine'),
    (SELECT COUNT(*) FROM rendez_vous rv JOIN bilans b ON rv.bilan_id = b.id WHERE b.beneficiaire_id = user_uuid OR b.consultant_id = user_uuid),
    (SELECT COUNT(*) FROM rendez_vous rv JOIN bilans b ON rv.bilan_id = b.id WHERE (b.beneficiaire_id = user_uuid OR b.consultant_id = user_uuid) AND rv.date_heure > NOW() AND rv.statut != 'annule'),
    (SELECT COUNT(*) FROM notifications WHERE user_id = user_uuid AND est_lu = FALSE AND est_archive = FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_user_stats(UUID) IS 'Retourne les statistiques en temps réel pour un utilisateur';

-- =====================================================
-- 8. FONCTION: Nettoyage des données obsolètes
-- =====================================================

CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS void AS $$
BEGIN
  -- Archiver les anciennes notifications
  PERFORM archive_old_notifications();
  
  -- Supprimer les sessions expirées (plus de 90 jours)
  DELETE FROM auth.sessions
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Marquer les bilans abandonnés (pas de mise à jour depuis 6 mois)
  UPDATE bilans
  SET status = 'abandonne'
  WHERE status NOT IN ('termine', 'abandonne')
    AND updated_at < NOW() - INTERVAL '6 months';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.cleanup_old_data() IS 'Nettoie les données obsolètes (à exécuter périodiquement)';

-- =====================================================
-- 9. INDEX pour améliorer les performances
-- =====================================================

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, est_lu, est_archive) WHERE est_lu = FALSE AND est_archive = FALSE;
CREATE INDEX IF NOT EXISTS idx_rendez_vous_date ON rendez_vous(date_heure) WHERE statut != 'annule';
CREATE INDEX IF NOT EXISTS idx_bilans_active ON bilans(status) WHERE status NOT IN ('termine', 'abandonne');
CREATE INDEX IF NOT EXISTS idx_profiles_role_active ON profiles(role) WHERE role IS NOT NULL;

-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================

-- Afficher un résumé
DO $$
BEGIN
  RAISE NOTICE '✅ Migration terminée avec succès !';
  RAISE NOTICE '📊 Triggers créés: 6';
  RAISE NOTICE '⚙️ Fonctions créées: 8';
  RAISE NOTICE '🔍 Index créés: 4';
END $$;

