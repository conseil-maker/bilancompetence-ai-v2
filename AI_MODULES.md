# Modules d'Intelligence Artificielle

## Vue d'ensemble

La plateforme BilanCompetence.AI intègre plusieurs modules d'IA pour enrichir l'accompagnement des bénéficiaires et optimiser le travail des consultants.

## Architecture

```
src/
├── services/ai/              # Services IA
│   ├── cv-analyzer.ts       # Analyse de CV
│   ├── job-recommender.ts   # Recommandations métiers
│   └── personality-analyzer.ts # Analyse personnalité
└── app/api/ai/              # API Routes
    ├── analyze-cv/
    ├── job-recommendations/
    └── analyze-personality/
```

## Modules Disponibles

### 1. Analyse de CV (CV Analyzer)

**Fonctionnalité** : Extraction et analyse automatique des CV

**Endpoint** : `POST /api/ai/analyze-cv`

**Input** :
- Fichier CV (PDF, Word, ou texte)

**Output** :
```typescript
{
  competences: {
    techniques: string[]
    transversales: string[]
    linguistiques: string[]
  }
  experience: {
    annees: number
    secteurs: string[]
    postes: string[]
    niveauSeniorite: 'junior' | 'confirme' | 'senior' | 'expert'
  }
  formation: {
    niveauEtudes: string
    diplomes: string[]
    domaines: string[]
  }
  forces: string[]
  axesAmelioration: string[]
  metiersRecommandes: {
    titre: string
    correspondance: number
    raison: string
  }[]
  syntheseIA: string
}
```

**Utilisation** :
```typescript
const formData = new FormData()
formData.append('cv', file)

const response = await fetch('/api/ai/analyze-cv', {
  method: 'POST',
  body: formData,
})

const { data } = await response.json()
```

### 2. Recommandations Métiers (Job Recommender)

**Fonctionnalité** : Recommandations de métiers personnalisées basées sur le profil

**Endpoint** : `POST /api/ai/job-recommendations`

**Input** :
```typescript
{
  competences: string[]
  experience: {
    annees: number
    secteurs: string[]
    postes: string[]
  }
  interets: string[]
  valeurs: string[]
  contraintes?: {
    mobilite?: string
    salaire?: number
    tempsPlein?: boolean
  }
}
```

**Output** :
```typescript
{
  titre: string
  description: string
  competencesRequises: string[]
  competencesAcquerir: string[]
  salaireEstime: {
    min: number
    max: number
  }
  perspectives: string
  correspondance: number
  formations: {
    titre: string
    duree: string
    organisme: string
  }[]
}[]
```

**Utilisation** :
```typescript
const response = await fetch('/api/ai/job-recommendations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    competences: ['React', 'Node.js', 'Gestion de projet'],
    experience: {
      annees: 5,
      secteurs: ['Tech', 'Digital'],
      postes: ['Développeur', 'Chef de projet']
    },
    interets: ['Innovation', 'Management'],
    valeurs: ['Autonomie', 'Impact']
  })
})

const { data } = await response.json()
```

### 3. Analyse de Personnalité (Personality Analyzer)

**Fonctionnalité** : Analyse approfondie de la personnalité professionnelle

**Endpoint** : `POST /api/ai/analyze-personality`

**Input** :
```typescript
{
  testResults: {
    mbti?: {
      type: string
      dimensions: {
        EI: number
        SN: number
        TF: number
        JP: number
      }
    }
    riasec?: {
      codes: string[]
      scores: {
        R: number
        I: number
        A: number
        S: number
        E: number
        C: number
      }
    }
    valeurs?: string[]
    motivations?: string[]
  }
  additionalContext?: string
}
```

**Output** :
```typescript
{
  traitsPrincipaux: {
    trait: string
    score: number
    description: string
  }[]
  stylesTravail: {
    style: string
    adequation: number
  }[]
  environnementOptimal: {
    taille: 'startup' | 'pme' | 'grand_groupe'
    culture: string[]
    autonomie: 'faible' | 'moyenne' | 'forte'
    collaboration: 'individuel' | 'mixte' | 'equipe'
  }
  softSkills: {
    competence: string
    niveau: 'debutant' | 'intermediaire' | 'avance' | 'expert'
    exemples: string[]
  }[]
  axesDeveloppement: string[]
  synthesePersonnalite: string
}
```

## Modèle IA Utilisé

**Modèle** : `gpt-4.1-mini` (via OpenAI API)

**Avantages** :
- Haute qualité d'analyse
- Réponses structurées en JSON
- Compréhension contextuelle avancée
- Multilingue (français optimisé)

## Configuration

### Variables d'environnement

```bash
OPENAI_API_KEY=your_openai_api_key
```

### Installation des dépendances

```bash
pnpm add openai
```

## Bonnes Pratiques

### 1. Gestion des erreurs

Toujours wrapper les appels IA dans des try/catch :

```typescript
try {
  const analysis = await analyzeCV(cvText)
  // Traiter les résultats
} catch (error) {
  console.error('AI analysis failed:', error)
  // Fallback ou message d'erreur utilisateur
}
```

### 2. Validation des entrées

Valider les données avant envoi à l'IA :

```typescript
if (!cvText || cvText.length < 100) {
  throw new Error('CV text too short')
}
```

### 3. Optimisation des coûts

- Utiliser `gpt-4.1-mini` pour un bon rapport qualité/prix
- Limiter la longueur des prompts
- Mettre en cache les résultats fréquents

### 4. Température

- **0.7** : Équilibre créativité/précision (recommandations, analyses)
- **0.8** : Plus créatif (plans d'action, suggestions)
- **0.3** : Plus déterministe (extraction de données)

## Évolutions Futures

### Phase 1 (Court terme)
- [ ] Extraction PDF/Word réelle (pdf-parse, mammoth)
- [ ] Cache Redis pour résultats IA
- [ ] Rate limiting API

### Phase 2 (Moyen terme)
- [ ] Fine-tuning modèle sur données métiers français
- [ ] Analyse de marché en temps réel (API Pôle Emploi)
- [ ] Génération automatique de synthèses

### Phase 3 (Long terme)
- [ ] Chatbot IA pour accompagnement
- [ ] Prédiction de réussite professionnelle
- [ ] Matching automatique bénéficiaire-consultant

## Conformité et Éthique

### RGPD
- ✅ Données anonymisées avant envoi à l'IA
- ✅ Pas de stockage des prompts/réponses par défaut
- ✅ Consentement explicite pour analyse IA

### Transparence
- ✅ Indication claire "Analyse générée par IA"
- ✅ Validation humaine (consultant) obligatoire
- ✅ Possibilité de refuser l'analyse IA

### Biais
- ⚠️ Monitoring des recommandations pour détecter les biais
- ⚠️ Diversité des métiers recommandés
- ⚠️ Validation par experts métiers

## Support

Pour toute question sur les modules IA :
- Documentation OpenAI : https://platform.openai.com/docs
- Issues GitHub du projet
- Contact : dev@netz-informatique.fr

