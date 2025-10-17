#!/bin/bash

echo "🔧 Correction des imports incorrects..."

# Corriger useAuth -> useAuthContext
find src/app -type f -name "*.tsx" -exec sed -i "s/import { useAuth }/import { useAuthContext as useAuth }/g" {} \;
find src/app -type f -name "*.tsx" -exec sed -i "s/from '@\/components\/providers\/AuthProvider'/from '@\/components\/providers\/AuthProvider'/g" {} \;

# Corriger les imports de modules
find src/app -type f -name "*.tsx" -exec sed -i "s/bilansModule/bilans/g" {} \;
find src/app -type f -name "*.tsx" -exec sed -i "s/competencesModule/competences/g" {} \;
find src/app -type f -name "*.tsx" -exec sed -i "s/profilesModule/profiles/g" {} \;
find src/app -type f -name "*.tsx" -exec sed -i "s/qualiopiModule/qualiopi/g" {} \;

echo "✅ Corrections appliquées!"
