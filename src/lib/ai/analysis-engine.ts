// ============================================================================
// MOTEUR D'ANALYSE IA - Analyse croisée des tests psychométriques
// ============================================================================

import { MBTIResultat } from '../tests/mbti';
import { DISCResultat } from '../tests/disc';
import { BigFiveResultat } from '../tests/bigfive';
import { RIASECResultat } from '../tests/riasec';

// ============================================================================
// TYPES
// ============================================================================

export interface ProfilComplet {
  mbti?: MBTIResultat;
  disc?: DISCResultat;
  bigFive?: BigFiveResultat;
  riasec?: RIASECResultat;
  competences?: CompetenceEvaluee[];
  experience?: ExperiencePro[];
}

export interface CompetenceEvaluee {
  nom: string;
  categorie: 'technique' | 'transversale' | 'soft_skill';
  niveau: number; // 1-5
  validee: boolean;
}

export interface ExperiencePro {
  poste: string;
  entreprise: string;
  duree: number; // en mois
  competences: string[];
}

export interface AnalyseComplete {
  synthese: string;
  coherence: {
    score: number; // 0-100
    points_forts: string[];
    contradictions: string[];
  };
  talents_caches: string[];
  recommandations_metiers: MetierRecommande[];
  recommandations_formations: FormationRecommandee[];
  axes_developpement: string[];
  plan_action: ActionRecommandee[];
}

export interface MetierRecommande {
  nom: string;
  code_rome?: string;
  score_compatibilite: number; // 0-100
  raisons: string[];
  competences_requises: string[];
  competences_a_developper: string[];
  salaire_moyen?: string;
  perspectives?: string;
}

export interface FormationRecommandee {
  titre: string;
  organisme?: string;
  duree?: string;
  niveau?: string;
  score_pertinence: number; // 0-100
  raisons: string[];
  financement_possible: string[];
}

export interface ActionRecommandee {
  titre: string;
  description: string;
  categorie: 'formation' | 'recherche' | 'reseau' | 'experience' | 'developpement';
  priorite: 'haute' | 'moyenne' | 'basse';
  echeance: string;
  ressources: string[];
}

// ============================================================================
// BASE DE DONNÉES DES MÉTIERS (Simplifié - À enrichir avec API ROME)
// ============================================================================

interface MetierReference {
  nom: string;
  code_rome: string;
  mbti_compatibles: string[];
  disc_compatibles: string[];
  riasec_compatibles: string[];
  big_five_requis: {
    O?: 'faible' | 'moyen' | 'eleve';
    C?: 'faible' | 'moyen' | 'eleve';
    E?: 'faible' | 'moyen' | 'eleve';
    A?: 'faible' | 'moyen' | 'eleve';
    N?: 'faible' | 'moyen' | 'eleve';
  };
  competences_cles: string[];
  salaire_moyen: string;
  perspectives: string;
}

const METIERS_REFERENCE: MetierReference[] = [
  {
    nom: "Développeur Full Stack",
    code_rome: "M1805",
    mbti_compatibles: ["INTJ", "INTP", "ISTJ", "ISTP"],
    disc_compatibles: ["C", "CS", "CD"],
    riasec_compatibles: ["I", "R", "C"],
    big_five_requis: { O: "eleve", C: "eleve", E: "faible" },
    competences_cles: ["Programmation", "Résolution de problèmes", "Logique"],
    salaire_moyen: "40-60k€",
    perspectives: "Excellentes (forte demande)"
  },
  {
    nom: "Chef de Projet",
    code_rome: "M1402",
    mbti_compatibles: ["ENTJ", "ESTJ", "ENFJ", "INTJ"],
    disc_compatibles: ["D", "DI", "DC"],
    riasec_compatibles: ["E", "C", "S"],
    big_five_requis: { C: "eleve", E: "eleve", A: "moyen" },
    competences_cles: ["Organisation", "Leadership", "Communication"],
    salaire_moyen: "45-70k€",
    perspectives: "Très bonnes"
  },
  {
    nom: "Designer UX/UI",
    code_rome: "E1205",
    mbti_compatibles: ["INFP", "ENFP", "INFJ", "ISFP"],
    disc_compatibles: ["I", "IS", "SI"],
    riasec_compatibles: ["A", "I", "S"],
    big_five_requis: { O: "eleve", A: "eleve", C: "moyen" },
    competences_cles: ["Créativité", "Empathie", "Design thinking"],
    salaire_moyen: "35-55k€",
    perspectives: "Bonnes"
  },
  {
    nom: "Commercial B2B",
    code_rome: "D1407",
    mbti_compatibles: ["ESTP", "ENTP", "ENFP", "ESFP"],
    disc_compatibles: ["I", "ID", "DI"],
    riasec_compatibles: ["E", "S", "A"],
    big_five_requis: { E: "eleve", A: "eleve", N: "faible" },
    competences_cles: ["Persuasion", "Négociation", "Relationnel"],
    salaire_moyen: "35-80k€ (variable)",
    perspectives: "Excellentes"
  },
  {
    nom: "Psychologue du Travail",
    code_rome: "K1104",
    mbti_compatibles: ["INFJ", "ENFJ", "INFP", "ENFP"],
    disc_compatibles: ["S", "SI", "SC"],
    riasec_compatibles: ["S", "I", "A"],
    big_five_requis: { A: "eleve", O: "eleve", E: "moyen" },
    competences_cles: ["Empathie", "Écoute active", "Analyse"],
    salaire_moyen: "30-45k€",
    perspectives: "Stables"
  },
  {
    nom: "Data Analyst",
    code_rome: "M1805",
    mbti_compatibles: ["INTJ", "INTP", "ISTJ", "ENTJ"],
    disc_compatibles: ["C", "CD", "CI"],
    riasec_compatibles: ["I", "C", "R"],
    big_five_requis: { O: "eleve", C: "eleve", E: "faible" },
    competences_cles: ["Statistiques", "Analyse", "Visualisation"],
    salaire_moyen: "40-65k€",
    perspectives: "Excellentes"
  },
  {
    nom: "Formateur Professionnel",
    code_rome: "K2111",
    mbti_compatibles: ["ENFJ", "ESFJ", "ENTJ", "INFJ"],
    disc_compatibles: ["I", "IS", "SI"],
    riasec_compatibles: ["S", "E", "A"],
    big_five_requis: { E: "eleve", A: "eleve", O: "moyen" },
    competences_cles: ["Pédagogie", "Communication", "Adaptabilité"],
    salaire_moyen: "28-45k€",
    perspectives: "Bonnes"
  },
  {
    nom: "Consultant en Organisation",
    code_rome: "M1402",
    mbti_compatibles: ["ENTJ", "INTJ", "ENTP", "INTP"],
    disc_compatibles: ["D", "DC", "DI"],
    riasec_compatibles: ["E", "I", "C"],
    big_five_requis: { O: "eleve", C: "eleve", E: "eleve" },
    competences_cles: ["Analyse", "Stratégie", "Communication"],
    salaire_moyen: "50-90k€",
    perspectives: "Très bonnes"
  },
  {
    nom: "Infirmier",
    code_rome: "J1506",
    mbti_compatibles: ["ISFJ", "ESFJ", "INFJ", "ENFJ"],
    disc_compatibles: ["S", "SC", "SI"],
    riasec_compatibles: ["S", "R", "C"],
    big_five_requis: { A: "eleve", C: "eleve", N: "faible" },
    competences_cles: ["Empathie", "Rigueur", "Résistance au stress"],
    salaire_moyen: "25-35k€",
    perspectives: "Excellentes (forte demande)"
  },
  {
    nom: "Entrepreneur / Créateur d'entreprise",
    code_rome: "M1302",
    mbti_compatibles: ["ENTP", "ENTJ", "ESTP", "ENFP"],
    disc_compatibles: ["D", "DI", "ID"],
    riasec_compatibles: ["E", "A", "I"],
    big_five_requis: { O: "eleve", E: "eleve", N: "faible" },
    competences_cles: ["Innovation", "Prise de risque", "Leadership"],
    salaire_moyen: "Variable",
    perspectives: "Dépend du projet"
  },
];

// ============================================================================
// MOTEUR D'ANALYSE PRINCIPAL
// ============================================================================

export class AnalysisEngine {
  
  /**
   * Analyse complète du profil avec tous les tests
   */
  async analyserProfilComplet(profil: ProfilComplet): Promise<AnalyseComplete> {
    // 1. Analyser la cohérence entre les tests
    const coherence = this.analyserCoherence(profil);
    
    // 2. Identifier les talents cachés
    const talents_caches = this.identifierTalentsCaches(profil);
    
    // 3. Recommander des métiers
    const recommandations_metiers = this.recommanderMetiers(profil);
    
    // 4. Recommander des formations
    const recommandations_formations = this.recommanderFormations(profil, recommandations_metiers);
    
    // 5. Identifier les axes de développement
    const axes_developpement = this.identifierAxesDeveloppement(profil);
    
    // 6. Créer un plan d'action
    const plan_action = this.creerPlanAction(profil, recommandations_metiers, axes_developpement);
    
    // 7. Générer une synthèse avec l'IA
    const synthese = await this.genererSyntheseIA(profil, {
      coherence,
      talents_caches,
      recommandations_metiers,
      axes_developpement
    });
    
    return {
      synthese,
      coherence,
      talents_caches,
      recommandations_metiers,
      recommandations_formations,
      axes_developpement,
      plan_action
    };
  }

  /**
   * Analyse la cohérence entre les différents tests
   */
  private analyserCoherence(profil: ProfilComplet): AnalyseComplete['coherence'] {
    const points_forts: string[] = [];
    const contradictions: string[] = [];
    let score_coherence = 100;

    // Cohérence MBTI + Big Five
    if (profil.mbti && profil.bigFive) {
      // Extraversion
      const mbti_extraverti = profil.mbti.type[0] === 'E';
      const bigfive_extraverti = profil.bigFive.scores.E.niveau === 'Élevé';
      
      if (mbti_extraverti === bigfive_extraverti) {
        points_forts.push("Cohérence forte entre MBTI et Big Five sur l'extraversion");
      } else {
        contradictions.push("Divergence entre MBTI et Big Five sur l'extraversion - À explorer en entretien");
        score_coherence -= 10;
      }
    }

    // Cohérence DISC + MBTI
    if (profil.disc && profil.mbti) {
      const disc_dominant = profil.disc.profil[0];
      const mbti_type = profil.mbti.type;
      
      // D (Dominance) devrait correspondre à E_TJ
      if (disc_dominant === 'D' && mbti_type.includes('E') && mbti_type.includes('T') && mbti_type.includes('J')) {
        points_forts.push("Cohérence entre DISC (Dominance) et MBTI (Leadership)");
      }
      
      // I (Influence) devrait correspondre à E_F_
      if (disc_dominant === 'I' && mbti_type.includes('E') && mbti_type.includes('F')) {
        points_forts.push("Cohérence entre DISC (Influence) et MBTI (Empathie)");
      }
    }

    // Cohérence RIASEC + Compétences
    if (profil.riasec && profil.competences) {
      const riasec_principal = profil.riasec.code[0];
      const competences_techniques = profil.competences.filter(c => c.categorie === 'technique');
      
      if (riasec_principal === 'R' && competences_techniques.length > 0) {
        points_forts.push("Cohérence entre profil Réaliste RIASEC et compétences techniques");
      }
    }

    // Si peu de points forts, c'est suspect
    if (points_forts.length === 0) {
      score_coherence -= 20;
      contradictions.push("Peu de cohérence détectée entre les tests - Profil atypique ou tests à refaire");
    }

    return {
      score: Math.max(0, score_coherence),
      points_forts,
      contradictions
    };
  }

  /**
   * Identifie les talents cachés (compétences non exploitées)
   */
  private identifierTalentsCaches(profil: ProfilComplet): string[] {
    const talents: string[] = [];

    // Talents basés sur Big Five
    if (profil.bigFive) {
      if (profil.bigFive.scores.O.niveau === 'Élevé' && profil.bigFive.scores.C.niveau === 'Élevé') {
        talents.push("Créativité structurée : Capacité à innover tout en restant organisé");
      }
      
      if (profil.bigFive.scores.A.niveau === 'Élevé' && profil.bigFive.scores.N.niveau === 'Élevé') {
        talents.push("Empathie profonde : Sensibilité émotionnelle qui peut être un atout en relation d'aide");
      }
      
      if (profil.bigFive.scores.E.niveau === 'Faible' && profil.bigFive.scores.O.niveau === 'Élevé') {
        talents.push("Pensée profonde : Capacité de réflexion introspective et créative");
      }
    }

    // Talents basés sur MBTI
    if (profil.mbti) {
      if (profil.mbti.type === 'INTJ') {
        talents.push("Vision stratégique : Capacité à voir les patterns et planifier à long terme");
      }
      if (profil.mbti.type === 'INFP') {
        talents.push("Authenticité créative : Capacité à créer du contenu profondément personnel et inspirant");
      }
    }

    // Talents basés sur RIASEC
    if (profil.riasec) {
      const code = profil.riasec.code;
      if (code.includes('I') && code.includes('A')) {
        talents.push("Innovation scientifique : Capacité à combiner rigueur analytique et créativité");
      }
      if (code.includes('E') && code.includes('S')) {
        talents.push("Leadership bienveillant : Capacité à diriger tout en prenant soin des personnes");
      }
    }

    return talents.length > 0 ? talents : ["Profil équilibré sans talent dominant particulier"];
  }

  /**
   * Recommande des métiers basés sur le profil complet
   */
  private recommanderMetiers(profil: ProfilComplet): MetierRecommande[] {
    const recommandations: MetierRecommande[] = [];

    METIERS_REFERENCE.forEach(metier => {
      let score = 0;
      const raisons: string[] = [];

      // Score MBTI (40 points max)
      if (profil.mbti && metier.mbti_compatibles.includes(profil.mbti.type)) {
        score += 40;
        raisons.push(`Votre profil MBTI ${profil.mbti.type} est très compatible`);
      } else if (profil.mbti) {
        score += 10; // Score partiel
      }

      // Score DISC (20 points max)
      if (profil.disc) {
        const disc_match = metier.disc_compatibles.some(d => profil.disc!.profil.includes(d));
        if (disc_match) {
          score += 20;
          raisons.push(`Votre style DISC ${profil.disc.profil} correspond bien`);
        }
      }

      // Score RIASEC (20 points max)
      if (profil.riasec) {
        const riasec_match = metier.riasec_compatibles.some(r => profil.riasec!.code.includes(r));
        if (riasec_match) {
          score += 20;
          raisons.push(`Vos intérêts RIASEC ${profil.riasec.code} sont alignés`);
        }
      }

      // Score Big Five (20 points max)
      if (profil.bigFive) {
        let bigfive_score = 0;
        let bigfive_matches = 0;
        
        Object.entries(metier.big_five_requis).forEach(([trait, niveau_requis]) => {
          const niveau_actuel = profil.bigFive!.scores[trait as keyof typeof profil.bigFive.scores].niveau.toLowerCase();
          if (niveau_actuel === niveau_requis) {
            bigfive_score += 4;
            bigfive_matches++;
          }
        });
        
        score += bigfive_score;
        if (bigfive_matches > 0) {
          raisons.push(`${bigfive_matches} traits de personnalité correspondent`);
        }
      }

      // Bonus compétences (bonus jusqu'à 10 points)
      if (profil.competences) {
        const competences_matchees = profil.competences.filter(c => 
          metier.competences_cles.some(ck => ck.toLowerCase().includes(c.nom.toLowerCase()))
        );
        const bonus = Math.min(10, competences_matchees.length * 3);
        score += bonus;
        if (bonus > 0) {
          raisons.push(`Vous possédez déjà ${competences_matchees.length} compétences clés`);
        }
      }

      // Seuil minimum de 50 pour être recommandé
      if (score >= 50) {
        recommandations.push({
          nom: metier.nom,
          code_rome: metier.code_rome,
          score_compatibilite: Math.min(100, score),
          raisons,
          competences_requises: metier.competences_cles,
          competences_a_developper: this.identifierCompetencesADevelopper(profil, metier),
          salaire_moyen: metier.salaire_moyen,
          perspectives: metier.perspectives
        });
      }
    });

    // Trier par score décroissant
    return recommandations.sort((a, b) => b.score_compatibilite - a.score_compatibilite).slice(0, 10);
  }

  /**
   * Identifie les compétences à développer pour un métier
   */
  private identifierCompetencesADevelopper(profil: ProfilComplet, metier: MetierReference): string[] {
    if (!profil.competences) return metier.competences_cles;

    return metier.competences_cles.filter(ck => 
      !profil.competences!.some(c => ck.toLowerCase().includes(c.nom.toLowerCase()) && c.niveau >= 3)
    );
  }

  /**
   * Recommande des formations basées sur les métiers ciblés
   */
  private recommanderFormations(profil: ProfilComplet, metiers: MetierRecommande[]): FormationRecommandee[] {
    const formations: FormationRecommandee[] = [];

    // Formations basées sur les compétences à développer
    const competences_a_developper = new Set<string>();
    metiers.slice(0, 3).forEach(m => {
      m.competences_a_developper.forEach(c => competences_a_developper.add(c));
    });

    competences_a_developper.forEach(competence => {
      formations.push({
        titre: `Formation ${competence}`,
        duree: "3-6 mois",
        score_pertinence: 80,
        raisons: [`Nécessaire pour ${metiers[0].nom}`],
        financement_possible: ["CPF", "Pôle Emploi", "OPCO"]
      });
    });

    return formations.slice(0, 5);
  }

  /**
   * Identifie les axes de développement personnel
   */
  private identifierAxesDeveloppement(profil: ProfilComplet): string[] {
    const axes: string[] = [];

    if (profil.bigFive) {
      // Axes basés sur Big Five
      if (profil.bigFive.scores.C.niveau === 'Faible') {
        axes.push("Développer votre organisation et votre rigueur méthodologique");
      }
      if (profil.bigFive.scores.E.niveau === 'Faible') {
        axes.push("Renforcer votre aisance sociale et votre réseau professionnel");
      }
      if (profil.bigFive.scores.N.niveau === 'Élevé') {
        axes.push("Travailler sur la gestion du stress et la confiance en soi");
      }
    }

    return axes.length > 0 ? axes : ["Continuer à développer vos points forts"];
  }

  /**
   * Crée un plan d'action personnalisé
   */
  private creerPlanAction(
    profil: ProfilComplet, 
    metiers: MetierRecommande[], 
    axes: string[]
  ): ActionRecommandee[] {
    const actions: ActionRecommandee[] = [];

    // Actions immédiates (0-3 mois)
    actions.push({
      titre: "Définir votre projet professionnel",
      description: `Choisir entre les 3 métiers les plus compatibles : ${metiers.slice(0, 3).map(m => m.nom).join(', ')}`,
      categorie: "recherche",
      priorite: "haute",
      echeance: "1 mois",
      ressources: ["Entretien avec consultant", "Recherche métiers ROME"]
    });

    // Actions court terme (3-6 mois)
    if (metiers.length > 0 && metiers[0].competences_a_developper.length > 0) {
      actions.push({
        titre: "Se former aux compétences manquantes",
        description: `Développer : ${metiers[0].competences_a_developper.slice(0, 2).join(', ')}`,
        categorie: "formation",
        priorite: "haute",
        echeance: "6 mois",
        ressources: ["CPF", "Pôle Emploi", "Formations en ligne"]
      });
    }

    // Actions moyen terme (6-12 mois)
    actions.push({
      titre: "Développer votre réseau professionnel",
      description: "Participer à des événements, rejoindre des communautés professionnelles",
      categorie: "reseau",
      priorite: "moyenne",
      echeance: "12 mois",
      ressources: ["LinkedIn", "Meetups", "Associations professionnelles"]
    });

    return actions;
  }

  /**
   * Génère une synthèse textuelle avec l'IA
   */
  private async genererSyntheseIA(profil: ProfilComplet, analyse: any): Promise<string> {
    // Préparer le contexte pour l'IA
    const context = `
Profil du bénéficiaire :
- MBTI : ${profil.mbti?.type || 'Non disponible'}
- DISC : ${profil.disc?.profil || 'Non disponible'}
- Big Five : ${profil.bigFive ? `O:${profil.bigFive.scores.O.niveau} C:${profil.bigFive.scores.C.niveau} E:${profil.bigFive.scores.E.niveau} A:${profil.bigFive.scores.A.niveau} N:${profil.bigFive.scores.N.niveau}` : 'Non disponible'}
- RIASEC : ${profil.riasec?.code || 'Non disponible'}

Cohérence : ${analyse.coherence.score}%
Points forts : ${analyse.coherence.points_forts.join(', ')}
Talents cachés : ${analyse.talents_caches.join(', ')}

Top 3 métiers recommandés :
${analyse.recommandations_metiers.slice(0, 3).map((m: MetierRecommande, i: number) => 
  `${i+1}. ${m.nom} (${m.score_compatibilite}% de compatibilité)`
).join('\n')}
`;

    // Appel à l'IA (GPT-4)
    const prompt = `En tant qu'expert en bilan de compétences, rédigez une synthèse professionnelle et bienveillante (300-400 mots) du profil suivant :

${context}

La synthèse doit :
1. Présenter les traits de personnalité dominants
2. Mettre en valeur les talents et points forts
3. Expliquer la cohérence (ou les nuances) entre les tests
4. Orienter vers les métiers les plus adaptés
5. Être encourageante et constructive`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: 'Vous êtes un expert en bilan de compétences, psychologue du travail.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Erreur génération synthèse IA:', error);
      return "Synthèse non disponible. Veuillez contacter votre consultant.";
    }
  }
}

// ============================================================================
// EXPORT DE L'INSTANCE SINGLETON
// ============================================================================

export const analysisEngine = new AnalysisEngine();

