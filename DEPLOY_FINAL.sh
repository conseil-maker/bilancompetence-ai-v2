#!/bin/bash

# Script de déploiement final BilanCompetence.AI v2
# Toutes les corrections TypeScript ont été appliquées

cd /home/ubuntu/bilancompetence-ai-v2

echo "📝 Commit des corrections TypeScript..."
git add src/services/ai/*.ts
git commit -m "fix: Add TypeScript non-null assertions for OpenAI in all AI services"
git push origin master

echo ""
echo "🚀 Déploiement sur Vercel..."
vercel --prod --yes

echo ""
echo "✅ Déploiement terminé !"
echo "Vérifiez le statut avec: vercel ls | head -3"

