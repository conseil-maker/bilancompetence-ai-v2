#!/usr/bin/env node

/**
 * Script de déploiement automatique sur Vercel
 * Configure les variables d'environnement et connecte le repository GitHub
 */

const https = require('https');

const PROJECT_ID = 'prj_rT7xh8o4ZASD9dx7ZbLndFm3mS98';
const TEAM_ID = 'team_ddwTZPtipdEUBUYiAfKEBw0v';
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || process.env.BEARER_TOKEN;

if (!VERCEL_TOKEN) {
  console.error('❌ VERCEL_TOKEN non trouvé dans les variables d\'environnement');
  console.error('Le token doit être configuré via le MCP Vercel');
  process.exit(1);
}

// Variables d'environnement à configurer
const envVars = [
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    value: 'https://rjklvexwqukhunireqna.supabase.co',
    target: ['production', 'preview', 'development'],
    type: 'plain'
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2x2ZXh3cXVraHVuaXJlcW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzI4ODksImV4cCI6MjA3NjAwODg4OX0.XUAsPZo7LfYuNJpP1YGdsggEfvO8xZOVUXCVZCUVTrw',
    target: ['production', 'preview', 'development'],
    type: 'plain'
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2x2ZXh3cXVraHVuaXJlcW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQzMjg4OSwiZXhwIjoyMDc2MDA4ODg5fQ.v12zFjQGC3v_dTq4iNxTGNg8BbXX3JYo5sc_Z4hn3sM',
    target: ['production', 'preview', 'development'],
    type: 'encrypted'
  }
];

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(response)}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}, Body: ${body}`));
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function configureEnvironmentVariables() {
  console.log('🔧 Configuration des variables d\'environnement...\n');
  
  for (const envVar of envVars) {
    try {
      console.log(`  ➤ Ajout de ${envVar.key}...`);
      
      const response = await makeRequest(
        'POST',
        `/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}&upsert=true`,
        envVar
      );
      
      if (response.created) {
        console.log(`    ✅ ${envVar.key} configurée avec succès`);
      } else if (response.failed && response.failed.length > 0) {
        console.log(`    ⚠️  ${envVar.key}: ${response.failed[0].error.message}`);
      }
    } catch (error) {
      console.error(`    ❌ Erreur pour ${envVar.key}:`, error.message);
    }
  }
}

async function linkGitRepository() {
  console.log('\n🔗 Connexion du repository GitHub...\n');
  
  try {
    const linkData = {
      type: 'github',
      repo: 'conseil-maker/bilancompetence-ai-v2',
      gitBranch: 'master'
    };
    
    const response = await makeRequest(
      'POST',
      `/v9/projects/${PROJECT_ID}/link?teamId=${TEAM_ID}`,
      linkData
    );
    
    console.log('  ✅ Repository GitHub connecté avec succès');
    return response;
  } catch (error) {
    console.error('  ❌ Erreur lors de la connexion du repository:', error.message);
    throw error;
  }
}

async function triggerDeployment() {
  console.log('\n🚀 Déclenchement du déploiement...\n');
  
  try {
    // Créer un déploiement via l'API
    const deployData = {
      name: 'bilancompetence-ai-v2',
      gitSource: {
        type: 'github',
        repo: 'conseil-maker/bilancompetence-ai-v2',
        ref: 'master'
      }
    };
    
    const response = await makeRequest(
      'POST',
      `/v13/deployments?teamId=${TEAM_ID}`,
      deployData
    );
    
    console.log('  ✅ Déploiement lancé avec succès');
    console.log(`  📍 URL: ${response.url || 'En cours...'}`);
    console.log(`  🆔 ID: ${response.id || response.uid}`);
    
    return response;
  } catch (error) {
    console.error('  ❌ Erreur lors du déploiement:', error.message);
    throw error;
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   Déploiement Automatique BilanCompetence.AI v2        ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  try {
    // Étape 1: Configurer les variables d'environnement
    await configureEnvironmentVariables();
    
    // Étape 2: Connecter le repository GitHub
    await linkGitRepository();
    
    // Étape 3: Déclencher le déploiement
    await triggerDeployment();
    
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║              ✅ DÉPLOIEMENT RÉUSSI !                   ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log('Votre application sera disponible dans quelques minutes à :');
    console.log('https://bilancompetence-ai-v2.vercel.app\n');
    
  } catch (error) {
    console.error('\n❌ Échec du déploiement:', error.message);
    process.exit(1);
  }
}

main();

