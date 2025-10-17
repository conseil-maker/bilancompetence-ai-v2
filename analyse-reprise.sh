#!/bin/bash

echo "==================================="
echo "ANALYSE DE REPRISE - BilanCompetence.AI v2"
echo "==================================="
echo ""

# 1. Vérifier les variables d'environnement
echo "1. VARIABLES D'ENVIRONNEMENT"
echo "-----------------------------------"
if [ -f .env.local ]; then
    echo "✅ Fichier .env.local trouvé"
    echo "Contenu (masqué):"
    cat .env.local | sed 's/=.*/=***MASKED***/g'
else
    echo "❌ Fichier .env.local manquant"
fi
echo ""

# 2. Vérifier la connexion GitHub
echo "2. CONNEXION GITHUB"
echo "-----------------------------------"
git remote -v
echo ""

# 3. Vérifier le statut Git
echo "3. STATUT GIT"
echo "-----------------------------------"
git status --short
if [ $? -eq 0 ]; then
    echo "✅ Dépôt Git propre"
else
    echo "⚠️ Modifications non commitées"
fi
echo ""

# 4. Compter les fichiers
echo "4. STATISTIQUES DU PROJET"
echo "-----------------------------------"
echo "Pages TypeScript/React: $(find src/app -name '*.tsx' | wc -l)"
echo "Composants: $(find src/components -name '*.tsx' 2>/dev/null | wc -l)"
echo "API Routes: $(find src/app/api -name 'route.ts' | wc -l)"
echo "Modules Supabase: $(find src/lib/supabase/modules -type d -mindepth 1 | wc -l)"
echo "Migrations SQL: $(ls supabase/migrations/*.sql 2>/dev/null | wc -l)"
echo ""

# 5. Vérifier les dépendances
echo "5. DÉPENDANCES"
echo "-----------------------------------"
if [ -d node_modules ]; then
    echo "✅ node_modules installé"
    echo "Taille: $(du -sh node_modules | cut -f1)"
else
    echo "❌ node_modules manquant"
fi
echo ""

# 6. Vérifier le build
echo "6. DERNIER BUILD"
echo "-----------------------------------"
if [ -d .next ]; then
    echo "✅ Dossier .next trouvé"
    echo "Date: $(stat -c %y .next | cut -d' ' -f1,2)"
else
    echo "❌ Pas de build récent"
fi
echo ""

# 7. Vérifier les fichiers de configuration
echo "7. FICHIERS DE CONFIGURATION"
echo "-----------------------------------"
for file in package.json next.config.ts tailwind.config.ts tsconfig.json vercel.json; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file manquant"
    fi
done
echo ""

echo "==================================="
echo "FIN DE L'ANALYSE"
echo "==================================="
