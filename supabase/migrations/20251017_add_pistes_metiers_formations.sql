-- =====================================================
-- Migration: Ajout des tables Pistes Métiers et Formations
-- Date: 2025-10-17
-- Description: Tables pour le Simulateur de Carrière
-- =====================================================

-- =====================================================
-- TABLE: pistes_metiers
-- Pistes de métiers suggérées par l'IA et explorées
-- =====================================================

CREATE TABLE pistes_metiers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bilan_id UUID REFERENCES bilans(id) ON DELETE CASCADE NOT NULL,
  
  -- Informations du métier
  titre TEXT NOT NULL,
  code_rome TEXT, -- Code ROME officiel
  code_esco TEXT, -- Code ESCO européen
  famille_metier TEXT,
  secteur_activite TEXT,
  
  -- Description
  description TEXT,
  missions_principales TEXT[],
  environnement_travail TEXT,
  
  -- Matching avec le profil
  score_adequation INTEGER CHECK (score_adequation >= 0 AND score_adequation <= 100), -- Score de matching IA
  source TEXT, -- 'ia_suggestion', 'consultant_suggestion', 'beneficiaire_recherche'
  
  -- Statut d'exploration
  statut TEXT DEFAULT 'a_explorer', -- 'a_explorer', 'en_exploration', 'interesse', 'non_interesse', 'retenu'
  priorite INTEGER CHECK (priorite >= 1 AND priorite <= 5), -- 1=haute, 5=basse
  
  -- Données marché (mises à jour via API)
  salaire_min INTEGER,
  salaire_max INTEGER,
  nombre_offres INTEGER, -- Nombre d'offres d'emploi actuelles
  tendance_recrutement TEXT, -- 'forte_demande', 'demande_moderee', 'faible_demande'
  regions_recrutement TEXT[], -- Régions où le métier recrute
  
  -- Enquête métier
  enquete_realisee BOOLEAN DEFAULT FALSE,
  enquete_notes TEXT,
  contacts_professionnels TEXT[], -- Liste des professionnels contactés
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  favoris BOOLEAN DEFAULT FALSE
);

-- Index
CREATE INDEX idx_pistes_bilan ON pistes_metiers(bilan_id);
CREATE INDEX idx_pistes_statut ON pistes_metiers(statut);
CREATE INDEX idx_pistes_score ON pistes_metiers(score_adequation DESC);
CREATE INDEX idx_pistes_code_rome ON pistes_metiers(code_rome);
CREATE INDEX idx_pistes_favoris ON pistes_metiers(favoris) WHERE favoris = TRUE;

-- =====================================================
-- TABLE: ecarts_competences
-- Analyse d'écart (Gap Analysis) pour chaque piste
-- =====================================================

CREATE TABLE ecarts_competences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  piste_metier_id UUID REFERENCES pistes_metiers(id) ON DELETE CASCADE NOT NULL,
  
  -- Compétence requise pour le métier
  competence_requise TEXT NOT NULL,
  niveau_requis INTEGER CHECK (niveau_requis >= 1 AND niveau_requis <= 5),
  importance TEXT, -- 'essentielle', 'importante', 'souhaitable'
  
  -- Compétence actuelle du bénéficiaire
  competence_actuelle_id UUID REFERENCES competences(id) ON DELETE SET NULL,
  niveau_actuel INTEGER CHECK (niveau_actuel >= 0 AND niveau_actuel <= 5), -- 0 si pas acquise
  
  -- Écart
  ecart INTEGER, -- Calculé: niveau_requis - niveau_actuel
  statut_ecart TEXT, -- 'acquise', 'a_developper', 'a_acquerir'
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_ecarts_piste ON ecarts_competences(piste_metier_id);
CREATE INDEX idx_ecarts_statut ON ecarts_competences(statut_ecart);

-- Trigger pour calculer l'écart automatiquement
CREATE OR REPLACE FUNCTION calculate_ecart_competence()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ecart := NEW.niveau_requis - COALESCE(NEW.niveau_actuel, 0);
  
  IF NEW.niveau_actuel >= NEW.niveau_requis THEN
    NEW.statut_ecart := 'acquise';
  ELSIF NEW.niveau_actuel > 0 THEN
    NEW.statut_ecart := 'a_developper';
  ELSE
    NEW.statut_ecart := 'a_acquerir';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_ecart
  BEFORE INSERT OR UPDATE ON ecarts_competences
  FOR EACH ROW
  EXECUTE FUNCTION calculate_ecart_competence();

-- =====================================================
-- TABLE: formations
-- Formations recommandées pour combler les écarts
-- =====================================================

CREATE TABLE formations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bilan_id UUID REFERENCES bilans(id) ON DELETE CASCADE NOT NULL,
  piste_metier_id UUID REFERENCES pistes_metiers(id) ON DELETE SET NULL, -- Peut être NULL si formation générale
  
  -- Informations de la formation
  titre TEXT NOT NULL,
  organisme TEXT,
  type TEXT, -- 'diplome', 'certification', 'formation_courte', 'mooc', 'vae'
  niveau TEXT, -- 'bac', 'bac+2', 'bac+3', 'bac+5', etc.
  
  -- Description
  description TEXT,
  objectifs TEXT[],
  competences_visees TEXT[],
  
  -- Modalités
  duree_heures INTEGER,
  duree_mois INTEGER,
  modalite TEXT, -- 'presentiel', 'distanciel', 'hybride'
  cout_euros INTEGER,
  eligible_cpf BOOLEAN DEFAULT FALSE,
  
  -- Liens
  url_formation TEXT,
  url_organisme TEXT,
  
  -- Statut
  statut TEXT DEFAULT 'suggeree', -- 'suggeree', 'interesse', 'inscrit', 'en_cours', 'terminee', 'abandonnee'
  date_debut_prevue DATE,
  date_fin_prevue DATE,
  
  -- Source
  source TEXT, -- 'ia_suggestion', 'consultant_suggestion', 'beneficiaire_recherche'
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  favoris BOOLEAN DEFAULT FALSE
);

-- Index
CREATE INDEX idx_formations_bilan ON formations(bilan_id);
CREATE INDEX idx_formations_piste ON formations(piste_metier_id);
CREATE INDEX idx_formations_statut ON formations(statut);
CREATE INDEX idx_formations_type ON formations(type);
CREATE INDEX idx_formations_cpf ON formations(eligible_cpf) WHERE eligible_cpf = TRUE;

-- =====================================================
-- TABLE: formations_ecarts
-- Liaison entre formations et écarts de compétences
-- =====================================================

CREATE TABLE formations_ecarts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  formation_id UUID REFERENCES formations(id) ON DELETE CASCADE NOT NULL,
  ecart_competence_id UUID REFERENCES ecarts_competences(id) ON DELETE CASCADE NOT NULL,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte d'unicité
  UNIQUE(formation_id, ecart_competence_id)
);

-- Index
CREATE INDEX idx_form_ecarts_formation ON formations_ecarts(formation_id);
CREATE INDEX idx_form_ecarts_ecart ON formations_ecarts(ecart_competence_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS
ALTER TABLE pistes_metiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecarts_competences ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations_ecarts ENABLE ROW LEVEL SECURITY;

-- Policies pour pistes_metiers
CREATE POLICY "Les bénéficiaires voient leurs propres pistes"
  ON pistes_metiers FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid()
    )
  );

CREATE POLICY "Les consultants voient les pistes de leurs bilans"
  ON pistes_metiers FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE consultant_id = auth.uid()
    )
  );

CREATE POLICY "Les admins voient toutes les pistes"
  ON pistes_metiers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les utilisateurs peuvent créer des pistes"
  ON pistes_metiers FOR INSERT
  WITH CHECK (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
    )
  );

CREATE POLICY "Les utilisateurs peuvent modifier leurs pistes"
  ON pistes_metiers FOR UPDATE
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
    )
  );

-- Policies pour ecarts_competences
CREATE POLICY "Les utilisateurs voient les écarts de leurs pistes"
  ON ecarts_competences FOR SELECT
  USING (
    piste_metier_id IN (
      SELECT id FROM pistes_metiers WHERE bilan_id IN (
        SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
      )
    )
  );

CREATE POLICY "Les admins voient tous les écarts"
  ON ecarts_competences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les utilisateurs peuvent créer des écarts"
  ON ecarts_competences FOR INSERT
  WITH CHECK (
    piste_metier_id IN (
      SELECT id FROM pistes_metiers WHERE bilan_id IN (
        SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
      )
    )
  );

-- Policies pour formations (similaires)
CREATE POLICY "Les bénéficiaires voient leurs formations"
  ON formations FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid()
    )
  );

CREATE POLICY "Les consultants voient les formations de leurs bilans"
  ON formations FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE consultant_id = auth.uid()
    )
  );

CREATE POLICY "Les admins voient toutes les formations"
  ON formations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les utilisateurs peuvent créer des formations"
  ON formations FOR INSERT
  WITH CHECK (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
    )
  );

CREATE POLICY "Les utilisateurs peuvent modifier leurs formations"
  ON formations FOR UPDATE
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
    )
  );

-- Policies pour formations_ecarts
CREATE POLICY "Les utilisateurs voient les liaisons formations-écarts"
  ON formations_ecarts FOR SELECT
  USING (
    formation_id IN (
      SELECT id FROM formations WHERE bilan_id IN (
        SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
      )
    )
  );

CREATE POLICY "Les admins voient toutes les liaisons"
  ON formations_ecarts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON TABLE pistes_metiers IS 'Pistes de métiers suggérées et explorées dans le simulateur de carrière';
COMMENT ON TABLE ecarts_competences IS 'Analyse d''écart entre compétences actuelles et requises pour chaque piste';
COMMENT ON TABLE formations IS 'Formations recommandées pour combler les écarts de compétences';
COMMENT ON TABLE formations_ecarts IS 'Liaison entre formations et écarts de compétences qu''elles permettent de combler';

COMMENT ON COLUMN pistes_metiers.score_adequation IS 'Score de matching IA entre 0 et 100';
COMMENT ON COLUMN ecarts_competences.ecart IS 'Différence entre niveau requis et niveau actuel';
COMMENT ON COLUMN formations.eligible_cpf IS 'Formation éligible au Compte Personnel de Formation';

