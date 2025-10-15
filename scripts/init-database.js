const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rjklvexwqukhunireqna.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2x2ZXh3cXVraHVuaXJlcW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQzMjg4OSwiZXhwIjoyMDc2MDA4ODg5fQ.v12zFjQGC3v_dTq4iNxTGNg8BbXX3JYo5sc_Z4hn3sM';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function initDatabase() {
  console.log('🚀 Initialisation de la base de données Supabase...\n');

  try {
    // Lire le fichier de migration
    const migrationPath = path.join(__dirname, '../supabase/migrations/20251014_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Fichier de migration chargé');
    console.log(`📏 Taille: ${migrationSQL.length} caractères\n`);

    // Exécuter la migration via l'API Supabase
    console.log('⚙️  Exécution de la migration...');
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: migrationSQL
    });

    if (error) {
      console.error('❌ Erreur lors de l\'exécution de la migration:', error);
      
      // Alternative: utiliser psql via l'API REST
      console.log('\n🔄 Tentative alternative via l\'API REST...');
      
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ sql_query: migrationSQL })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur API: ${response.status} - ${errorText}`);
      }

      console.log('✅ Migration exécutée avec succès via l\'API REST');
    } else {
      console.log('✅ Migration exécutée avec succès');
      console.log('📊 Résultat:', data);
    }

    // Vérifier que la table profiles existe
    console.log('\n🔍 Vérification de la table profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (profilesError) {
      console.error('❌ Erreur lors de la vérification:', profilesError);
    } else {
      console.log('✅ Table profiles accessible');
    }

    console.log('\n🎉 Initialisation terminée avec succès!');
  } catch (error) {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  }
}

// Exécuter l'initialisation
initDatabase();

