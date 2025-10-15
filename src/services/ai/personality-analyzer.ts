import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null

export interface PersonalityAnalysis {
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

export interface TestResults {
  mbti?: {
    type: string
    dimensions: {
      EI: number // Extraversion vs Introversion
      SN: number // Sensation vs Intuition
      TF: number // Thinking vs Feeling
      JP: number // Judging vs Perceiving
    }
  }
  riasec?: {
    codes: string[]
    scores: {
      R: number // Réaliste
      I: number // Investigateur
      A: number // Artistique
      S: number // Social
      E: number // Entreprenant
      C: number // Conventionnel
    }
  }
  valeurs?: string[]
  motivations?: string[]
}

export async function analyzePersonality(
  testResults: TestResults,
  additionalContext?: string
): Promise<PersonalityAnalysis> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }
  
  const prompt = `Tu es un psychologue du travail expert. Analyse les résultats de tests suivants:

${testResults.mbti ? `MBTI: Type ${testResults.mbti.type}
Dimensions: ${JSON.stringify(testResults.mbti.dimensions)}` : ''}

${testResults.riasec ? `RIASEC: Codes ${testResults.riasec.codes.join('-')}
Scores: ${JSON.stringify(testResults.riasec.scores)}` : ''}

${testResults.valeurs ? `Valeurs: ${testResults.valeurs.join(', ')}` : ''}

${testResults.motivations ? `Motivations: ${testResults.motivations.join(', ')}` : ''}

${additionalContext ? `Contexte additionnel: ${additionalContext}` : ''}

Fournis une analyse complète avec:
1. Top 5 traits de personnalité principaux (avec score 0-100 et description)
2. Styles de travail préférés (avec score d'adéquation 0-100)
3. Environnement de travail optimal (taille entreprise, culture, niveau autonomie, mode collaboration)
4. Top 10 soft skills identifiées (avec niveau et exemples concrets)
5. 3-5 axes de développement prioritaires
6. Synthèse globale de la personnalité professionnelle (5-6 lignes)

Réponds UNIQUEMENT avec un objet JSON valide.`

  try {
    const response = await openai!.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un psychologue du travail expert. Tu réponds toujours en JSON valide avec des analyses précises et bienveillantes.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error('No content in AI response')
    }

    return JSON.parse(content)
  } catch (error) {
    console.error('Error analyzing personality:', error)
    throw new Error('Failed to analyze personality')
  }
}

export async function generateDevelopmentPlan(
  personalityAnalysis: PersonalityAnalysis,
  targetJob?: string
): Promise<{
  objectifs: {
    titre: string
    description: string
    priorite: 'haute' | 'moyenne' | 'basse'
    duree: string
  }[]
  actions: {
    action: string
    ressources: string[]
    echeance: string
  }[]
  formations: {
    titre: string
    type: 'certifiante' | 'diplomante' | 'courte'
    duree: string
    benefices: string[]
  }[]
  synthesePlan: string
}> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }
  
  const prompt = `Tu es un coach professionnel expert. Crée un plan de développement personnalisé.

Analyse de personnalité:
${JSON.stringify(personalityAnalysis, null, 2)}

${targetJob ? `Métier cible: ${targetJob}` : ''}

Crée un plan de développement avec:
1. 3-5 objectifs SMART (avec priorité et durée estimée)
2. 5-10 actions concrètes (avec ressources et échéances)
3. 3-5 formations recommandées (avec type, durée et bénéfices)
4. Synthèse du plan (4-5 lignes)

Réponds UNIQUEMENT avec un objet JSON valide.`

  try {
    const response = await openai!.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un coach professionnel expert. Tu réponds toujours en JSON valide avec des plans d\'action concrets et réalisables.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error('No content in AI response')
    }

    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating development plan:', error)
    throw new Error('Failed to generate development plan')
  }
}

