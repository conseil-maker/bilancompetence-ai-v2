#!/bin/bash

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║   Déploiement Final BilanCompetence.AI v2             ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

cd /home/ubuntu/bilancompetence-ai-v2

echo "📝 Commit des corrections OpenAI..."
git add -A
git commit -m "fix: Handle missing OpenAI API key gracefully in all AI services" || echo "Rien à commiter"
git push origin master

echo ""
echo "🚀 Déploiement sur Vercel..."
vercel --prod --yes

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║              ✅ DÉPLOIEMENT TERMINÉ !                  ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "🎉 Votre application est maintenant en ligne !"
echo ""
echo "📍 Pour voir l'URL de production, exécutez :"
echo "   vercel ls | head -3"
echo ""

