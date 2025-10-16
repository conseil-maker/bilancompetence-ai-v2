-- =====================================================
-- Migration: Ajout de la table Plan d'Action
-- Date: 2025-10-17
-- Description: Plan d'action interactif avec suivi Kanban
-- =====================================================

-- =====================================================
-- TABLE: plan_action
-- Actions du plan d'action avec suivi Kanban
-- =====================================================

CREATE TABLE plan_action (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bilan_id UUID REFERENCES bilans(id) ON DELETE CASCADE NOT NULL,
  piste_metier_id UUID REFERENCES pistes_metiers(id) ON DELETE SET NULL, -- Peut être NULL si action générale
  formation_id UUID REFERENCES formations(id) ON DELETE SET NULL, -- Peut être NULL
  
  -- Informations de l'action
  titre TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'formation', 'recherche_emploi', 'vae', 'creation_entreprise', 'bilan_complementaire', 'autre'
  categorie TEXT, -- 'court_terme', 'moyen_terme', 'long_terme'
  
  -- Statut Kanban
  statut TEXT DEFAULT 'a_faire', -- 'a_faire', 'en_cours', 'termine', 'abandonne', 'en_attente'
  priorite INTEGER CHECK (priorite >= 1 AND priorite <= 5), -- 1=haute, 5=basse
  ordre INTEGER, -- Ordre d'affichage dans la colonne Kanban
  
  -- Dates
  date_debut_prevue DATE,
  date_fin_prevue DATE,
  date_debut_reelle DATE,
  date_fin_reelle DATE,
  date_echeance DATE,
  
  -- Rappels
  rappel_active BOOLEAN DEFAULT FALSE,
  date_rappel DATE,
  rappel_envoye BOOLEAN DEFAULT FALSE,
  
  -- Détails
  sous_taches JSONB, -- Liste des sous-tâches avec leur statut
  ressources_necessaires TEXT[],
  contacts TEXT[], -- Personnes à contacter
  liens TEXT[], -- URLs utiles
  
  -- Suivi
  progression INTEGER DEFAULT 0 CHECK (progression >= 0 AND progression <= 100), -- Pourcentage de complétion
  notes TEXT,
  obstacles TEXT, -- Obstacles rencontrés
  
  -- Validation
  validee_par_consultant BOOLEAN DEFAULT FALSE,
  commentaire_consultant TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Qui a créé l'action
  
  -- Contraintes
  CONSTRAINT valid_dates CHECK (
    date_fin_prevue IS NULL OR date_debut_prevue IS NULL OR date_fin_prevue >= date_debut_prevue
  )
);

-- Index
CREATE INDEX idx_plan_action_bilan ON plan_action(bilan_id);
CREATE INDEX idx_plan_action_statut ON plan_action(statut);
CREATE INDEX idx_plan_action_priorite ON plan_action(priorite);
CREATE INDEX idx_plan_action_echeance ON plan_action(date_echeance) WHERE date_echeance IS NOT NULL;
CREATE INDEX idx_plan_action_rappel ON plan_action(date_rappel) WHERE rappel_active = TRUE AND rappel_envoye = FALSE;
CREATE INDEX idx_plan_action_ordre ON plan_action(statut, ordre);

-- =====================================================
-- TRIGGER: Mise à jour automatique du statut
-- =====================================================

CREATE OR REPLACE FUNCTION update_action_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Si la progression atteint 100%, passer en "terminé"
  IF NEW.progression = 100 AND NEW.statut != 'termine' THEN
    NEW.statut := 'termine';
    NEW.date_fin_reelle := CURRENT_DATE;
  END IF;
  
  -- Si on commence une action (date_debut_reelle), passer en "en_cours"
  IF NEW.date_debut_reelle IS NOT NULL AND OLD.date_debut_reelle IS NULL AND NEW.statut = 'a_faire' THEN
    NEW.statut := 'en_cours';
  END IF;
  
  -- Mettre à jour updated_at
  NEW.updated_at := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_action_status
  BEFORE UPDATE ON plan_action
  FOR EACH ROW
  EXECUTE FUNCTION update_action_status();

-- =====================================================
-- FONCTION: Générer des rappels automatiques
-- =====================================================

CREATE OR REPLACE FUNCTION generer_rappels_actions()
RETURNS TABLE(
  action_id UUID,
  bilan_id UUID,
  beneficiaire_id UUID,
  titre TEXT,
  date_echeance DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pa.id,
    pa.bilan_id,
    b.beneficiaire_id,
    pa.titre,
    pa.date_echeance
  FROM plan_action pa
  JOIN bilans b ON pa.bilan_id = b.id
  WHERE pa.rappel_active = TRUE
    AND pa.rappel_envoye = FALSE
    AND pa.date_rappel <= CURRENT_DATE
    AND pa.statut NOT IN ('termine', 'abandonne');
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generer_rappels_actions IS 'Fonction pour récupérer les actions nécessitant un rappel';

-- =====================================================
-- VUE: Statistiques du plan d'action par bilan
-- =====================================================

CREATE OR REPLACE VIEW stats_plan_action AS
SELECT 
  bilan_id,
  COUNT(*) as total_actions,
  COUNT(*) FILTER (WHERE statut = 'a_faire') as actions_a_faire,
  COUNT(*) FILTER (WHERE statut = 'en_cours') as actions_en_cours,
  COUNT(*) FILTER (WHERE statut = 'termine') as actions_terminees,
  COUNT(*) FILTER (WHERE statut = 'abandonne') as actions_abandonnees,
  ROUND(AVG(progression), 2) as progression_moyenne,
  COUNT(*) FILTER (WHERE date_echeance < CURRENT_DATE AND statut NOT IN ('termine', 'abandonne')) as actions_en_retard
FROM plan_action
GROUP BY bilan_id;

COMMENT ON VIEW stats_plan_action IS 'Statistiques agrégées du plan d''action par bilan';

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE plan_action ENABLE ROW LEVEL SECURITY;

-- Les bénéficiaires voient leurs propres actions
CREATE POLICY "Les bénéficiaires voient leurs actions"
  ON plan_action FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid()
    )
  );

-- Les consultants voient les actions de leurs bilans
CREATE POLICY "Les consultants voient les actions de leurs bilans"
  ON plan_action FOR SELECT
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE consultant_id = auth.uid()
    )
  );

-- Les admins voient toutes les actions
CREATE POLICY "Les admins voient toutes les actions"
  ON plan_action FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Les bénéficiaires peuvent créer leurs actions
CREATE POLICY "Les bénéficiaires peuvent créer des actions"
  ON plan_action FOR INSERT
  WITH CHECK (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid()
    )
  );

-- Les consultants peuvent créer des actions
CREATE POLICY "Les consultants peuvent créer des actions"
  ON plan_action FOR INSERT
  WITH CHECK (
    bilan_id IN (
      SELECT id FROM bilans WHERE consultant_id = auth.uid()
    )
  );

-- Les bénéficiaires peuvent modifier leurs actions
CREATE POLICY "Les bénéficiaires peuvent modifier leurs actions"
  ON plan_action FOR UPDATE
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid()
    )
  );

-- Les consultants peuvent modifier les actions de leurs bilans
CREATE POLICY "Les consultants peuvent modifier les actions"
  ON plan_action FOR UPDATE
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE consultant_id = auth.uid()
    )
  );

-- Les bénéficiaires peuvent supprimer leurs actions
CREATE POLICY "Les bénéficiaires peuvent supprimer leurs actions"
  ON plan_action FOR DELETE
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE beneficiaire_id = auth.uid()
    )
  );

-- Les consultants peuvent supprimer les actions de leurs bilans
CREATE POLICY "Les consultants peuvent supprimer les actions"
  ON plan_action FOR DELETE
  USING (
    bilan_id IN (
      SELECT id FROM bilans WHERE consultant_id = auth.uid()
    )
  );

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON TABLE plan_action IS 'Plan d''action interactif avec suivi Kanban pour la mise en œuvre du projet professionnel';
COMMENT ON COLUMN plan_action.statut IS 'Statut Kanban: a_faire, en_cours, termine, abandonne, en_attente';
COMMENT ON COLUMN plan_action.priorite IS '1=haute priorité, 5=basse priorité';
COMMENT ON COLUMN plan_action.progression IS 'Pourcentage de complétion de l''action (0-100)';
COMMENT ON COLUMN plan_action.sous_taches IS 'Liste des sous-tâches au format JSON avec leur statut';
COMMENT ON COLUMN plan_action.ordre IS 'Ordre d''affichage dans la colonne Kanban (drag & drop)';

