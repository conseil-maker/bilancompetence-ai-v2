# Commandes Utiles - BilanCompetence.AI v2

## 🚀 Développement

### Démarrage du serveur de développement
```bash
pnpm dev
```
Ouvre l'application sur http://localhost:3000

### Build de production
```bash
pnpm build
```
Crée une version optimisée pour la production

### Démarrage du serveur de production
```bash
pnpm start
```
Lance le serveur Next.js en mode production

### Linting
```bash
pnpm lint
```
Vérifie la qualité du code avec ESLint

### Formatage du code
```bash
pnpm format
```
Formate le code avec Prettier (si configuré)

---

## 🧪 Tests

### Tests unitaires
```bash
# Exécuter tous les tests
pnpm test

# Mode watch (re-exécute automatiquement)
pnpm test:watch

# Avec couverture
pnpm test:coverage
```

### Tests E2E
```bash
# Exécuter les tests E2E
pnpm test:e2e

# Mode UI interactif
pnpm test:e2e:ui

# Mode debug
pnpm test:e2e:debug
```

### Tests de performance
```bash
# Lighthouse CI
pnpm lighthouse

# Analyse du bundle
pnpm analyze
```

---

## 📦 Gestion des Dépendances

### Installer les dépendances
```bash
pnpm install
```

### Ajouter une dépendance
```bash
# Production
pnpm add package-name

# Développement
pnpm add -D package-name
```

### Mettre à jour les dépendances
```bash
# Toutes les dépendances
pnpm update

# Une dépendance spécifique
pnpm update package-name

# Vérifier les dépendances obsolètes
pnpm outdated
```

### Audit de sécurité
```bash
pnpm audit

# Corriger automatiquement
pnpm audit --fix
```

---

## 🗄️ Base de Données

### Migrations Supabase
```bash
# Se connecter à Supabase
psql -h db.xxx.supabase.co -U postgres -d postgres

# Exécuter une migration
psql -h db.xxx.supabase.co -U postgres -d postgres -f supabase/migrations/migration.sql

# Exécuter le seed
psql -h db.xxx.supabase.co -U postgres -d postgres -f supabase/seed.sql
```

### Générer les types TypeScript depuis Supabase
```bash
npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
```

---

## 🔧 Git

### Workflow standard
```bash
# Créer une nouvelle branche
git checkout -b feature/ma-fonctionnalite

# Ajouter les changements
git add .

# Commit
git commit -m "feat: description de la fonctionnalité"

# Push
git push origin feature/ma-fonctionnalite
```

### Conventions de commit
```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage, point-virgules manquants, etc.
refactor: refactorisation du code
test: ajout de tests
chore: maintenance
```

---

## 🚀 Déploiement

### Déploiement sur Vercel (CLI)
```bash
# Installer Vercel CLI
pnpm add -g vercel

# Se connecter
vercel login

# Déployer en preview
vercel

# Déployer en production
vercel --prod
```

### Vérification pré-déploiement
```bash
# Exécuter le script de validation
./scripts/pre-deploy-check.sh
```

---

## 📊 Monitoring

### Logs Vercel
```bash
# Voir les logs en temps réel
vercel logs

# Logs d'un déploiement spécifique
vercel logs [deployment-url]
```

### Vérifier le Service Worker
```javascript
// Dans la console du navigateur
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations);
});
```

### Vider le cache
```javascript
// Dans la console du navigateur
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

---

## 🔍 Debugging

### Mode debug Next.js
```bash
NODE_OPTIONS='--inspect' pnpm dev
```
Puis ouvrir chrome://inspect dans Chrome

### Logs détaillés
```bash
DEBUG=* pnpm dev
```

### Analyser le bundle
```bash
ANALYZE=true pnpm build
```
Ouvre une visualisation interactive du bundle

---

## 🧹 Nettoyage

### Nettoyer les fichiers de build
```bash
rm -rf .next
rm -rf out
rm -rf build
```

### Nettoyer les dépendances
```bash
rm -rf node_modules
pnpm install
```

### Nettoyer le cache pnpm
```bash
pnpm store prune
```

---

## 📱 PWA

### Tester le Service Worker localement
```bash
# Build de production
pnpm build

# Servir avec un serveur HTTP
pnpm start

# Ou utiliser serve
npx serve out
```

### Désinstaller le Service Worker
```javascript
// Dans la console du navigateur
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});
```

---

## 🔐 Sécurité

### Vérifier les vulnérabilités
```bash
# npm audit
pnpm audit

# Snyk
npx snyk test

# OWASP Dependency Check
dependency-check --project BilanCompetence --scan .
```

### Vérifier les secrets
```bash
# TruffleHog
trufflehog filesystem . --json
```

---

## 📈 Performance

### Mesurer les Web Vitals
```javascript
// Dans la console du navigateur
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

### Analyser les performances
```bash
# Chrome DevTools Coverage
# Ouvrir DevTools > Cmd+Shift+P > "Show Coverage"

# Lighthouse
npx lighthouse http://localhost:3000 --view
```

---

## 🛠️ Utilitaires

### Générer un composant
```bash
# Créer la structure de fichier
mkdir -p src/components/MonComposant
touch src/components/MonComposant/MonComposant.tsx
touch src/components/MonComposant/index.ts
```

### Générer un hook personnalisé
```bash
touch src/hooks/useMonHook.ts
```

### Générer une page
```bash
mkdir -p src/app/ma-page
touch src/app/ma-page/page.tsx
```

---

## 📚 Documentation

### Générer la documentation API
```bash
# TypeDoc
npx typedoc --out docs src
```

### Servir la documentation localement
```bash
# Docsify
npx docsify serve docs
```

---

## 🔄 CI/CD

### Déclencher manuellement un workflow
```bash
# Via GitHub CLI
gh workflow run deploy.yml

# Via l'interface GitHub
# Actions > Workflow > Run workflow
```

### Voir les logs d'un workflow
```bash
gh run list
gh run view [run-id]
```

---

## 💡 Astuces

### Accélérer pnpm
```bash
# Utiliser le cache global
pnpm config set store-dir ~/.pnpm-store

# Désactiver les scripts post-install
pnpm install --ignore-scripts
```

### Déboguer les problèmes de build
```bash
# Build avec logs détaillés
pnpm build --debug

# Vérifier la configuration Next.js
pnpm next info
```

### Optimiser les images
```bash
# Installer sharp pour de meilleures performances
pnpm add sharp
```

---

**Aide supplémentaire**: Consultez la documentation complète dans les fichiers MD du projet.
