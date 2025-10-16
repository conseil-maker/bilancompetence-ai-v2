import { geminiClient, generateWithGemini } from './gemini-client';

// ============================================================================
// TYPES
// ============================================================================

export interface QuestionContext {
  phase: 'PRELIMINAIRE' | 'INVESTIGATION' | 'CONCLUSION' | 'SUIVI';
  categorie: string;
  profil: {
    nom: string;
    prenom: string;
    age?: number;
    situation?: string;
    secteurActivite?: string;
    niveauEtudes?: string;
    experienceAnnees?: number;
  };
  objectifs: string[];
  reponsesPrecedentes?: Array<{
    question: string;
    reponse: string;
  }>;
  contexteSupplementaire?: string;
}

export interface Question {
  id: string;
  texte: string;
  type: 'OUVERTE' | 'FERMEE' | 'ECHELLE' | 'CHOIX_MULTIPLE';
  categorie: string;
  sousCategorie?: string;
  optionsReponse?: string[];
  echelle?: {
    min: number;
    max: number;
    labelMin: string;
    labelMax: string;
  };
  guidanceReponse?: string;
  questionsSuivantes?: {
    condition: string;
    questions: string[];
  }[];
}

// ============================================================================
// PROMPTS SYSTÈME PAR PHASE
// ============================================================================

const SYSTEM_PROMPTS = {
  PRELIMINAIRE: `Tu es un consultant expert en bilan de compétences. Tu dois générer des questions pour la phase préliminaire.

Objectifs de cette phase:
- Comprendre les motivations du bénéficiaire
- Identifier ses attentes
- Clarifier son contexte professionnel et personnel
- Définir les objectifs du bilan

Les questions doivent être:
- Ouvertes et bienveillantes
- Adaptées au profil du bénéficiaire
- Progressives (du général au spécifique)
- Orientées vers l'action

Format de réponse attendu (JSON):
{
  "texte": "La question à poser",
  "type": "OUVERTE" | "FERMEE" | "ECHELLE" | "CHOIX_MULTIPLE",
  "categorie": "Catégorie de la question",
  "sousCategorie": "Sous-catégorie (optionnel)",
  "optionsReponse": ["Option 1", "Option 2"] (si CHOIX_MULTIPLE),
  "echelle": { "min": 1, "max": 10, "labelMin": "Pas du tout", "labelMax": "Totalement" } (si ECHELLE),
  "guidanceReponse": "Conseils pour répondre"
}`,

  INVESTIGATION: `Tu es un consultant expert en bilan de compétences. Tu dois générer des questions pour la phase d'investigation.

Objectifs de cette phase:
- Explorer en profondeur les compétences
- Analyser les expériences professionnelles
- Identifier les talents et aptitudes
- Découvrir les motivations profondes

Les questions doivent être:
- Précises et ciblées
- Basées sur les réponses précédentes
- Orientées vers l'analyse
- Permettant l'auto-réflexion

Format de réponse attendu (JSON): identique à la phase préliminaire.`,

  CONCLUSION: `Tu es un consultant expert en bilan de compétences. Tu dois générer des questions pour la phase de conclusion.

Objectifs de cette phase:
- Valider le projet professionnel
- Identifier les actions concrètes
- Anticiper les obstacles
- Planifier la mise en œuvre

Les questions doivent être:
- Orientées vers l'action
- Pragmatiques et concrètes
- Permettant la projection
- Facilitant la prise de décision

Format de réponse attendu (JSON): identique aux phases précédentes.`,

  SUIVI: `Tu es un consultant expert en bilan de compétences. Tu dois générer des questions pour le suivi à 6 mois.

Objectifs de cette phase:
- Évaluer la mise en œuvre du projet
- Identifier les réussites et difficultés
- Ajuster le plan d'action si nécessaire
- Mesurer l'impact du bilan

Les questions doivent être:
- Rétrospectives et évaluatives
- Bienveillantes et encourageantes
- Permettant le bilan
- Orientées vers l'amélioration continue

Format de réponse attendu (JSON): identique aux phases précédentes.`,
};

// ============================================================================
// GÉNÉRATEUR DE QUESTIONS
// ============================================================================

export class QuestionGenerator {
  /**
   * Générer une question personnalisée
   */
  async generateQuestion(context: QuestionContext): Promise<Question> {
    const systemPrompt = SYSTEM_PROMPTS[context.phase];
    
    const userPrompt = this.buildUserPrompt(context);

    try {
      const result = await geminiClient.generateContent({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        maxTokens: 500,
      });

      const questionData = this.parseQuestionResponse(result.content);
      
      return {
        id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...questionData,
      };
    } catch (error) {
      console.error('Erreur génération question:', error);
      throw new Error('Impossible de générer la question');
    }
  }

  /**
   * Générer une question de suivi basée sur une réponse
   */
  async generateFollowUpQuestion(
    context: QuestionContext,
    previousQuestion: string,
    previousAnswer: string
  ): Promise<Question | null> {
    // 30% de chance de générer une question de suivi
    if (Math.random() > 0.3) {
      return null;
    }

    const systemPrompt = `Tu es un consultant expert. Génère une question de suivi pertinente basée sur la réponse précédente.
    
La question de suivi doit:
- Approfondir la réponse donnée
- Explorer un aspect non abordé
- Clarifier un point ambigu
- Être courte et précise

Format JSON attendu: identique aux questions principales.`;

    const userPrompt = `Question précédente: "${previousQuestion}"
Réponse: "${previousAnswer}"

Profil: ${context.profil.prenom} ${context.profil.nom}
Contexte: ${context.contexteSupplementaire || 'Aucun contexte supplémentaire'}

Génère une question de suivi pertinente.`;

    try {
      const result = await geminiClient.generateContent({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        maxTokens: 300,
      });

      const questionData = this.parseQuestionResponse(result.content);
      
      return {
        id: `q_followup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...questionData,
      };
    } catch (error) {
      console.error('Erreur génération question de suivi:', error);
      return null;
    }
  }

  /**
   * Construire le prompt utilisateur
   */
  private buildUserPrompt(context: QuestionContext): string {
    let prompt = `Génère une question pour la phase ${context.phase}.

Profil du bénéficiaire:
- Nom: ${context.profil.prenom} ${context.profil.nom}`;

    if (context.profil.age) {
      prompt += `\n- Âge: ${context.profil.age} ans`;
    }
    if (context.profil.situation) {
      prompt += `\n- Situation: ${context.profil.situation}`;
    }
    if (context.profil.secteurActivite) {
      prompt += `\n- Secteur: ${context.profil.secteurActivite}`;
    }
    if (context.profil.niveauEtudes) {
      prompt += `\n- Niveau d'études: ${context.profil.niveauEtudes}`;
    }
    if (context.profil.experienceAnnees) {
      prompt += `\n- Expérience: ${context.profil.experienceAnnees} ans`;
    }

    prompt += `\n\nObjectifs du bilan:`;
    context.objectifs.forEach((obj, i) => {
      prompt += `\n${i + 1}. ${obj}`;
    });

    if (context.reponsesPrecedentes && context.reponsesPrecedentes.length > 0) {
      prompt += `\n\nRéponses précédentes (pour adapter la question):`;
      context.reponsesPrecedentes.slice(-3).forEach((rp) => {
        prompt += `\nQ: ${rp.question}\nR: ${rp.reponse}\n`;
      });
    }

    if (context.contexteSupplementaire) {
      prompt += `\n\nContexte supplémentaire: ${context.contexteSupplementaire}`;
    }

    prompt += `\n\nCatégorie de question souhaitée: ${context.categorie}`;
    prompt += `\n\nGénère UNE question pertinente au format JSON.`;

    return prompt;
  }

  /**
   * Parser la réponse de Gemini
   */
  private parseQuestionResponse(response: string): Omit<Question, 'id'> {
    try {
      // Extraire le JSON de la réponse
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Pas de JSON trouvé dans la réponse');
      }

      const questionData = JSON.parse(jsonMatch[0]);

      return {
        texte: questionData.texte,
        type: questionData.type || 'OUVERTE',
        categorie: questionData.categorie || 'Général',
        sousCategorie: questionData.sousCategorie,
        optionsReponse: questionData.optionsReponse,
        echelle: questionData.echelle,
        guidanceReponse: questionData.guidanceReponse,
        questionsSuivantes: questionData.questionsSuivantes,
      };
    } catch (error) {
      console.error('Erreur parsing question:', error);
      // Question par défaut en cas d'erreur
      return {
        texte: 'Pouvez-vous nous en dire plus sur votre parcours professionnel ?',
        type: 'OUVERTE',
        categorie: 'Parcours',
      };
    }
  }
}

// Instance par défaut
export const questionGenerator = new QuestionGenerator();

