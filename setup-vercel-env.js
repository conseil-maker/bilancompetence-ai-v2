#!/usr/bin/env node

/**
 * Script pour configurer les variables d'environnement sur Vercel
 * Utilise l'API Vercel pour ajouter les variables au projet
 */

const https = require('https');

const PROJECT_ID = 'prj_rT7xh8o4ZASD9dx7ZbLndFm3mS98';
const TEAM_ID = 'team_ddwTZPtipdEUBUYiAfKEBw0v';

// Variables d'environnement à configurer
const envVars = [
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    value: 'https://rjklvexwqukhunireqna.supabase.co',
    target: ['production', 'preview', 'development']
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2x2ZXh3cXVraHVuaXJlcW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzI4ODksImV4cCI6MjA3NjAwODg4OX0.XUAsPZo7LfYuNJpP1YGdsggEfvO8xZOVUXCVZCUVTrw',
    target: ['production', 'preview', 'development']
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2x2ZXh3cXVraHVuaXJlcW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQzMjg4OSwiZXhwIjoyMDc2MDA4ODg5fQ.v12zFjQGC3v_dTq4iNxTGNg8BbXX3JYo5sc_Z4hn3sM',
    target: ['production', 'preview', 'development'],
    type: 'secret'
  }
];

console.log('Configuration des variables d\'environnement sur Vercel...\n');
console.log('Projet ID:', PROJECT_ID);
console.log('Team ID:', TEAM_ID);
console.log('\nVariables à configurer:');
envVars.forEach(v => console.log(`- ${v.key}`));
console.log('\nPour configurer ces variables, utilisez l\'interface web Vercel:');
console.log(`https://vercel.com/netz-informatiques-projects/bilancompetence-ai-v2/settings/environment-variables`);
console.log('\nOu utilisez la CLI Vercel après authentification:');
envVars.forEach(v => {
  console.log(`vercel env add ${v.key} production`);
});

