#!/bin/bash

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║   Déploiement Automatisé BilanCompetence.AI v2         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Étape 1: Vérifier/Installer Vercel CLI
echo "📦 Vérification de Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "  Installation de Vercel CLI..."
    pnpm add -g vercel
    echo "  ✅ Vercel CLI installé"
else
    echo "  ✅ Vercel CLI déjà installé"
fi

echo ""

# Étape 2: Authentification
echo "🔐 Authentification Vercel..."
echo "  Une fenêtre de navigateur va s'ouvrir pour vous connecter."
echo "  Connectez-vous avec votre compte GitHub."
echo ""
read -p "  Appuyez sur Entrée pour continuer..."

vercel login

echo ""
echo "  ✅ Authentification réussie"
echo ""

# Étape 3: Lier le projet
echo "🔗 Liaison du projet..."
cd /home/ubuntu/bilancompetence-ai-v2

# Créer le fichier .vercel/project.json
mkdir -p .vercel
cat > .vercel/project.json << 'EOF'
{
  "projectId": "prj_rT7xh8o4ZASD9dx7ZbLndFm3mS98",
  "orgId": "team_ddwTZPtipdEUBUYiAfKEBw0v"
}
EOF

echo "  ✅ Projet lié"
echo ""

# Étape 4: Configurer les variables d'environnement
echo "🔧 Configuration des variables d'environnement..."

echo "  ➤ NEXT_PUBLIC_SUPABASE_URL..."
echo "https://rjklvexwqukhunireqna.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development 2>/dev/null || echo "    (déjà configurée)"

echo "  ➤ NEXT_PUBLIC_SUPABASE_ANON_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2x2ZXh3cXVraHVuaXJlcW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzI4ODksImV4cCI6MjA3NjAwODg4OX0.XUAsPZo7LfYuNJpP1YGdsggEfvO8xZOVUXCVZCUVTrw" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development 2>/dev/null || echo "    (déjà configurée)"

echo "  ➤ SUPABASE_SERVICE_ROLE_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2x2ZXh3cXVraHVuaXJlcW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQzMjg4OSwiZXhwIjoyMDc2MDA4ODg5fQ.v12zFjQGC3v_dTq4iNxTGNg8BbXX3JYo5sc_Z4hn3sM" | vercel env add SUPABASE_SERVICE_ROLE_KEY production preview development 2>/dev/null || echo "    (déjà configurée)"

echo "  ✅ Variables configurées"
echo ""

# Étape 5: Déployer
echo "🚀 Déploiement en production..."
vercel --prod --yes

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║              ✅ DÉPLOIEMENT RÉUSSI !                   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "🎉 Votre application est maintenant en ligne !"
echo ""
echo "📍 Pour voir l'URL de production, exécutez :"
echo "   vercel ls"
echo ""

