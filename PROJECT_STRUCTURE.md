# Structure du Projet BilanCompetence.AI v2

## Architecture des Dossiers

```
bilancompetence-ai-v2/
├── src/
│   ├── app/                          # App Router Next.js
│   │   ├── (public)/                 # Routes publiques (vitrine)
│   │   │   ├── page.tsx              # Page d'accueil
│   │   │   ├── tarifs/               # Page tarifs
│   │   │   ├── a-propos/             # Page à propos
│   │   │   └── contact/              # Page contact
│   │   ├── (auth)/                   # Routes d'authentification
│   │   │   ├── login/                # Connexion
│   │   │   ├── register/             # Inscription
│   │   │   └── forgot-password/      # Mot de passe oublié
│   │   ├── (beneficiaire)/           # Espace bénéficiaire (protégé)
│   │   │   ├── dashboard/            # Tableau de bord
│   │   │   ├── parcours/             # Mon parcours
│   │   │   ├── tests/                # Tests et évaluations
│   │   │   ├── documents/            # Mes documents
│   │   │   └── messages/             # Messagerie
│   │   ├── (consultant)/             # Espace consultant (protégé)
│   │   │   ├── dashboard/            # Tableau de bord consultant
│   │   │   ├── beneficiaires/        # Gestion bénéficiaires
│   │   │   ├── calendrier/           # Planning
│   │   │   └── ressources/           # Bibliothèque ressources
│   │   ├── (admin)/                  # Back-office admin (protégé)
│   │   │   ├── dashboard/            # Tableau de bord admin
│   │   │   ├── utilisateurs/         # Gestion utilisateurs
│   │   │   ├── contenus/             # Gestion contenus
│   │   │   ├── qualiopi/             # Rapports Qualiopi
│   │   │   └── parametres/           # Paramètres plateforme
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/                 # Endpoints authentification
│   │   │   ├── beneficiaires/        # Endpoints bénéficiaires
│   │   │   ├── consultants/          # Endpoints consultants
│   │   │   ├── ai/                   # Endpoints IA
│   │   │   ├── stripe/               # Webhooks Stripe
│   │   │   └── qualiopi/             # Rapports Qualiopi
│   │   ├── layout.tsx                # Layout racine
│   │   └── globals.css               # Styles globaux
│   ├── components/                   # Composants React
│   │   ├── ui/                       # Composants UI réutilisables
│   │   ├── forms/                    # Formulaires
│   │   ├── layouts/                  # Layouts
│   │   └── features/                 # Composants métier
│   ├── lib/                          # Utilitaires et configurations
│   │   ├── supabase/                 # Configuration Supabase
│   │   │   ├── client.ts             # Client Supabase (browser)
│   │   │   ├── server.ts             # Server Supabase (server)
│   │   │   └── middleware.ts         # Middleware auth
│   │   ├── stripe/                   # Configuration Stripe
│   │   ├── ai/                       # Modules IA
│   │   └── utils.ts                  # Fonctions utilitaires
│   ├── types/                        # Types TypeScript
│   │   ├── database.types.ts         # Types Supabase générés
│   │   ├── auth.types.ts             # Types authentification
│   │   └── models.types.ts           # Types métier
│   ├── hooks/                        # Custom React Hooks
│   ├── middleware.ts                 # Middleware Next.js
│   └── constants/                    # Constantes
├── supabase/                         # Configuration Supabase
│   ├── migrations/                   # Migrations SQL
│   ├── functions/                    # Edge Functions
│   └── seed.sql                      # Données de test
├── public/                           # Assets statiques
│   ├── images/
│   └── documents/
├── .env.local.example                # Variables d'environnement (exemple)
├── .env.local                        # Variables d'environnement (local, git-ignored)
├── next.config.ts                    # Configuration Next.js
├── tailwind.config.ts                # Configuration Tailwind
├── tsconfig.json                     # Configuration TypeScript
├── package.json                      # Dépendances
└── README.md                         # Documentation
```

## Conventions de Nommage

- **Composants** : PascalCase (`UserProfile.tsx`)
- **Fichiers utilitaires** : camelCase (`formatDate.ts`)
- **Dossiers** : kebab-case (`user-profile/`)
- **Routes** : kebab-case (`/mon-parcours`)
- **Types** : PascalCase avec suffix `.types.ts` (`User.types.ts`)

## Stack Technologique

- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS 4
- **Backend** : Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Déploiement** : Vercel
- **Validation** : Zod
- **Formulaires** : React Hook Form
- **Icons** : Lucide React
- **Paiement** : Stripe
- **IA** : OpenAI API

## Prochaines Étapes

1. Créer la structure de base de données Supabase
2. Configurer l'authentification avec RBAC
3. Développer les composants UI de base
4. Implémenter les routes publiques (vitrine)
5. Développer les espaces utilisateurs (bénéficiaire, consultant, admin)

