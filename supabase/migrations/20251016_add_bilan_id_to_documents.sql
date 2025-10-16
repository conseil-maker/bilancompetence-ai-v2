-- Migration : Ajouter bilan_id à la table documents
-- Date : 16 octobre 2025
-- Description : Ajoute la relation entre documents et bilans

-- Ajouter la colonne bilan_id
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS bilan_id UUID REFERENCES bilans(id) ON DELETE CASCADE;

-- Créer un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_documents_bilan_id ON documents(bilan_id);

-- Mettre à jour les documents existants (si nécessaire)
-- Note : Cette requête doit être adaptée selon la logique métier
-- COMMENT: UPDATE documents SET bilan_id = ... WHERE ...;

-- Ajouter un commentaire sur la colonne
COMMENT ON COLUMN documents.bilan_id IS 'ID du bilan auquel appartient ce document';

