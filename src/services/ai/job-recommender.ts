import { geminiClient } from '@/lib/ai/gemini-client';

export interface JobRecommendation {
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
}

export interface RecommendationInput {
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

export async function getJobRecommendations(
  input: RecommendationInput
): Promise<JobRecommendation[]> {
  const prompt = `Tu es un expert en orientation professionnelle et en marché de l'emploi français. 

Profil du bénéficiaire:
- Compétences: ${input.competences.join(', ')}
- Expérience: ${input.experience.annees} ans dans les secteurs ${input.experience.secteurs.join(', ')}
- Postes occupés: ${input.experience.postes.join(', ')}
- Centres d'intérêt: ${input.interets.join(', ')}
- Valeurs professionnelles: ${input.valeurs.join(', ')}
${input.contraintes ? `- Contraintes: ${JSON.stringify(input.contraintes)}` : ''}

Recommande 5 métiers pertinents avec:
1. Titre du métier
2. Description détaillée (3-4 lignes)
3. Compétences requises
4. Compétences à acquérir
5. Fourchette de salaire (en France, en euros annuels bruts)
6. Perspectives d'évolution
7. Score de correspondance (0-100)
8. 2-3 formations recommandées pour y accéder

Réponds UNIQUEMENT avec un tableau JSON d'objets métier, sans texte avant ou après.`;

  try {
    const result = await geminiClient.generateContent({
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en orientation professionnelle en France. Tu réponds toujours en JSON valide.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      maxTokens: 3000,
    });

    const content = result.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    // Extraire le JSON de la réponse
    const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.metiers || parsed.recommendations || parsed || [];
  } catch (error) {
    console.error('Error getting job recommendations:', error);
    throw new Error('Failed to get job recommendations');
  }
}

export async function analyzeJobMarket(jobTitle: string): Promise<{
  tendance: 'croissance' | 'stable' | 'declin'
  demande: 'forte' | 'moyenne' | 'faible'
  offresDisponibles: number
  salaireMoyen: number
  competencesCles: string[]
  secteursPrincipaux: string[]
  syntheseMarche: string
}> {
  const prompt = `Analyse le marché de l'emploi en France pour le métier: ${jobTitle}

Fournis une analyse avec:
1. Tendance du marché (croissance/stable/declin)
2. Niveau de demande (forte/moyenne/faible)
3. Estimation du nombre d'offres disponibles actuellement
4. Salaire moyen en France (en euros annuels bruts)
5. Top 5 compétences clés recherchées
6. Principaux secteurs qui recrutent
7. Synthèse du marché (3-4 lignes)

Réponds UNIQUEMENT avec un objet JSON valide.`;

  try {
    const result = await geminiClient.generateContent({
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert du marché de l\'emploi français. Tu réponds toujours en JSON valide.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 2048,
    });

    const content = result.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    // Extraire le JSON de la réponse
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error analyzing job market:', error);
    throw new Error('Failed to analyze job market');
  }
}

