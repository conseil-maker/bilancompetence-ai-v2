-- Migration: 20251015_split_full_name.sql
-- Description: Remplacer full_name par first_name et last_name
-- Author: Recommandation Opus 4.1
-- Date: 2025-10-15

BEGIN;

-- Étape 1: Ajouter les nouvelles colonnes
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Étape 2: Migrer les données existantes de full_name vers first_name/last_name
UPDATE profiles
SET 
  first_name = CASE 
    WHEN full_name IS NOT NULL AND position(' ' in full_name) > 0 
    THEN split_part(full_name, ' ', 1)
    ELSE full_name
  END,
  last_name = CASE 
    WHEN full_name IS NOT NULL AND position(' ' in full_name) > 0 
    THEN substring(full_name from position(' ' in full_name) + 1)
    ELSE NULL
  END
WHERE full_name IS NOT NULL;

-- Étape 3: Supprimer l'ancienne colonne full_name
ALTER TABLE profiles DROP COLUMN IF EXISTS full_name;

COMMIT;

-- Vérification
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

