# Optimisation des Performances

## Objectifs de Performance

### Core Web Vitals

- **LCP (Largest Contentful Paint)** : < 2.5s ✅
- **FID (First Input Delay)** : < 100ms ✅
- **CLS (Cumulative Layout Shift)** : < 0.1 ✅

### Lighthouse Scores

- **Performance** : > 90 🎯
- **Accessibility** : > 90 🎯
- **Best Practices** : > 90 🎯
- **SEO** : > 90 🎯

## Optimisations Implémentées

### 1. Next.js App Router

✅ **Server Components par défaut**
- Rendu côté serveur pour contenu statique
- Réduction du JavaScript côté client
- Meilleure performance initiale

✅ **Client Components uniquement si nécessaire**
```tsx
'use client' // Uniquement pour interactivité
```

### 2. Images

✅ **Next.js Image Component**
```tsx
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Description"
  width={1200}
  height={600}
  priority // Pour images above-the-fold
  placeholder="blur" // Placeholder flou
/>
```

✅ **Formats modernes**
- WebP automatique avec fallback
- Lazy loading par défaut
- Responsive images

### 3. Fonts

✅ **next/font pour optimisation**
```tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // FOUT au lieu de FOIT
  variable: '--font-inter',
})
```

✅ **Preload des fonts critiques**
- Chargement prioritaire
- Pas de flash de texte invisible

### 4. Code Splitting

✅ **Dynamic Imports**
```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false, // Client-side uniquement si nécessaire
})
```

✅ **Route-based splitting automatique**
- Chaque page = bundle séparé
- Chargement à la demande

### 5. Caching

✅ **Supabase Caching**
```typescript
// Cache les requêtes fréquentes
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()
  .cache(3600) // 1 heure
```

✅ **API Route Caching**
```typescript
export const revalidate = 3600 // Revalidation toutes les heures

export async function GET() {
  // ...
}
```

✅ **Static Generation**
```tsx
export async function generateStaticParams() {
  // Pré-générer les pages statiques
  return [
    { slug: 'tarifs' },
    { slug: 'a-propos' },
    { slug: 'contact' },
  ]
}
```

### 6. Bundle Size

✅ **Tree Shaking**
- Import uniquement ce qui est utilisé
- Suppression du code mort

✅ **Analyse du bundle**
```bash
pnpm add -D @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // ...
})

# Analyser
ANALYZE=true pnpm build
```

### 7. Database Queries

✅ **Requêtes optimisées**
```typescript
// ❌ Mauvais : N+1 queries
for (const bilan of bilans) {
  const user = await supabase
    .from('profiles')
    .select('*')
    .eq('id', bilan.user_id)
    .single()
}

// ✅ Bon : 1 query avec JOIN
const { data } = await supabase
  .from('bilans')
  .select(`
    *,
    profiles(*)
  `)
```

✅ **Indexes sur colonnes fréquentes**
```sql
CREATE INDEX idx_bilans_user_id ON bilans(user_id);
CREATE INDEX idx_bilans_status ON bilans(status);
CREATE INDEX idx_messages_bilan_id ON messages(bilan_id);
```

### 8. API Routes

✅ **Compression**
```typescript
// Automatique avec Vercel
// Gzip/Brotli pour réponses > 1KB
```

✅ **Pagination**
```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20

  const { data } = await supabase
    .from('bilans')
    .select('*')
    .range((page - 1) * limit, page * limit - 1)

  return NextResponse.json(data)
}
```

### 9. CSS

✅ **Tailwind CSS JIT**
- Génération à la demande
- CSS minimal en production
- Purge automatique

✅ **Critical CSS inline**
```tsx
// Next.js gère automatiquement
// CSS critique inline dans <head>
```

### 10. JavaScript

✅ **Minification**
- Automatique avec Next.js
- Terser pour production

✅ **Defer non-critical scripts**
```tsx
<Script
  src="https://analytics.example.com/script.js"
  strategy="lazyOnload" // Chargement différé
/>
```

## Monitoring

### 1. Vercel Analytics

```bash
pnpm add @vercel/analytics

// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Web Vitals

```tsx
// app/web-vitals.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
    // Envoyer à analytics
  })
}
```

### 3. Lighthouse CI

```bash
pnpm add -D @lhci/cli

# Lancer l'audit
pnpm lhci autorun
```

## Checklist de Déploiement

### Avant Production

- [ ] Audit Lighthouse (score > 90)
- [ ] Test sur connexion 3G lente
- [ ] Vérification Core Web Vitals
- [ ] Analyse du bundle size
- [ ] Test de charge (Artillery/k6)
- [ ] Monitoring configuré

### Configuration Vercel

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["cdg1"], // Paris pour latence EU
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

## Optimisations Futures

### Court Terme

- [ ] Service Worker pour offline
- [ ] Prefetch des routes critiques
- [ ] Image sprites pour icons
- [ ] HTTP/3 (QUIC)

### Moyen Terme

- [ ] CDN pour assets statiques
- [ ] Edge Functions pour API
- [ ] Streaming SSR
- [ ] Partial Hydration

### Long Terme

- [ ] Islands Architecture
- [ ] Micro-frontends
- [ ] GraphQL avec DataLoader
- [ ] Redis pour cache distribué

## Outils de Test

### Performance

```bash
# Lighthouse
pnpm lighthouse http://localhost:3000 --view

# WebPageTest
# https://www.webpagetest.org

# Chrome DevTools
# Performance tab + Coverage
```

### Load Testing

```bash
# Artillery
pnpm add -D artillery
artillery quick --count 100 --num 10 http://localhost:3000

# k6
k6 run load-test.js
```

### Bundle Analysis

```bash
# Webpack Bundle Analyzer
ANALYZE=true pnpm build

# Source Map Explorer
pnpm add -D source-map-explorer
source-map-explorer '.next/static/**/*.js'
```

## Métriques Cibles

### Temps de Chargement

| Métrique | Cible | Actuel |
|----------|-------|--------|
| TTFB | < 200ms | TBD |
| FCP | < 1.8s | TBD |
| LCP | < 2.5s | TBD |
| TTI | < 3.8s | TBD |

### Bundle Size

| Bundle | Taille Max | Actuel |
|--------|------------|--------|
| Initial JS | < 200KB | TBD |
| Total JS | < 500KB | TBD |
| CSS | < 50KB | TBD |

### API Response Time

| Endpoint | Cible | Actuel |
|----------|-------|--------|
| GET /api/bilans | < 100ms | TBD |
| POST /api/ai/analyze-cv | < 3s | TBD |
| POST /api/payments | < 500ms | TBD |

## Ressources

- **Web.dev** : https://web.dev/vitals
- **Next.js Docs** : https://nextjs.org/docs/app/building-your-application/optimizing
- **Vercel Analytics** : https://vercel.com/analytics
- **Lighthouse** : https://developers.google.com/web/tools/lighthouse

