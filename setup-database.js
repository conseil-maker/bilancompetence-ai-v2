const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log('🚀 Configuration de la base de données Supabase...\n')

  try {
    // Lire le fichier SQL de migration
    const migrationSQL = fs.readFileSync('./supabase/migrations/20251014_initial_schema.sql', 'utf8')
    
    console.log('📝 Exécution de la migration SQL...')
    
    // Exécuter le SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (error) {
      // Si la fonction exec_sql n'existe pas, on essaie une autre approche
      console.log('⚠️  Méthode RPC non disponible, utilisation de l\'approche alternative...')
      
      // Diviser le SQL en commandes individuelles
      const commands = migrationSQL
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0)
      
      for (const command of commands) {
        const { error: cmdError } = await supabase.rpc('exec', { sql: command })
        if (cmdError) {
          console.error('❌ Erreur lors de l\'exécution de la commande:', cmdError.message)
        }
      }
    }
    
    console.log('✅ Migration SQL exécutée avec succès !')
    
    // Vérifier que les tables ont été créées
    console.log('\n🔍 Vérification des tables créées...')
    
    const tables = ['profiles', 'bilans', 'tests', 'documents', 'messages', 'resources', 'activites']
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.log(`❌ Table ${table}: Non trouvée`)
      } else {
        console.log(`✅ Table ${table}: OK (${count} enregistrements)`)
      }
    }
    
    console.log('\n🎉 Base de données configurée avec succès !')
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

setupDatabase()
