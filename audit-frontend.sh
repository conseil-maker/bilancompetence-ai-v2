#!/bin/bash

echo "=========================================="
echo "AUDIT FRONTEND - BilanCompetence.AI v2"
echo "=========================================="
echo ""

# 1. Lister toutes les pages
echo "1. PAGES DISPONIBLES"
echo "----------------------------------------"
find src/app -name "page.tsx" | sort | while read file; do
    route=$(echo $file | sed 's|src/app||' | sed 's|/page.tsx||' | sed 's|(.*)||g')
    [ -z "$route" ] && route="/"
    lines=$(wc -l < "$file")
    echo "  $route ($lines lignes)"
done
echo ""

# 2. Vérifier les layouts
echo "2. LAYOUTS"
echo "----------------------------------------"
find src/app -name "layout.tsx" | sort | while read file; do
    route=$(echo $file | sed 's|src/app||' | sed 's|/layout.tsx||')
    [ -z "$route" ] && route="/ (root)"
    lines=$(wc -l < "$file")
    echo "  $route ($lines lignes)"
done
echo ""

# 3. Vérifier les composants
echo "3. COMPOSANTS"
echo "----------------------------------------"
echo "  Total composants: $(find src/components -name "*.tsx" | wc -l)"
echo "  - layouts: $(find src/components/layouts -name "*.tsx" 2>/dev/null | wc -l)"
echo "  - forms: $(find src/components/forms -name "*.tsx" 2>/dev/null | wc -l)"
echo "  - common: $(find src/components/common -name "*.tsx" 2>/dev/null | wc -l)"
echo ""

# 4. Vérifier les pages avec peu de contenu
echo "4. PAGES POTENTIELLEMENT VIDES (< 50 lignes)"
echo "----------------------------------------"
find src/app -name "page.tsx" | while read file; do
    lines=$(wc -l < "$file")
    if [ $lines -lt 50 ]; then
        route=$(echo $file | sed 's|src/app||' | sed 's|/page.tsx||' | sed 's|(.*)||g')
        [ -z "$route" ] && route="/"
        echo "  ⚠️  $route ($lines lignes)"
    fi
done
echo ""

echo "=========================================="
echo "FIN DE L'AUDIT"
echo "=========================================="
