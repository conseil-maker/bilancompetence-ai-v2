-- =====================================================
-- Migration: Ajout des tables RDV et Notifications
-- Date: 2025-10-17
-- Description: Gestion des rendez-vous et système de notifications
-- =====================================================

-- =====================================================
-- TABLE: rdv
-- Gestion des rendez-vous et entretiens
-- =====================================================

CREATE TABLE rdv (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bilan_id UUID REFERENCES bilans(id) ON DELETE CASCADE NOT NULL,
  beneficiaire_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  consultant_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Informations du RDV
  titre TEXT NOT NULL,
  type TEXT NOT NULL, -- 'information', 'preliminaire', 'investigation', 'conclusion', 'suivi', 'autre'
  phase TEXT, -- 'preliminaire', 'investigation', 'conclusion', 'post_bilan'
  description TEXT,
  objectifs TEXT[],
  
  -- Date et heure
  date_rdv TIMESTAMP WITH TIME ZONE NOT NULL,
  duree_minutes INTEGER DEFAULT 60 CHECK (duree_minutes > 0),
  date_fin TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (date_rdv + (duree_minutes || ' minutes')::INTERVAL) STORED,
  
  -- Modalités
  modalite TEXT NOT NULL, -- 'presentiel', 'visio', 'telephone'
  lieu TEXT, -- Adresse si présentiel
  lien_visio TEXT, -- Lien Google Meet, Zoom, etc.
  telephone TEXT, -- Numéro si téléphone
  
  -- Statut
  statut TEXT DEFAULT 'planifie', -- 'planifie', 'confirme', 'en_cours', 'termine', 'annule', 'reporte'
  confirme_beneficiaire BOOLEAN DEFAULT FALSE,
  confirme_consultant BOOLEAN DEFAULT FALSE,
  
  -- Rappels
  rappel_24h_envoye BOOLEAN DEFAULT FALSE,
  rappel_1h_envoye BOOLEAN DEFAULT FALSE,
  
  -- Compte-rendu
  notes_consultant TEXT,
  compte_rendu TEXT,
  documents_partages TEXT[], -- URLs des documents partagés
  actions_decidees JSONB, -- Actions décidées pendant le RDV
  
  -- Reprogrammation
  rdv_precedent_id UUID REFERENCES rdv(id) ON DELETE SET NULL, -- Si reporté
  raison_annulation TEXT,
  raison_report TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Index
CREATE INDEX idx_rdv_bilan ON rdv(bilan_id);
CREATE INDEX idx_rdv_beneficiaire ON rdv(beneficiaire_id);
CREATE INDEX idx_rdv_consultant ON rdv(consultant_id);
CREATE INDEX idx_rdv_date ON rdv(date_rdv);
CREATE INDEX idx_rdv_statut ON rdv(statut);
CREATE INDEX idx_rdv_type ON rdv(type);
CREATE INDEX idx_rdv_rappels ON rdv(date_rdv) WHERE statut IN ('planifie', 'confirme');

-- =====================================================
-- TABLE: notifications
-- Système de notifications
-- =====================================================

CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Contenu de la notification
  type TEXT NOT NULL, -- 'rdv', 'message', 'action_echeance', 'phase_complete', 'test_disponible', 'alerte', 'info'
  titre TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Lien d'action
  lien TEXT, -- URL vers la page concernée
  action_label TEXT, -- Texte du bouton d'action
  
  -- Priorité
  priorite TEXT DEFAULT 'normale', -- 'basse', 'normale', 'haute', 'urgente'
  
  -- Statut
  lue BOOLEAN DEFAULT FALSE,
  lue_at TIMESTAMP WITH TIME ZONE,
  archivee BOOLEAN DEFAULT FALSE,
  
  -- Références
  bilan_id UUID REFERENCES bilans(id) ON DELETE CASCADE,
  rdv_id UUID REFERENCES rdv(id) ON DELETE CASCADE,
  action_id UUID REFERENCES plan_action(id) ON DELETE CASCADE,
  
  -- Canaux d'envoi
  envoye_email BOOLEAN DEFAULT FALSE,
  envoye_sms BOOLEAN DEFAULT FALSE,
  envoye_push BOOLEAN DEFAULT FALSE,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE -- Date d'expiration de la notification
);

-- Index
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_lue ON notifications(lue) WHERE lue = FALSE;
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_priorite ON notifications(priorite);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_bilan ON notifications(bilan_id) WHERE bilan_id IS NOT NULL;

-- =====================================================
-- TABLE: notes_entretien
-- Notes prises pendant les entretiens
-- =====================================================

CREATE TABLE notes_entretien (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  rdv_id UUID REFERENCES rdv(id) ON DELETE CASCADE NOT NULL,
  bilan_id UUID REFERENCES bilans(id) ON DELETE CASCADE NOT NULL,
  consultant_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  
  -- Contenu des notes
  notes TEXT NOT NULL,
  observations TEXT,
  points_cles TEXT[],
  citations TEXT[], -- Citations importantes du bénéficiaire
  
  -- Analyse
  themes_abordes TEXT[],
  competences_identifiees TEXT[],
  freins_identifies TEXT[],
  motivations_identifiees TEXT[],
  
  -- Actions à suivre
  actions_a_suivre JSONB,
  
  -- Confidentialité
  confidentiel BOOLEAN DEFAULT TRUE, -- Si TRUE, seul le consultant peut voir
  partage_avec_beneficiaire BOOLEAN DEFAULT FALSE,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_notes_rdv ON notes_entretien(rdv_id);
CREATE INDEX idx_notes_bilan ON notes_entretien(bilan_id);
CREATE INDEX idx_notes_consultant ON notes_entretien(consultant_id);

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour créer une notification
CREATE OR REPLACE FUNCTION creer_notification(
  p_user_id UUID,
  p_type TEXT,
  p_titre TEXT,
  p_message TEXT,
  p_lien TEXT DEFAULT NULL,
  p_priorite TEXT DEFAULT 'normale',
  p_bilan_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, titre, message, lien, priorite, bilan_id)
  VALUES (p_user_id, p_type, p_titre, p_message, p_lien, p_priorite, p_bilan_id)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour récupérer les RDV nécessitant un rappel
CREATE OR REPLACE FUNCTION rdv_a_rappeler()
RETURNS TABLE(
  rdv_id UUID,
  beneficiaire_id UUID,
  consultant_id UUID,
  titre TEXT,
  date_rdv TIMESTAMP WITH TIME ZONE,
  type_rappel TEXT
) AS $$
BEGIN
  -- Rappels 24h avant
  RETURN QUERY
  SELECT 
    r.id,
    r.beneficiaire_id,
    r.consultant_id,
    r.titre,
    r.date_rdv,
    '24h'::TEXT as type_rappel
  FROM rdv r
  WHERE r.statut IN ('planifie', 'confirme')
    AND r.rappel_24h_envoye = FALSE
    AND r.date_rdv <= NOW() + INTERVAL '24 hours'
    AND r.date_rdv > NOW() + INTERVAL '23 hours';
  
  -- Rappels 1h avant
  RETURN QUERY
  SELECT 
    r.id,
    r.beneficiaire_id,
    r.consultant_id,
    r.titre,
    r.date_rdv,
    '1h'::TEXT as type_rappel
  FROM rdv r
  WHERE r.statut IN ('planifie', 'confirme')
    AND r.rappel_1h_envoye = FALSE
    AND r.date_rdv <= NOW() + INTERVAL '1 hour'
    AND r.date_rdv > NOW() + INTERVAL '59 minutes';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger pour créer une notification lors de la création d'un RDV
CREATE OR REPLACE FUNCTION notify_rdv_created()
RETURNS TRIGGER AS $$
BEGIN
  -- Notification pour le bénéficiaire
  PERFORM creer_notification(
    NEW.beneficiaire_id,
    'rdv',
    'Nouveau rendez-vous planifié',
    'Un rendez-vous "' || NEW.titre || '" a été planifié le ' || TO_CHAR(NEW.date_rdv, 'DD/MM/YYYY à HH24:MI'),
    '/beneficiaire-dashboard/rdv/' || NEW.id,
    'normale',
    NEW.bilan_id
  );
  
  -- Notification pour le consultant si assigné
  IF NEW.consultant_id IS NOT NULL THEN
    PERFORM creer_notification(
      NEW.consultant_id,
      'rdv',
      'Nouveau rendez-vous planifié',
      'Un rendez-vous "' || NEW.titre || '" a été planifié le ' || TO_CHAR(NEW.date_rdv, 'DD/MM/YYYY à HH24:MI'),
      '/consultant-dashboard/rdv/' || NEW.id,
      'normale',
      NEW.bilan_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_rdv_created
  AFTER INSERT ON rdv
  FOR EACH ROW
  EXECUTE FUNCTION notify_rdv_created();

-- Trigger pour marquer une notification comme lue
CREATE OR REPLACE FUNCTION mark_notification_read()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lue = TRUE AND OLD.lue = FALSE THEN
    NEW.lue_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_mark_notification_read
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  WHEN (NEW.lue IS DISTINCT FROM OLD.lue)
  EXECUTE FUNCTION mark_notification_read();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE rdv ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes_entretien ENABLE ROW LEVEL SECURITY;

-- Policies pour rdv
CREATE POLICY "Les bénéficiaires voient leurs RDV"
  ON rdv FOR SELECT
  USING (beneficiaire_id = auth.uid());

CREATE POLICY "Les consultants voient leurs RDV"
  ON rdv FOR SELECT
  USING (consultant_id = auth.uid());

CREATE POLICY "Les admins voient tous les RDV"
  ON rdv FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les consultants peuvent créer des RDV"
  ON rdv FOR INSERT
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Les consultants peuvent modifier leurs RDV"
  ON rdv FOR UPDATE
  USING (consultant_id = auth.uid());

CREATE POLICY "Les bénéficiaires peuvent confirmer leurs RDV"
  ON rdv FOR UPDATE
  USING (beneficiaire_id = auth.uid());

-- Policies pour notifications
CREATE POLICY "Les utilisateurs voient leurs notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Les utilisateurs peuvent modifier leurs notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Les utilisateurs peuvent supprimer leurs notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());

-- Policies pour notes_entretien
CREATE POLICY "Les consultants voient leurs notes"
  ON notes_entretien FOR SELECT
  USING (consultant_id = auth.uid());

CREATE POLICY "Les bénéficiaires voient les notes partagées"
  ON notes_entretien FOR SELECT
  USING (
    partage_avec_beneficiaire = TRUE
    AND bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid()
    )
  );

CREATE POLICY "Les admins voient toutes les notes"
  ON notes_entretien FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les consultants peuvent créer des notes"
  ON notes_entretien FOR INSERT
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Les consultants peuvent modifier leurs notes"
  ON notes_entretien FOR UPDATE
  USING (consultant_id = auth.uid());

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON TABLE rdv IS 'Gestion des rendez-vous et entretiens entre bénéficiaires et consultants';
COMMENT ON TABLE notifications IS 'Système de notifications multi-canaux (email, SMS, push)';
COMMENT ON TABLE notes_entretien IS 'Notes confidentielles prises par les consultants pendant les entretiens';

COMMENT ON COLUMN rdv.modalite IS 'presentiel, visio, telephone';
COMMENT ON COLUMN rdv.statut IS 'planifie, confirme, en_cours, termine, annule, reporte';
COMMENT ON COLUMN notifications.priorite IS 'basse, normale, haute, urgente';
COMMENT ON COLUMN notes_entretien.confidentiel IS 'Si TRUE, seul le consultant peut voir les notes';

