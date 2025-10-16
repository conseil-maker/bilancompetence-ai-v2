-- =====================================================
-- Migration: Ajout des tables Compétences et Expériences
-- Date: 2025-10-17
-- Description: Tables pour le Profil de Talents Dynamique
-- =====================================================

-- =====================================================
-- TABLE: experiences
-- Timeline des expériences professionnelles et personnelles
-- =====================================================

CREATE TABLE experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bilan_id UUID REFERENCES bilans(id) ON DELETE CASCADE NOT NULL,
  
  -- Informations de l'expérience
  titre TEXT NOT NULL,
  entreprise TEXT,
  type TEXT NOT NULL, -- 'professionnelle', 'formation', 'benevolat', 'projet_personnel'
  description TEXT,
  realisations TEXT[], -- Liste des réalisations probantes
  
  -- Dates
  date_debut DATE NOT NULL,
  date_fin DATE, -- NULL si en cours
  duree_mois INTEGER, -- Calculé automatiquement
  
  -- Localisation
  lieu TEXT,
  secteur_activite TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT valid_dates CHECK (date_fin IS NULL OR date_fin >= date_debut)
);

-- Index
CREATE INDEX idx_experiences_bilan ON experiences(bilan_id);
CREATE INDEX idx_experiences_type ON experiences(type);
CREATE INDEX idx_experiences_dates ON experiences(date_debut, date_fin);

-- Trigger pour calculer la durée en mois
CREATE OR REPLACE FUNCTION calculate_duree_mois()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.date_fin IS NOT NULL THEN
    NEW.duree_mois := EXTRACT(YEAR FROM AGE(NEW.date_fin, NEW.date_debut)) * 12 + 
                      EXTRACT(MONTH FROM AGE(NEW.date_fin, NEW.date_debut));
  ELSE
    NEW.duree_mois := EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.date_debut)) * 12 + 
                      EXTRACT(MONTH FROM AGE(CURRENT_DATE, NEW.date_debut));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_duree_mois
  BEFORE INSERT OR UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION calculate_duree_mois();

-- =====================================================
-- TABLE: competences
-- Compétences extraites du CV et des expériences
-- =====================================================

CREATE TABLE competences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bilan_id UUID REFERENCES bilans(id) ON DELETE CASCADE NOT NULL,
  
  -- Informations de la compétence
  nom TEXT NOT NULL,
  categorie TEXT NOT NULL, -- 'technique', 'transversale', 'comportementale', 'linguistique'
  sous_categorie TEXT, -- Ex: 'programmation', 'gestion_projet', 'communication'
  
  -- Niveau de maîtrise
  niveau INTEGER CHECK (niveau >= 1 AND niveau <= 5), -- 1=débutant, 5=expert
  niveau_label TEXT, -- 'débutant', 'intermédiaire', 'confirmé', 'expert', 'maître'
  
  -- Source de la compétence
  source TEXT, -- 'cv', 'test', 'entretien', 'ia_extraction'
  validee_par_consultant BOOLEAN DEFAULT FALSE,
  
  -- Référentiels
  code_rome TEXT, -- Code ROME si applicable
  code_esco TEXT, -- Code ESCO si applicable
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_competences_bilan ON competences(bilan_id);
CREATE INDEX idx_competences_categorie ON competences(categorie);
CREATE INDEX idx_competences_niveau ON competences(niveau);
CREATE INDEX idx_competences_nom ON competences(nom);

-- =====================================================
-- TABLE: competences_experiences
-- Table de liaison entre compétences et expériences
-- =====================================================

CREATE TABLE competences_experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  competence_id UUID REFERENCES competences(id) ON DELETE CASCADE NOT NULL,
  experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE NOT NULL,
  
  -- Contexte d'utilisation
  contexte TEXT, -- Comment la compétence a été utilisée dans cette expérience
  niveau_utilisation INTEGER CHECK (niveau_utilisation >= 1 AND niveau_utilisation <= 5),
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte d'unicité
  UNIQUE(competence_id, experience_id)
);

-- Index
CREATE INDEX idx_comp_exp_competence ON competences_experiences(competence_id);
CREATE INDEX idx_comp_exp_experience ON competences_experiences(experience_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE competences ENABLE ROW LEVEL SECURITY;
ALTER TABLE competences_experiences ENABLE ROW LEVEL SECURITY;

-- Policies pour experiences
CREATE POLICY "Les bénéficiaires voient leurs propres expériences"
  ON experiences FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid()
    )
  );

CREATE POLICY "Les consultants voient les expériences de leurs bilans"
  ON experiences FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE consultant_id = auth.uid()
    )
  );

CREATE POLICY "Les admins voient toutes les expériences"
  ON experiences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les bénéficiaires peuvent créer leurs expériences"
  ON experiences FOR INSERT
  WITH CHECK (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid()
    )
  );

CREATE POLICY "Les bénéficiaires peuvent modifier leurs expériences"
  ON experiences FOR UPDATE
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid()
    )
  );

CREATE POLICY "Les consultants peuvent modifier les expériences de leurs bilans"
  ON experiences FOR UPDATE
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE consultant_id = auth.uid()
    )
  );

-- Policies pour competences (similaires à experiences)
CREATE POLICY "Les bénéficiaires voient leurs propres compétences"
  ON competences FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid()
    )
  );

CREATE POLICY "Les consultants voient les compétences de leurs bilans"
  ON competences FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE consultant_id = auth.uid()
    )
  );

CREATE POLICY "Les admins voient toutes les compétences"
  ON competences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les bénéficiaires peuvent créer leurs compétences"
  ON competences FOR INSERT
  WITH CHECK (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid()
    )
  );

CREATE POLICY "Les consultants peuvent créer des compétences"
  ON competences FOR INSERT
  WITH CHECK (
    bilan_id IN (
      SELECT id FROM bilans WHERE consultant_id = auth.uid()
    )
  );

CREATE POLICY "Les consultants peuvent modifier les compétences"
  ON competences FOR UPDATE
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE consultant_id = auth.uid()
    )
  );

-- Policies pour competences_experiences
CREATE POLICY "Les utilisateurs voient les liaisons de leurs bilans"
  ON competences_experiences FOR SELECT
  USING (
    competence_id IN (
      SELECT id FROM competences WHERE bilan_id IN (
        SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
      )
    )
  );

CREATE POLICY "Les admins voient toutes les liaisons"
  ON competences_experiences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les utilisateurs peuvent créer des liaisons"
  ON competences_experiences FOR INSERT
  WITH CHECK (
    competence_id IN (
      SELECT id FROM competences WHERE bilan_id IN (
        SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
      )
    )
  );

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON TABLE experiences IS 'Timeline des expériences professionnelles et personnelles du bénéficiaire';
COMMENT ON TABLE competences IS 'Compétences extraites du CV, des tests et des entretiens';
COMMENT ON TABLE competences_experiences IS 'Liaison entre compétences et expériences pour traçabilité';

COMMENT ON COLUMN competences.niveau IS '1=débutant, 2=intermédiaire, 3=confirmé, 4=expert, 5=maître';
COMMENT ON COLUMN competences.source IS 'Origine de la compétence: cv, test, entretien, ia_extraction';
COMMENT ON COLUMN competences.validee_par_consultant IS 'Indique si le consultant a validé cette compétence';

