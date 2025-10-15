import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null

export interface CVAnalysisResult {
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

export async function analyzeCV(cvText: string): Promise<CVAnalysisResult> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }
  
  const prompt = `Tu es un expert en analyse de CV et en orientation professionnelle. Analyse le CV suivant et fournis une analyse détaillée au format JSON.

CV à analyser:
${cvText}

Fournis une analyse structurée avec:
1. Les compétences (techniques, transversales, linguistiques)
2. L'expérience professionnelle (années, secteurs, postes, niveau de séniorité)
3. La formation (niveau d'études, diplômes, domaines)
4. Les forces principales du profil
5. Les axes d'amélioration
6. 5 métiers recommandés avec score de correspondance (0-100) et raison
7. Une synthèse globale du profil

Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou après.`

  try {
    const response = await openai!.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en analyse de CV et orientation professionnelle. Tu réponds toujours en JSON valide.',
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

    const analysis = JSON.parse(content)
    return analysis as CVAnalysisResult
  } catch (error) {
    console.error('Error analyzing CV:', error)
    throw new Error('Failed to analyze CV')
  }
}

export async function extractCVText(file: File): Promise<string> {
  // Cette fonction devrait extraire le texte d'un PDF ou Word
  // Pour l'instant, on simule avec un placeholder
  // En production, utiliser pdf-parse ou mammoth pour l'extraction
  
  return `CV simulé pour démonstration
  
Nom: Jean Dupont
Email: jean.dupont@example.com
Téléphone: +33 6 12 34 56 78

EXPÉRIENCE PROFESSIONNELLE

Chef de Projet Digital - Entreprise XYZ (2020-2025)
- Gestion de projets web et mobile
- Coordination d'équipes de 5-10 personnes
- Budget annuel de 500K€
- Méthodologies Agile/Scrum

Développeur Full-Stack - Startup ABC (2017-2020)
- Développement React/Node.js
- Architecture microservices
- CI/CD avec GitLab

FORMATION

Master 2 Informatique - Université Paris (2017)
Licence Informatique - Université Lyon (2015)

COMPÉTENCES

Techniques: React, Node.js, Python, SQL, AWS, Docker
Gestion de projet: Agile, Scrum, Jira
Langues: Français (natif), Anglais (courant), Espagnol (intermédiaire)`
}

