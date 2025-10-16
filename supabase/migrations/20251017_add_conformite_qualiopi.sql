-- =====================================================
-- Migration: Ajout des tables de Conformité Qualiopi
-- Date: 2025-10-17
-- Description: Tables pour la conformité Qualiopi et EDOF
-- =====================================================

-- =====================================================
-- TABLE: enquetes_satisfaction
-- Enquêtes de satisfaction (Qualiopi Critère 30-31)
-- =====================================================

CREATE TABLE enquetes_satisfaction (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bilan_id UUID REFERENCES bilans(id) ON DELETE CASCADE NOT NULL,
  beneficiaire_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Type d'enquête
  type TEXT NOT NULL, -- 'a_chaud', 'a_froid_6mois', 'a_froid_12mois'
  date_envoi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_reponse TIMESTAMP WITH TIME ZONE,
  
  -- Statut
  statut TEXT DEFAULT 'envoyee', -- 'envoyee', 'completee', 'expiree'
  
  -- Réponses (structure JSON flexible)
  reponses JSONB,
  
  -- Scores globaux
  satisfaction_globale INTEGER CHECK (satisfaction_globale >= 1 AND satisfaction_globale <= 5),
  recommanderait BOOLEAN,
  
  -- Commentaires
  points_forts TEXT,
  points_amelioration TEXT,
  commentaire_libre TEXT,
  
  -- Résultats du bilan
  projet_realise BOOLEAN, -- Le projet professionnel a-t-il été réalisé ?
  situation_actuelle TEXT, -- 'emploi', 'formation', 'creation_entreprise', 'recherche', 'autre'
  details_situation TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_enquetes_bilan ON enquetes_satisfaction(bilan_id);
CREATE INDEX idx_enquetes_beneficiaire ON enquetes_satisfaction(beneficiaire_id);
CREATE INDEX idx_enquetes_type ON enquetes_satisfaction(type);
CREATE INDEX idx_enquetes_statut ON enquetes_satisfaction(statut);
CREATE INDEX idx_enquetes_date_envoi ON enquetes_satisfaction(date_envoi);

-- =====================================================
-- TABLE: reclamations
-- Gestion des réclamations (Qualiopi Critère 29)
-- =====================================================

CREATE TABLE reclamations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bilan_id UUID REFERENCES bilans(id) ON DELETE SET NULL,
  beneficiaire_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Informations de la réclamation
  objet TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT, -- 'qualite_prestation', 'delai', 'communication', 'administratif', 'autre'
  gravite TEXT DEFAULT 'moyenne', -- 'faible', 'moyenne', 'haute', 'critique'
  
  -- Dates
  date_reclamation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_accuse_reception TIMESTAMP WITH TIME ZONE,
  date_traitement TIMESTAMP WITH TIME ZONE,
  date_cloture TIMESTAMP WITH TIME ZONE,
  
  -- Statut
  statut TEXT DEFAULT 'nouvelle', -- 'nouvelle', 'en_cours', 'traitee', 'close', 'escaladee'
  
  -- Traitement
  responsable_traitement_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  analyse TEXT,
  actions_correctives TEXT,
  actions_preventives TEXT,
  
  -- Réponse
  reponse TEXT,
  satisfait BOOLEAN, -- Le bénéficiaire est-il satisfait de la réponse ?
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_reclamations_bilan ON reclamations(bilan_id);
CREATE INDEX idx_reclamations_beneficiaire ON reclamations(beneficiaire_id);
CREATE INDEX idx_reclamations_statut ON reclamations(statut);
CREATE INDEX idx_reclamations_gravite ON reclamations(gravite);
CREATE INDEX idx_reclamations_date ON reclamations(date_reclamation DESC);

-- =====================================================
-- TABLE: veille
-- Veille réglementaire et sectorielle (Qualiopi Critère 6)
-- =====================================================

CREATE TABLE veille (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Informations de la veille
  titre TEXT NOT NULL,
  type TEXT NOT NULL, -- 'reglementaire', 'sectorielle', 'methodologique', 'technologique'
  source TEXT NOT NULL, -- URL ou nom de la source
  
  -- Contenu
  resume TEXT NOT NULL,
  contenu TEXT,
  url TEXT,
  
  -- Catégorisation
  themes TEXT[], -- Ex: ['cpf', 'qualiopi', 'ia', 'tests_psychometriques']
  impact TEXT, -- 'faible', 'moyen', 'fort'
  
  -- Actions
  actions_necessaires TEXT,
  responsable_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  date_action_prevue DATE,
  action_realisee BOOLEAN DEFAULT FALSE,
  
  -- Diffusion
  diffusee_equipe BOOLEAN DEFAULT FALSE,
  date_diffusion TIMESTAMP WITH TIME ZONE,
  
  -- Métadonnées
  date_publication DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Index
CREATE INDEX idx_veille_type ON veille(type);
CREATE INDEX idx_veille_date_publication ON veille(date_publication DESC);
CREATE INDEX idx_veille_themes ON veille USING GIN(themes);
CREATE INDEX idx_veille_actions ON veille(action_realisee) WHERE action_realisee = FALSE;

-- =====================================================
-- TABLE: formations_consultants
-- Formations des consultants (Qualiopi Critère 5)
-- =====================================================

CREATE TABLE formations_consultants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  consultant_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Informations de la formation
  titre TEXT NOT NULL,
  organisme TEXT,
  type TEXT, -- 'initiale', 'continue', 'certification', 'conference', 'autoformation'
  domaine TEXT, -- 'bilan_competences', 'psychometrie', 'ia', 'coaching', 'juridique', 'autre'
  
  -- Description
  description TEXT,
  objectifs TEXT[],
  competences_acquises TEXT[],
  
  -- Modalités
  duree_heures INTEGER,
  modalite TEXT, -- 'presentiel', 'distanciel', 'hybride'
  
  -- Dates
  date_debut DATE,
  date_fin DATE,
  
  -- Validation
  diplome_obtenu BOOLEAN DEFAULT FALSE,
  certification_obtenue BOOLEAN DEFAULT FALSE,
  nom_diplome TEXT,
  
  -- Documents
  attestation_url TEXT,
  certificat_url TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_formations_cons_consultant ON formations_consultants(consultant_id);
CREATE INDEX idx_formations_cons_type ON formations_consultants(type);
CREATE INDEX idx_formations_cons_domaine ON formations_consultants(domaine);
CREATE INDEX idx_formations_cons_dates ON formations_consultants(date_debut, date_fin);

-- =====================================================
-- AJOUT DE COLONNES DANS LA TABLE BILANS
-- Pour la conformité CPF/EDOF
-- =====================================================

ALTER TABLE bilans ADD COLUMN IF NOT EXISTS numero_cpf TEXT;
ALTER TABLE bilans ADD COLUMN IF NOT EXISTS edof_status TEXT DEFAULT 'non_declare'; -- 'non_declare', 'en_cours', 'valide', 'refuse'
ALTER TABLE bilans ADD COLUMN IF NOT EXISTS edof_declared_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE bilans ADD COLUMN IF NOT EXISTS edof_reference TEXT; -- Référence du dossier EDOF
ALTER TABLE bilans ADD COLUMN IF NOT EXISTS financeur TEXT; -- 'cpf', 'opco', 'pole_emploi', 'employeur', 'autofinancement'
ALTER TABLE bilans ADD COLUMN IF NOT EXISTS montant_finance NUMERIC(10, 2);

-- Colonnes pour le suivi adaptatif
ALTER TABLE bilans ADD COLUMN IF NOT EXISTS engagement_score INTEGER CHECK (engagement_score >= 0 AND engagement_score <= 100);
ALTER TABLE bilans ADD COLUMN IF NOT EXISTS sante_bilan TEXT; -- 'vert', 'orange', 'rouge'
ALTER TABLE bilans ADD COLUMN IF NOT EXISTS alerte_decrochage BOOLEAN DEFAULT FALSE;
ALTER TABLE bilans ADD COLUMN IF NOT EXISTS derniere_activite TIMESTAMP WITH TIME ZONE;

-- Commentaires de validation des phases
ALTER TABLE bilans ADD COLUMN IF NOT EXISTS preliminaire_commentaire TEXT;
ALTER TABLE bilans ADD COLUMN IF NOT EXISTS investigation_commentaire TEXT;
ALTER TABLE bilans ADD COLUMN IF NOT EXISTS conclusion_commentaire TEXT;

-- Index
CREATE INDEX IF NOT EXISTS idx_bilans_cpf ON bilans(numero_cpf) WHERE numero_cpf IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bilans_edof_status ON bilans(edof_status);
CREATE INDEX IF NOT EXISTS idx_bilans_sante ON bilans(sante_bilan);
CREATE INDEX IF NOT EXISTS idx_bilans_alerte ON bilans(alerte_decrochage) WHERE alerte_decrochage = TRUE;
CREATE INDEX IF NOT EXISTS idx_bilans_engagement ON bilans(engagement_score);

-- =====================================================
-- AJOUT DE COLONNES DANS LA TABLE DOCUMENTS
-- Pour les signatures électroniques
-- =====================================================

ALTER TABLE documents ADD COLUMN IF NOT EXISTS signed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS signature_url TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS signature_beneficiaire TEXT; -- Hash de la signature
ALTER TABLE documents ADD COLUMN IF NOT EXISTS signature_consultant TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS signature_employeur TEXT; -- Pour convention tripartite

-- Index
CREATE INDEX IF NOT EXISTS idx_documents_signed ON documents(signed_at) WHERE signed_at IS NOT NULL;

-- =====================================================
-- AJOUT DE COLONNES DANS LA TABLE PROFILES
-- Pour la gestion des utilisateurs
-- =====================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
-- Note: last_login_at existe déjà dans la migration initiale

-- Index
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(is_active) WHERE is_active = TRUE;

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour calculer le score d'engagement
CREATE OR REPLACE FUNCTION calculer_engagement_score(p_bilan_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER := 0;
  v_nb_activites INTEGER;
  v_nb_tests_completes INTEGER;
  v_nb_messages INTEGER;
  v_jours_depuis_debut INTEGER;
  v_jours_inactivite INTEGER;
BEGIN
  -- Récupérer les métriques
  SELECT 
    COUNT(*) INTO v_nb_activites
  FROM activites 
  WHERE bilan_id = p_bilan_id;
  
  SELECT 
    COUNT(*) INTO v_nb_tests_completes
  FROM tests 
  WHERE bilan_id = p_bilan_id AND completed_at IS NOT NULL;
  
  SELECT 
    COUNT(*) INTO v_nb_messages
  FROM messages 
  WHERE bilan_id = p_bilan_id;
  
  SELECT 
    EXTRACT(DAY FROM NOW() - date_debut) INTO v_jours_depuis_debut
  FROM bilans 
  WHERE id = p_bilan_id;
  
  SELECT 
    EXTRACT(DAY FROM NOW() - derniere_activite) INTO v_jours_inactivite
  FROM bilans 
  WHERE id = p_bilan_id;
  
  -- Calculer le score (sur 100)
  v_score := LEAST(100, 
    (v_nb_activites * 2) + 
    (v_nb_tests_completes * 10) + 
    (v_nb_messages * 5) - 
    (COALESCE(v_jours_inactivite, 0) * 2)
  );
  
  -- Assurer que le score est entre 0 et 100
  v_score := GREATEST(0, v_score);
  
  RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour la santé du bilan
CREATE OR REPLACE FUNCTION update_sante_bilan()
RETURNS TRIGGER AS $$
DECLARE
  v_engagement INTEGER;
  v_jours_inactivite INTEGER;
BEGIN
  -- Calculer l'engagement
  v_engagement := calculer_engagement_score(NEW.id);
  NEW.engagement_score := v_engagement;
  
  -- Calculer les jours d'inactivité
  SELECT EXTRACT(DAY FROM NOW() - derniere_activite) 
  INTO v_jours_inactivite
  FROM bilans 
  WHERE id = NEW.id;
  
  -- Déterminer la santé du bilan
  IF v_engagement >= 70 AND COALESCE(v_jours_inactivite, 0) < 7 THEN
    NEW.sante_bilan := 'vert';
    NEW.alerte_decrochage := FALSE;
  ELSIF v_engagement >= 40 AND COALESCE(v_jours_inactivite, 0) < 14 THEN
    NEW.sante_bilan := 'orange';
    NEW.alerte_decrochage := FALSE;
  ELSE
    NEW.sante_bilan := 'rouge';
    NEW.alerte_decrochage := TRUE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_sante_bilan
  BEFORE UPDATE ON bilans
  FOR EACH ROW
  WHEN (OLD.derniere_activite IS DISTINCT FROM NEW.derniere_activite)
  EXECUTE FUNCTION update_sante_bilan();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE enquetes_satisfaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE reclamations ENABLE ROW LEVEL SECURITY;
ALTER TABLE veille ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations_consultants ENABLE ROW LEVEL SECURITY;

-- Policies pour enquetes_satisfaction
CREATE POLICY "Les bénéficiaires voient leurs enquêtes"
  ON enquetes_satisfaction FOR SELECT
  USING (beneficiaire_id = auth.uid());

CREATE POLICY "Les consultants voient les enquêtes de leurs bilans"
  ON enquetes_satisfaction FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE consultant_id = auth.uid()
    )
  );

CREATE POLICY "Les admins voient toutes les enquêtes"
  ON enquetes_satisfaction FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les bénéficiaires peuvent répondre à leurs enquêtes"
  ON enquetes_satisfaction FOR UPDATE
  USING (beneficiaire_id = auth.uid());

-- Policies pour reclamations
CREATE POLICY "Les bénéficiaires voient leurs réclamations"
  ON reclamations FOR SELECT
  USING (beneficiaire_id = auth.uid());

CREATE POLICY "Les consultants voient les réclamations de leurs bilans"
  ON reclamations FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE consultant_id = auth.uid()
    )
  );

CREATE POLICY "Les admins voient toutes les réclamations"
  ON reclamations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les bénéficiaires peuvent créer des réclamations"
  ON reclamations FOR INSERT
  WITH CHECK (beneficiaire_id = auth.uid());

-- Policies pour veille
CREATE POLICY "Tous les utilisateurs voient la veille"
  ON veille FOR SELECT
  USING (TRUE);

CREATE POLICY "Les admins et consultants peuvent créer de la veille"
  ON veille FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'consultant')
    )
  );

-- Policies pour formations_consultants
CREATE POLICY "Les consultants voient leurs formations"
  ON formations_consultants FOR SELECT
  USING (consultant_id = auth.uid());

CREATE POLICY "Les admins voient toutes les formations"
  ON formations_consultants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les consultants peuvent créer leurs formations"
  ON formations_consultants FOR INSERT
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Les consultants peuvent modifier leurs formations"
  ON formations_consultants FOR UPDATE
  USING (consultant_id = auth.uid());

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON TABLE enquetes_satisfaction IS 'Enquêtes de satisfaction à chaud et à froid (Qualiopi Critère 30-31)';
COMMENT ON TABLE reclamations IS 'Gestion des réclamations clients (Qualiopi Critère 29)';
COMMENT ON TABLE veille IS 'Veille réglementaire et sectorielle (Qualiopi Critère 6)';
COMMENT ON TABLE formations_consultants IS 'Formations continues des consultants (Qualiopi Critère 5)';

COMMENT ON COLUMN bilans.engagement_score IS 'Score d''engagement du bénéficiaire (0-100)';
COMMENT ON COLUMN bilans.sante_bilan IS 'Indicateur visuel: vert (bon), orange (attention), rouge (alerte)';
COMMENT ON COLUMN bilans.edof_status IS 'Statut du dossier EDOF pour le CPF';

