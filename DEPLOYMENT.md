# Guide de Déploiement

## Déploiement sur Vercel

### Prérequis

- Compte Vercel (https://vercel.com)
- Compte Supabase configuré
- Comptes Stripe, OpenAI, Google Cloud configurés
- Repository GitHub prêt

### Étape 1 : Connexion à Vercel

```bash
# Installer Vercel CLI
pnpm add -g vercel

# Se connecter
vercel login

# Lier le projet
vercel link
```

### Étape 2 : Configuration des Variables d'Environnement

**Via Vercel Dashboard** :

1. Aller sur https://vercel.com/dashboard
2. Sélectionner le projet
3. Settings > Environment Variables

**Variables à configurer** :

#### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

#### Stripe
```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### OpenAI
```
OPENAI_API_KEY=sk-...
```

#### Google Calendar
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

#### Application
```
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
NODE_ENV=production
```

**Via CLI** :

```bash
# Ajouter une variable
vercel env add NEXT_PUBLIC_SUPABASE_URL

# Importer depuis .env.local
vercel env pull
```

### Étape 3 : Configuration Supabase

**1. Créer les tables** :

```bash
# Exécuter les migrations
psql -h db.xxx.supabase.co -U postgres -d postgres -f supabase/migrations/20251014_initial_schema.sql
```

**2. Configurer les policies RLS** :

- Vérifier que toutes les policies sont actives
- Tester les permissions par rôle

**3. Configurer l'authentification** :

- Email/Password activé
- Redirect URLs : `https://votre-domaine.com/auth/callback`

### Étape 4 : Configuration Stripe

**1. Activer le mode Live** :

- Récupérer les clés Live (sk_live_, pk_live_)
- Configurer les webhooks

**2. Webhooks** :

```
URL: https://votre-domaine.com/api/webhooks/stripe
Événements:
- payment_intent.succeeded
- payment_intent.payment_failed
- checkout.session.completed
```

**3. Produits et prix** :

- Créer les 3 formules (Express, Standard, Premium)
- Configurer les prix en euros

### Étape 5 : Configuration Google Cloud

**1. Service Account** :

- Créer un Service Account
- Activer Google Calendar API
- Télécharger la clé JSON
- Extraire email et private_key

**2. Partage des calendriers** :

- Partager les calendriers des consultants avec le Service Account
- Permissions : "Gérer les événements"

### Étape 6 : Déploiement

**Déploiement automatique** :

```bash
# Push sur main déclenche le déploiement
git push origin master
```

**Déploiement manuel** :

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

### Étape 7 : Configuration du Domaine

**1. Ajouter un domaine personnalisé** :

- Vercel Dashboard > Domains
- Ajouter votre domaine
- Configurer les DNS

**2. DNS Records** :

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**3. SSL/TLS** :

- Automatique avec Vercel
- Certificat Let's Encrypt

### Étape 8 : Post-Déploiement

**1. Vérifications** :

```bash
# Tester les endpoints
curl https://votre-domaine.com/api/health

# Vérifier Lighthouse
pnpm lighthouse https://votre-domaine.com
```

**2. Monitoring** :

- Activer Vercel Analytics
- Configurer les alertes
- Vérifier les logs

**3. Sauvegardes** :

- Configurer les backups Supabase
- Exporter les données régulièrement

## Configuration Avancée

### Edge Functions

```typescript
// middleware.ts
export const config = {
  matcher: [
    '/api/:path*',
    '/beneficiaire/:path*',
    '/consultant/:path*',
    '/admin/:path*',
  ],
}
```

### Caching

```typescript
// app/api/route.ts
export const revalidate = 3600 // 1 heure

export async function GET() {
  // ...
}
```

### Rate Limiting

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')
  const { success } = await ratelimit.limit(ip!)

  if (!success) {
    return new Response('Too Many Requests', { status: 429 })
  }

  // ...
}
```

## Rollback

**En cas de problème** :

```bash
# Lister les déploiements
vercel ls

# Rollback vers un déploiement précédent
vercel rollback <deployment-url>
```

## Monitoring

### Vercel Analytics

```tsx
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

### Error Tracking

```bash
# Installer Sentry
pnpm add @sentry/nextjs

# Configurer
npx @sentry/wizard@latest -i nextjs
```

### Uptime Monitoring

- UptimeRobot : https://uptimerobot.com
- Pingdom : https://www.pingdom.com
- Better Uptime : https://betteruptime.com

## Checklist de Déploiement

### Avant Production

- [ ] Toutes les variables d'environnement configurées
- [ ] Base de données Supabase migrée
- [ ] Stripe en mode Live
- [ ] Google Service Account configuré
- [ ] Domaine personnalisé configuré
- [ ] SSL/TLS actif
- [ ] Tests de bout en bout passés
- [ ] Audit Lighthouse > 90
- [ ] Monitoring configuré

### Après Production

- [ ] Vérifier tous les endpoints
- [ ] Tester les paiements Stripe
- [ ] Tester la création de rendez-vous
- [ ] Vérifier les emails (Supabase Auth)
- [ ] Tester l'analyse IA
- [ ] Vérifier les logs Vercel
- [ ] Configurer les alertes
- [ ] Documenter l'URL de production

## Troubleshooting

### Erreur : "Module not found"

```bash
# Nettoyer et rebuilder
rm -rf .next node_modules
pnpm install
pnpm build
```

### Erreur : "Environment variable not found"

```bash
# Vérifier les variables
vercel env ls

# Pull les variables
vercel env pull .env.local
```

### Erreur : "Database connection failed"

- Vérifier les credentials Supabase
- Vérifier les IP autorisées
- Vérifier les policies RLS

### Erreur : "Stripe webhook failed"

- Vérifier le webhook secret
- Vérifier l'URL du webhook
- Vérifier les événements souscrits

## Ressources

- **Vercel Docs** : https://vercel.com/docs
- **Next.js Deployment** : https://nextjs.org/docs/deployment
- **Supabase Production** : https://supabase.com/docs/guides/platform/going-into-prod
- **Stripe Production** : https://stripe.com/docs/development/quickstart#production

