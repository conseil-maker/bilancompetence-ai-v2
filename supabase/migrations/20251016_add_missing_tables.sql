-- Migration : Ajout des tables manquantes
-- Date : 16 octobre 2025
-- Auteur : Manus

-- ============================================================================
-- Table : analyses
-- Description : Stocke les analyses complètes de profil générées par l'IA
-- ============================================================================

CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bilan_id UUID NOT NULL REFERENCES bilans(id) ON DELETE CASCADE,
  analyse_complete JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analyses_bilan_id ON analyses(bilan_id);

-- ============================================================================
-- Table : test_results
-- Description : Stocke les résultats des tests psychométriques
-- ============================================================================

CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bilan_id UUID NOT NULL REFERENCES bilans(id) ON DELETE CASCADE,
  test_type VARCHAR(50) NOT NULL,
  resultat JSONB NOT NULL,
  score DECIMAL(5,2),
  interpretation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_test_results_bilan_id ON test_results(bilan_id);
CREATE INDEX idx_test_results_test_type ON test_results(test_type);

-- ============================================================================
-- Table : questions_generees
-- Description : Stocke les questions générées par l'IA
-- ============================================================================

CREATE TABLE IF NOT EXISTS questions_generees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bilan_id UUID NOT NULL REFERENCES bilans(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  contexte JSONB,
  reponse TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_generees_bilan_id ON questions_generees(bilan_id);

-- ============================================================================
-- Table : questions_suivi
-- Description : Stocke les questions de suivi générées par l'IA
-- ============================================================================

CREATE TABLE IF NOT EXISTS questions_suivi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_originale_id UUID REFERENCES questions_generees(id) ON DELETE CASCADE,
  bilan_id UUID NOT NULL REFERENCES bilans(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  contexte JSONB,
  reponse TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_suivi_bilan_id ON questions_suivi(bilan_id);
CREATE INDEX idx_questions_suivi_question_originale_id ON questions_suivi(question_originale_id);

-- ============================================================================
-- Table : matching_results
-- Description : Stocke les résultats de matching emplois/formations
-- ============================================================================

CREATE TABLE IF NOT EXISTS matching_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bilan_id UUID NOT NULL REFERENCES bilans(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('emplois', 'formations')),
  resultats JSONB NOT NULL,
  params JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_matching_results_bilan_id ON matching_results(bilan_id);
CREATE INDEX idx_matching_results_type ON matching_results(type);

-- ============================================================================
-- Table : entretiens_preliminaires
-- Description : Stocke les données des entretiens préliminaires
-- ============================================================================

CREATE TABLE IF NOT EXISTS entretiens_preliminaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bilan_id UUID NOT NULL REFERENCES bilans(id) ON DELETE CASCADE,
  date_entretien DATE NOT NULL,
  duree_minutes INTEGER,
  notes TEXT,
  objectifs JSONB,
  attentes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_entretiens_preliminaires_bilan_id ON entretiens_preliminaires(bilan_id);

-- ============================================================================
-- Table : phases_preliminaires
-- Description : Stocke l'état des phases préliminaires
-- ============================================================================

CREATE TABLE IF NOT EXISTS phases_preliminaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bilan_id UUID NOT NULL REFERENCES bilans(id) ON DELETE CASCADE,
  phase VARCHAR(50) NOT NULL,
  statut VARCHAR(20) NOT NULL CHECK (statut IN ('non_commence', 'en_cours', 'termine')),
  progression INTEGER DEFAULT 0 CHECK (progression >= 0 AND progression <= 100),
  donnees JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_phases_preliminaires_bilan_id ON phases_preliminaires(bilan_id);
CREATE INDEX idx_phases_preliminaires_phase ON phases_preliminaires(phase);

-- ============================================================================
-- Table : analytics_events
-- Description : Stocke les événements d'analytics
-- ============================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  session_id VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- ============================================================================
-- RLS (Row Level Security)
-- ============================================================================

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions_generees ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions_suivi ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE entretiens_preliminaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE phases_preliminaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Politiques pour analyses
CREATE POLICY "Users can view their own analyses"
  ON analyses FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
    )
  );

CREATE POLICY "Consultants can insert analyses"
  ON analyses FOR INSERT
  WITH CHECK (
    bilan_id IN (
      SELECT id FROM bilans WHERE consultant_id = auth.uid()
    )
  );

-- Politiques pour test_results
CREATE POLICY "Users can view their own test results"
  ON test_results FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own test results"
  ON test_results FOR INSERT
  WITH CHECK (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid()
    )
  );

-- Politiques pour questions_generees
CREATE POLICY "Users can view their own questions"
  ON questions_generees FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own questions"
  ON questions_generees FOR INSERT
  WITH CHECK (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid()
    )
  );

-- Politiques pour questions_suivi
CREATE POLICY "Users can view their own follow-up questions"
  ON questions_suivi FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own follow-up questions"
  ON questions_suivi FOR INSERT
  WITH CHECK (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid()
    )
  );

-- Politiques pour matching_results
CREATE POLICY "Users can view their own matching results"
  ON matching_results FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
    )
  );

CREATE POLICY "System can insert matching results"
  ON matching_results FOR INSERT
  WITH CHECK (true);

-- Politiques pour entretiens_preliminaires
CREATE POLICY "Users can view their own preliminary interviews"
  ON entretiens_preliminaires FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
    )
  );

CREATE POLICY "Consultants can manage preliminary interviews"
  ON entretiens_preliminaires FOR ALL
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE consultant_id = auth.uid()
    )
  );

-- Politiques pour phases_preliminaires
CREATE POLICY "Users can view their own preliminary phases"
  ON phases_preliminaires FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own preliminary phases"
  ON phases_preliminaires FOR ALL
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid() OR consultant_id = auth.uid()
    )
  );

-- Politiques pour analytics_events
CREATE POLICY "Users can view their own analytics"
  ON analytics_events FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert analytics events"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- Triggers pour updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_analyses_updated_at
  BEFORE UPDATE ON analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entretiens_preliminaires_updated_at
  BEFORE UPDATE ON entretiens_preliminaires
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_phases_preliminaires_updated_at
  BEFORE UPDATE ON phases_preliminaires
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Commentaires
-- ============================================================================

COMMENT ON TABLE analyses IS 'Analyses complètes de profil générées par l''IA Gemini';
COMMENT ON TABLE test_results IS 'Résultats des tests psychométriques (MBTI, DISC, Big Five, RIASEC)';
COMMENT ON TABLE questions_generees IS 'Questions générées dynamiquement par l''IA';
COMMENT ON TABLE questions_suivi IS 'Questions de suivi basées sur les réponses précédentes';
COMMENT ON TABLE matching_results IS 'Résultats de matching avec offres d''emploi et formations';
COMMENT ON TABLE entretiens_preliminaires IS 'Données des entretiens préliminaires';
COMMENT ON TABLE phases_preliminaires IS 'État et progression des phases préliminaires';
COMMENT ON TABLE analytics_events IS 'Événements d''analytics pour le suivi de l''utilisation';

