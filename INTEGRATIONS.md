# Intégrations Tierces

## Vue d'ensemble

La plateforme BilanCompetence.AI s'intègre avec plusieurs services tiers pour offrir une expérience complète :

- **Stripe** : Paiements sécurisés
- **Google Calendar** : Gestion des rendez-vous
- **Google Meet** : Visioconférence intégrée
- **Pennylane** : Facturation et comptabilité (à venir)
- **Wedof** : Gestion administrative (à venir)

## Architecture

```
src/
├── services/
│   ├── stripe/
│   │   └── payment.ts          # Service de paiement Stripe
│   └── calendar/
│       └── google-calendar.ts  # Service Google Calendar
└── app/api/
    ├── payments/
    │   └── create-checkout/    # Création session Stripe
    └── calendar/
        └── create-event/       # Création événement Calendar
```

## 1. Stripe (Paiements)

### Configuration

**Variables d'environnement** :
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

### Fonctionnalités

#### Créer une session de paiement

```typescript
import { createCheckoutSession } from '@/services/stripe/payment'

const session = await createCheckoutSession({
  bilanId: 'bilan_123',
  userId: 'user_456',
  formule: 'standard', // 'express' | 'standard' | 'premium'
  amount: 180000, // Optionnel, calculé automatiquement
})

// Rediriger vers la page de paiement Stripe
window.location.href = session.url
```

#### Tarifs des formules

- **Express** : 1 200€ (12h d'accompagnement)
- **Standard** : 1 800€ (18h d'accompagnement)
- **Premium** : 2 400€ (24h d'accompagnement)

#### Confirmer un paiement

```typescript
import { confirmPayment } from '@/services/stripe/payment'

const isSuccessful = await confirmPayment(paymentIntentId)
```

#### Créer un client Stripe

```typescript
import { createCustomer } from '@/services/stripe/payment'

const customerId = await createCustomer({
  email: 'user@example.com',
  name: 'Jean Dupont',
  metadata: {
    userId: 'user_123',
  },
})
```

#### Rembourser un paiement

```typescript
import { refundPayment } from '@/services/stripe/payment'

const refunded = await refundPayment(
  paymentIntentId,
  amount // Optionnel, remboursement partiel
)
```

### Webhook Stripe

**À implémenter** : Endpoint pour recevoir les événements Stripe

```typescript
// src/app/api/webhooks/stripe/route.ts
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature')!
  const body = await request.text()

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'payment_intent.succeeded':
        // Mettre à jour le bilan comme payé
        break
      case 'payment_intent.payment_failed':
        // Notifier l'échec du paiement
        break
    }

    return new Response(JSON.stringify({ received: true }))
  } catch (err) {
    return new Response('Webhook Error', { status: 400 })
  }
}
```

## 2. Google Calendar (Rendez-vous)

### Configuration

**Variables d'environnement** :
```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Fonctionnalités

#### Créer un rendez-vous avec Google Meet

```typescript
import { createMeetEvent } from '@/services/calendar/google-calendar'

const result = await createMeetEvent('consultant@example.com', {
  summary: 'Entretien Phase 1 - Jean Dupont',
  description: 'Premier entretien du bilan de compétences',
  start: new Date('2025-10-20T10:00:00'),
  end: new Date('2025-10-20T11:30:00'),
  attendees: [
    'beneficiaire@example.com',
    'consultant@example.com',
  ],
})

console.log('Event ID:', result.eventId)
console.log('Meet Link:', result.meetLink)
```

#### Vérifier les disponibilités

```typescript
import { getAvailability } from '@/services/calendar/google-calendar'

const availability = await getAvailability(
  'consultant@example.com',
  new Date('2025-10-20')
)

// Afficher les créneaux disponibles
availability.slots
  .filter(slot => slot.available)
  .forEach(slot => {
    console.log(`${slot.start.toLocaleTimeString()} - ${slot.end.toLocaleTimeString()}`)
  })
```

#### Mettre à jour un rendez-vous

```typescript
import { updateEvent } from '@/services/calendar/google-calendar'

await updateEvent('consultant@example.com', 'event_id', {
  start: new Date('2025-10-21T14:00:00'),
  end: new Date('2025-10-21T15:30:00'),
})
```

#### Annuler un rendez-vous

```typescript
import { deleteEvent } from '@/services/calendar/google-calendar'

await deleteEvent('consultant@example.com', 'event_id')
```

### Configuration du Service Account

1. Créer un projet Google Cloud
2. Activer Google Calendar API
3. Créer un Service Account
4. Télécharger la clé JSON
5. Partager les calendriers avec le Service Account
6. Ajouter les credentials dans `.env.local`

## 3. Intégrations à Venir

### Pennylane (Facturation)

**Fonctionnalités prévues** :
- Génération automatique de factures
- Synchronisation des paiements Stripe
- Export comptable
- Gestion des devis

**Variables d'environnement** :
```bash
PENNYLANE_API_KEY=...
PENNYLANE_COMPANY_ID=...
```

### Wedof (Gestion administrative)

**Fonctionnalités prévues** :
- Synchronisation des dossiers
- Export des données Qualiopi
- Gestion documentaire
- Suivi administratif

**Variables d'environnement** :
```bash
WEDOF_API_KEY=...
WEDOF_API_URL=https://api.wedof.fr
```

## API Routes Disponibles

### Paiements

**POST** `/api/payments/create-checkout`
```json
{
  "bilanId": "bilan_123",
  "userId": "user_456",
  "formule": "standard"
}
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/..."
  }
}
```

### Calendrier

**POST** `/api/calendar/create-event`
```json
{
  "calendarId": "consultant@example.com",
  "event": {
    "summary": "Entretien Phase 1",
    "start": "2025-10-20T10:00:00Z",
    "end": "2025-10-20T11:30:00Z",
    "attendees": ["beneficiaire@example.com"]
  }
}
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "eventId": "event_123",
    "meetLink": "https://meet.google.com/..."
  }
}
```

## Sécurité

### Stripe

- ✅ Clés API en variables d'environnement
- ✅ Validation webhook avec signature
- ✅ HTTPS obligatoire en production
- ✅ PCI DSS compliance (géré par Stripe)

### Google Calendar

- ✅ Service Account avec permissions limitées
- ✅ OAuth 2.0 pour accès utilisateur (optionnel)
- ✅ Clés privées sécurisées
- ✅ Partage de calendrier explicite

## Monitoring

### Stripe Dashboard

- Suivi des paiements en temps réel
- Alertes sur les échecs
- Rapports financiers
- Gestion des litiges

### Google Cloud Console

- Quotas API Calendar
- Logs d'utilisation
- Alertes de dépassement
- Métriques de performance

## Tests

### Stripe (Mode Test)

```bash
# Cartes de test
4242 4242 4242 4242  # Succès
4000 0000 0000 0002  # Échec
4000 0025 0000 3155  # 3D Secure requis
```

### Google Calendar (Sandbox)

- Utiliser un calendrier de test
- Service Account dédié au développement
- Pas d'envoi d'emails en dev

## Support

- **Stripe** : https://stripe.com/docs
- **Google Calendar API** : https://developers.google.com/calendar
- **Issues GitHub** : Pour bugs et suggestions

