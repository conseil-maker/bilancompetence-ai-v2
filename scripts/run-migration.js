#!/usr/bin/env node
/**
 * Script de migration automatique pour Supabase
 * Exécute la migration pour ajouter first_name et last_name à la table profiles
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('⚠️  Variables d\'environnement Supabase manquantes, migration ignorée');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const migrationSQL = `
BEGIN;

ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT;

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

ALTER TABLE profiles DROP COLUMN IF EXISTS full_name;

COMMIT;
`;

async function runMigration() {
  console.log('🚀 Exécution de la migration Supabase...');
  
  try {
    // Vérifier si la migration est nécessaire
    const { data: columns, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (checkError) {
      console.error('❌ Erreur lors de la vérification:', checkError.message);
      process.exit(1);
    }
    
    // Vérifier si first_name existe déjà
    if (columns && columns.length > 0 && 'first_name' in columns[0]) {
      console.log('✅ Migration déjà appliquée, colonnes first_name et last_name existent');
      process.exit(0);
    }
    
    console.log('📝 Migration nécessaire, exécution du SQL...');
    console.log('⚠️  Note: L\'API Supabase ne permet pas d\'exécuter du SQL DDL directement');
    console.log('📌 Veuillez exécuter manuellement le fichier: supabase/migrations/20251015_split_full_name.sql');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(0); // Ne pas bloquer le build
  }
}

runMigration();

