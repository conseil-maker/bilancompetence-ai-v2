import { generateWithGemini } from './gemini-client';

// Importer les types des tests
import type { MBTIResult } from '../tests/mbti';
import type { DISCResult } from '../tests/disc';
import type { BigFiveResult } from '../tests/bigfive';
import type { RIASECResult } from '../tests/riasec';

// ============================================================================
// TYPES
// ============================================================================

export interface ProfileAnalysis {
  coherenceScore: number; // 0-100
  coherenceDetails: {
    mbtiVsBigFive: number;
    discVsMBTI: number;
    riasecVsCompetences: number;
  };
  talentsCache: string[];
  metiersRecommandes: MetierRecommendation[];
  formationsRecommandees: FormationRecommendation[];
  axesDeveloppement: string[];
  planAction: ActionPlan;
  syntheseIA: string;
}

export interface MetierRecommendation {
  nom: string;
  score: number; // 0-100
  raisons: string[];
  competencesMatchees: string[];
  competencesADevelopper: string[];
  salaireMoyen?: string;
  perspectives?: string;
}

export interface FormationRecommendation {
  nom: string;
  score: number;
  raison: string;
  competencesDeveloppees: string[];
  duree?: string;
  financement?: string[];
  certification?: boolean;
}

export interface ActionPlan {
  actionsImmediates: Action[];
  actionsCourtTerme: Action[];
  actionsMoyenTerme: Action[];
}

export interface Action {
  titre: string;
  description: string;
  priorite: 'HAUTE' | 'MOYENNE' | 'BASSE';
  ressources?: string[];
}

// ============================================================================
// MOTEUR D'ANALYSE
// ============================================================================

export class AnalysisEngine {
  /**
   * Analyser le profil complet du bénéficiaire
   */
  async analyzeProfile(data: {
    mbti?: MBTIResult;
    disc?: DISCResult;
    bigFive?: BigFiveResult;
    riasec?: RIASECResult;
    competences?: string[];
    objectifs?: string[];
  }): Promise<ProfileAnalysis> {
    // 1. Analyser la cohérence
    const coherence = this.analyzeCoherence(data);

    // 2. Identifier les talents cachés
    const talents = this.identifyHiddenTalents(data);

    // 3. Recommander des métiers
    const metiers = await this.recommendJobs(data);

    // 4. Recommander des formations
    const formations = this.recommendFormations(data, metiers);

    // 5. Identifier les axes de développement
    const axes = this.identifyDevelopmentAreas(data);

    // 6. Créer un plan d'action
    const plan = this.createActionPlan(data, metiers, axes);

    // 7. Générer une synthèse IA
    const synthese = await this.generateAISynthesis(data, {
      coherence,
      talents,
      metiers,
    });

    return {
      coherenceScore: coherence.global,
      coherenceDetails: coherence.details,
      talentsCache: talents,
      metiersRecommandes: metiers,
      formationsRecommandees: formations,
      axesDeveloppement: axes,
      planAction: plan,
      syntheseIA: synthese,
    };
  }

  /**
   * Analyser la cohérence entre les différents tests
   */
  private analyzeCoherence(data: any): {
    global: number;
    details: {
      mbtiVsBigFive: number;
      discVsMBTI: number;
      riasecVsCompetences: number;
    };
  } {
    let mbtiVsBigFive = 50;
    let discVsMBTI = 50;
    let riasecVsCompetences = 50;

    // Comparer MBTI vs Big Five (Extraversion)
    if (data.mbti && data.bigFive) {
      const mbtiE = data.mbti.dimensions.EI === 'E' ? 75 : 25;
      const bigFiveE = data.bigFive.dimensions.extraversion.score;
      mbtiVsBigFive = 100 - Math.abs(mbtiE - bigFiveE);
    }

    // Comparer DISC vs MBTI
    if (data.disc && data.mbti) {
      // Dominance élevé = Thinking (T)
      const discD = data.disc.dimensions.dominance;
      const mbtiT = data.mbti.dimensions.TF === 'T' ? 75 : 25;
      discVsMBTI = 100 - Math.abs(discD - mbtiT);
    }

    // Comparer RIASEC vs Compétences
    if (data.riasec && data.competences) {
      // Vérifier si les compétences correspondent aux intérêts
      riasecVsCompetences = 70; // Par défaut
    }

    const global = Math.round((mbtiVsBigFive + discVsMBTI + riasecVsCompetences) / 3);

    return {
      global,
      details: {
        mbtiVsBigFive: Math.round(mbtiVsBigFive),
        discVsMBTI: Math.round(discVsMBTI),
        riasecVsCompetences: Math.round(riasecVsCompetences),
      },
    };
  }

  /**
   * Identifier les talents cachés
   */
  private identifyHiddenTalents(data: any): string[] {
    const talents: string[] = [];

    if (data.bigFive) {
      const { openness, conscientiousness, agreeableness, neuroticism, extraversion } =
        data.bigFive.dimensions;

      // Créativité structurée
      if (openness.score > 70 && conscientiousness.score > 70) {
        talents.push('Créativité structurée - Capacité à innover tout en restant organisé');
      }

      // Empathie profonde
      if (agreeableness.score > 70 && neuroticism.score < 40) {
        talents.push('Empathie profonde - Comprendre les autres sans se laisser submerger');
      }

      // Pensée profonde
      if (extraversion.score < 40 && openness.score > 70) {
        talents.push('Pensée profonde - Réflexion approfondie et analyse complexe');
      }
    }

    if (data.mbti) {
      // Vision stratégique
      if (data.mbti.type === 'INTJ') {
        talents.push('Vision stratégique - Planification à long terme et anticipation');
      }
    }

    if (data.riasec) {
      // Innovation scientifique
      if (data.riasec.dimensions.investigative > 70 && data.riasec.dimensions.artistic > 70) {
        talents.push('Innovation scientifique - Allier recherche et créativité');
      }
    }

    return talents;
  }

  /**
   * Recommander des métiers
   */
  private async recommendJobs(data: any): Promise<MetierRecommendation[]> {
    // Base de données de métiers (à étendre)
    const metiers = [
      {
        nom: 'Développeur Full Stack',
        mbtiMatch: ['INTJ', 'INTP', 'ISTJ', 'ISTP'],
        riasecMatch: ['I', 'R'],
        competences: ['Programmation', 'Logique', 'Résolution de problèmes'],
        salaireMoyen: '45-65K€',
        perspectives: 'Excellentes',
      },
      {
        nom: 'Chef de Projet',
        mbtiMatch: ['ENTJ', 'ESTJ', 'ENFJ', 'ESFJ'],
        riasecMatch: ['E', 'S'],
        competences: ['Leadership', 'Organisation', 'Communication'],
        salaireMoyen: '50-70K€',
        perspectives: 'Très bonnes',
      },
      {
        nom: 'Designer UX/UI',
        mbtiMatch: ['INFP', 'ENFP', 'ISFP', 'ESFP'],
        riasecMatch: ['A', 'I'],
        competences: ['Créativité', 'Empathie', 'Design'],
        salaireMoyen: '40-60K€',
        perspectives: 'Bonnes',
      },
      {
        nom: 'Commercial B2B',
        mbtiMatch: ['ESTP', 'ENTP', 'ESFP', 'ENFP'],
        riasecMatch: ['E', 'S'],
        competences: ['Communication', 'Persuasion', 'Négociation'],
        salaireMoyen: '40-80K€ (variable)',
        perspectives: 'Excellentes',
      },
      {
        nom: 'Psychologue du Travail',
        mbtiMatch: ['INFJ', 'ENFJ', 'INFP', 'ENFP'],
        riasecMatch: ['S', 'I'],
        competences: ['Empathie', 'Écoute', 'Analyse'],
        salaireMoyen: '35-50K€',
        perspectives: 'Bonnes',
      },
      {
        nom: 'Data Analyst',
        mbtiMatch: ['INTJ', 'INTP', 'ISTJ', 'ENTJ'],
        riasecMatch: ['I', 'C'],
        competences: ['Analyse', 'Statistiques', 'Logique'],
        salaireMoyen: '45-65K€',
        perspectives: 'Excellentes',
      },
      {
        nom: 'Formateur',
        mbtiMatch: ['ENFJ', 'ESFJ', 'ENFP', 'ESFP'],
        riasecMatch: ['S', 'A'],
        competences: ['Pédagogie', 'Communication', 'Patience'],
        salaireMoyen: '30-45K€',
        perspectives: 'Bonnes',
      },
      {
        nom: 'Consultant',
        mbtiMatch: ['ENTJ', 'ENTP', 'INTJ', 'INTP'],
        riasecMatch: ['E', 'I'],
        competences: ['Analyse', 'Conseil', 'Communication'],
        salaireMoyen: '50-80K€',
        perspectives: 'Très bonnes',
      },
      {
        nom: 'Infirmier',
        mbtiMatch: ['ISFJ', 'ESFJ', 'INFJ', 'ENFJ'],
        riasecMatch: ['S', 'R'],
        competences: ['Empathie', 'Soin', 'Organisation'],
        salaireMoyen: '28-38K€',
        perspectives: 'Excellentes',
      },
      {
        nom: 'Entrepreneur',
        mbtiMatch: ['ENTJ', 'ENTP', 'ESTP', 'ENFP'],
        riasecMatch: ['E', 'A'],
        competences: ['Leadership', 'Créativité', 'Prise de risque'],
        salaireMoyen: 'Variable',
        perspectives: 'Dépend du projet',
      },
    ];

    const recommendations: MetierRecommendation[] = [];

    for (const metier of metiers) {
      let score = 0;
      const raisons: string[] = [];
      const competencesMatchees: string[] = [];
      const competencesADevelopper: string[] = [];

      // Scoring MBTI (40%)
      if (data.mbti && metier.mbtiMatch.includes(data.mbti.type)) {
        score += 40;
        raisons.push(`Votre profil MBTI (${data.mbti.type}) correspond bien à ce métier`);
      }

      // Scoring DISC (20%)
      if (data.disc) {
        score += 10; // Bonus par défaut
        raisons.push('Votre style comportemental est compatible');
      }

      // Scoring RIASEC (20%)
      if (data.riasec) {
        const topCodes = Object.entries(data.riasec.dimensions)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 2)
          .map(([code]) => code.toUpperCase()[0]);

        const match = metier.riasecMatch.some((code) => topCodes.includes(code));
        if (match) {
          score += 20;
          raisons.push('Vos intérêts professionnels correspondent');
        }
      }

      // Scoring Big Five (20%)
      if (data.bigFive) {
        score += 10; // Bonus par défaut
      }

      // Compétences
      if (data.competences) {
        const matched = metier.competences.filter((c) =>
          data.competences.some((dc: string) => dc.toLowerCase().includes(c.toLowerCase()))
        );
        competencesMatchees.push(...matched);
        competencesADevelopper.push(
          ...metier.competences.filter((c) => !matched.includes(c))
        );
      }

      // Ne garder que les métiers avec un score >= 50
      if (score >= 50) {
        recommendations.push({
          nom: metier.nom,
          score,
          raisons,
          competencesMatchees,
          competencesADevelopper,
          salaireMoyen: metier.salaireMoyen,
          perspectives: metier.perspectives,
        });
      }
    }

    // Trier par score décroissant
    recommendations.sort((a, b) => b.score - a.score);

    // Retourner le top 10
    return recommendations.slice(0, 10);
  }

  /**
   * Recommander des formations
   */
  private recommendFormations(
    data: any,
    metiers: MetierRecommendation[]
  ): FormationRecommendation[] {
    const formations: FormationRecommendation[] = [];

    // Identifier les compétences à développer
    const competencesADevelopper = new Set<string>();
    metiers.slice(0, 3).forEach((metier) => {
      metier.competencesADevelopper.forEach((c) => competencesADevelopper.add(c));
    });

    // Recommander des formations basées sur les compétences
    competencesADevelopper.forEach((competence) => {
      formations.push({
        nom: `Formation ${competence}`,
        score: 80,
        raison: `Développer la compétence "${competence}" pour les métiers recommandés`,
        competencesDeveloppees: [competence],
        duree: '3-6 mois',
        financement: ['CPF', 'Pôle Emploi', 'OPCO'],
        certification: true,
      });
    });

    return formations.slice(0, 5);
  }

  /**
   * Identifier les axes de développement
   */
  private identifyDevelopmentAreas(data: any): string[] {
    const axes: string[] = [];

    if (data.bigFive) {
      const { conscientiousness, extraversion, neuroticism } = data.bigFive.dimensions;

      if (conscientiousness.score < 50) {
        axes.push('Organisation et planification');
      }
      if (extraversion.score < 40) {
        axes.push('Aisance sociale et networking');
      }
      if (neuroticism.score > 60) {
        axes.push('Gestion du stress et des émotions');
      }
    }

    return axes;
  }

  /**
   * Créer un plan d'action
   */
  private createActionPlan(
    data: any,
    metiers: MetierRecommendation[],
    axes: string[]
  ): ActionPlan {
    const actionsImmediates: Action[] = [
      {
        titre: 'Finaliser le document de synthèse',
        description: 'Relire et valider le document de synthèse du bilan',
        priorite: 'HAUTE',
        ressources: ['Document de synthèse'],
      },
    ];

    const actionsCourtTerme: Action[] = [];
    const actionsMoyenTerme: Action[] = [];

    // Actions basées sur les métiers recommandés
    if (metiers.length > 0) {
      actionsCourtTerme.push({
        titre: `Explorer le métier de ${metiers[0].nom}`,
        description: 'Rencontrer des professionnels, faire des recherches approfondies',
        priorite: 'HAUTE',
        ressources: ['LinkedIn', 'Pôle Emploi', 'Salons professionnels'],
      });
    }

    // Actions basées sur les axes de développement
    axes.forEach((axe) => {
      actionsMoyenTerme.push({
        titre: `Développer : ${axe}`,
        description: `Suivre une formation ou un coaching sur ${axe}`,
        priorite: 'MOYENNE',
        ressources: ['Formations CPF', 'Coaching', 'Livres spécialisés'],
      });
    });

    return {
      actionsImmediates,
      actionsCourtTerme,
      actionsMoyenTerme,
    };
  }

  /**
   * Générer une synthèse IA du profil
   */
  private async generateAISynthesis(
    data: any,
    analysis: {
      coherence: any;
      talents: string[];
      metiers: MetierRecommendation[];
    }
  ): Promise<string> {
    const prompt = `Tu es un consultant expert en bilan de compétences. Génère une synthèse professionnelle et bienveillante du profil suivant (300-400 mots).

Profil MBTI: ${data.mbti?.type || 'Non renseigné'}
Profil DISC: D${data.disc?.dimensions.dominance || 0} I${data.disc?.dimensions.influence || 0} S${data.disc?.dimensions.stabilite || 0} C${data.disc?.dimensions.conformite || 0}
Big Five: O${data.bigFive?.dimensions.openness.score || 0} C${data.bigFive?.dimensions.conscientiousness.score || 0} E${data.bigFive?.dimensions.extraversion.score || 0} A${data.bigFive?.dimensions.agreeableness.score || 0} N${data.bigFive?.dimensions.neuroticism.score || 0}
Code Holland (RIASEC): ${data.riasec?.hollandCode || 'Non renseigné'}

Cohérence globale: ${analysis.coherence.global}%
Talents identifiés: ${analysis.talents.join(', ') || 'Aucun'}
Top 3 métiers recommandés: ${analysis.metiers.slice(0, 3).map((m) => m.nom).join(', ')}

La synthèse doit:
- Être professionnelle et bienveillante
- Mettre en avant les traits dominants de personnalité
- Souligner les talents et points forts
- Orienter vers les métiers recommandés
- Encourager et motiver

Ne mentionne PAS les scores numériques dans la synthèse.`;

    try {
      const synthese = await generateWithGemini(prompt, {
        temperature: 0.7,
        maxTokens: 600,
      });

      return synthese;
    } catch (error) {
      console.error('Erreur génération synthèse:', error);
      return 'Synthèse non disponible pour le moment.';
    }
  }
}

// Instance par défaut
export const analysisEngine = new AnalysisEngine();

