// ============================================================================
// FORMATION MATCHER - Matching intelligent avec formations CPF
// ============================================================================

import { ProfilComplet, MetierRecommande } from '../ai/analysis-engine';

// ============================================================================
// TYPES
// ============================================================================

export interface FormationCPF {
  id: string;
  intitule: string;
  objectif?: string;
  organisme: {
    nom: string;
    ville?: string;
    codePostal?: string;
  };
  duree: {
    heures?: number;
    jours?: number;
    libelle?: string;
  };
  prix?: number;
  modalites?: string[]; // Présentiel, Distanciel, Mixte
  certification?: {
    nom?: string;
    niveau?: string;
  };
  competences_visees?: string[];
  url?: string;
}

export interface FormationMatchee extends FormationCPF {
  score_pertinence: number; // 0-100
  raisons_match: string[];
  competences_developpees: string[];
  financement_possible: string[];
}

export interface RechercheFormationParams {
  domaine?: string;
  competences?: string[];
  ville?: string;
  distance?: number;
  modalite?: 'presentiel' | 'distanciel' | 'mixte';
  duree_max_heures?: number;
  prix_max?: number;
  certification?: boolean;
  limit?: number;
}

// ============================================================================
// CLIENT API FORMATIONS (Simulé - À remplacer par vraie API)
// ============================================================================

export class FormationClient {
  /**
   * Rechercher des formations
   * Note: Cette implémentation est simulée. 
   * À remplacer par l'API réelle de France Compétences ou Kairos
   */
  async rechercherFormations(params: RechercheFormationParams): Promise<FormationCPF[]> {
    // Données simulées pour démonstration
    const formations_simulees: FormationCPF[] = [
      {
        id: 'form_001',
        intitule: 'Développeur Web Full Stack',
        objectif: 'Maîtriser le développement web front-end et back-end',
        organisme: {
          nom: 'OpenClassrooms',
          ville: 'Paris',
          codePostal: '75000'
        },
        duree: {
          heures: 700,
          jours: 100,
          libelle: '700 heures (environ 6 mois)'
        },
        prix: 7000,
        modalites: ['distanciel'],
        certification: {
          nom: 'Titre professionnel Développeur Web et Web Mobile',
          niveau: 'Bac+2'
        },
        competences_visees: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'SQL'],
        url: 'https://openclassrooms.com/fr/paths/717-developpeur-web'
      },
      {
        id: 'form_002',
        intitule: 'Chef de Projet Digital',
        objectif: 'Piloter des projets digitaux de A à Z',
        organisme: {
          nom: 'CNAM',
          ville: 'Paris',
          codePostal: '75003'
        },
        duree: {
          heures: 500,
          jours: 70,
          libelle: '500 heures (environ 5 mois)'
        },
        prix: 5500,
        modalites: ['mixte'],
        certification: {
          nom: 'Certificat professionnel Chef de projet digital',
          niveau: 'Bac+3'
        },
        competences_visees: ['Gestion de projet', 'Agilité', 'Product Management', 'UX/UI'],
        url: 'https://www.cnam.fr'
      },
      {
        id: 'form_003',
        intitule: 'Designer UX/UI',
        objectif: 'Concevoir des interfaces utilisateur optimales',
        organisme: {
          nom: 'Studi',
          ville: 'Lyon',
          codePostal: '69000'
        },
        duree: {
          heures: 600,
          jours: 85,
          libelle: '600 heures (environ 6 mois)'
        },
        prix: 6500,
        modalites: ['distanciel'],
        certification: {
          nom: 'Titre professionnel Designer Web',
          niveau: 'Bac+2'
        },
        competences_visees: ['Design thinking', 'Figma', 'Prototypage', 'Tests utilisateurs'],
        url: 'https://www.studi.com'
      },
      {
        id: 'form_004',
        intitule: 'Commercial B2B',
        objectif: 'Maîtriser les techniques de vente en B2B',
        organisme: {
          nom: 'IFOCOP',
          ville: 'Paris',
          codePostal: '75015'
        },
        duree: {
          heures: 400,
          jours: 57,
          libelle: '400 heures (environ 4 mois)'
        },
        prix: 4500,
        modalites: ['presentiel', 'mixte'],
        certification: {
          nom: 'Titre professionnel Négociateur Technico-Commercial',
          niveau: 'Bac+2'
        },
        competences_visees: ['Prospection', 'Négociation', 'CRM', 'Closing'],
        url: 'https://www.ifocop.fr'
      },
      {
        id: 'form_005',
        intitule: 'Data Analyst',
        objectif: 'Analyser et visualiser les données',
        organisme: {
          nom: 'DataScientest',
          ville: 'Paris',
          codePostal: '75002'
        },
        duree: {
          heures: 450,
          jours: 64,
          libelle: '450 heures (environ 4 mois)'
        },
        prix: 5000,
        modalites: ['distanciel'],
        certification: {
          nom: 'Certification Data Analyst',
          niveau: 'Bac+3'
        },
        competences_visees: ['Python', 'SQL', 'Tableau', 'Power BI', 'Statistiques'],
        url: 'https://datascientest.com'
      }
    ];

    // Filtrer selon les paramètres
    let resultats = formations_simulees;

    if (params.modalite) {
      resultats = resultats.filter(f => 
        f.modalites?.some(m => m.toLowerCase().includes(params.modalite!))
      );
    }

    if (params.duree_max_heures) {
      resultats = resultats.filter(f => 
        f.duree.heures && f.duree.heures <= params.duree_max_heures!
      );
    }

    if (params.prix_max) {
      resultats = resultats.filter(f => 
        f.prix && f.prix <= params.prix_max!
      );
    }

    if (params.certification) {
      resultats = resultats.filter(f => f.certification);
    }

    return resultats.slice(0, params.limit || 10);
  }
}

// ============================================================================
// MOTEUR DE MATCHING FORMATIONS
// ============================================================================

export class FormationMatcher {
  private formationClient: FormationClient;

  constructor() {
    this.formationClient = new FormationClient();
  }

  /**
   * Matcher un profil avec des formations
   */
  async matcherFormations(
    profil: ProfilComplet,
    metiersRecommandes: MetierRecommande[],
    params: Partial<RechercheFormationParams> = {}
  ): Promise<FormationMatchee[]> {
    // Identifier les compétences à développer
    const competences_a_developper = new Set<string>();
    metiersRecommandes.slice(0, 3).forEach(metier => {
      metier.competences_a_developper.forEach(c => competences_a_developper.add(c));
    });

    // Rechercher les formations
    const formations = await this.formationClient.rechercherFormations({
      competences: Array.from(competences_a_developper),
      ...params,
      limit: params.limit || 20
    });

    // Calculer le score de pertinence pour chaque formation
    const formationsMatchees: FormationMatchee[] = formations.map(formation => {
      const match = this.calculerScorePertinence(formation, profil, metiersRecommandes);
      return {
        ...formation,
        ...match
      };
    });

    // Trier par score décroissant
    return formationsMatchees
      .sort((a, b) => b.score_pertinence - a.score_pertinence)
      .slice(0, params.limit || 10);
  }

  /**
   * Calculer le score de pertinence d'une formation
   */
  private calculerScorePertinence(
    formation: FormationCPF,
    profil: ProfilComplet,
    metiersRecommandes: MetierRecommande[]
  ): {
    score_pertinence: number;
    raisons_match: string[];
    competences_developpees: string[];
    financement_possible: string[];
  } {
    let score = 0;
    const raisons: string[] = [];
    const competences_developpees: string[] = [];
    const financement_possible: string[] = ['CPF'];

    // 1. Matching avec métiers recommandés (40 points)
    const metierMatch = metiersRecommandes.find(m =>
      formation.intitule.toLowerCase().includes(m.nom.toLowerCase()) ||
      m.nom.toLowerCase().includes(formation.intitule.toLowerCase())
    );

    if (metierMatch) {
      score += 40;
      raisons.push(`Formation alignée avec le métier "${metierMatch.nom}"`);
    } else {
      score += 10;
    }

    // 2. Matching compétences à développer (40 points)
    const competences_a_developper = new Set<string>();
    metiersRecommandes.slice(0, 3).forEach(m => {
      m.competences_a_developper.forEach(c => competences_a_developper.add(c.toLowerCase()));
    });

    if (formation.competences_visees) {
      formation.competences_visees.forEach(comp_formation => {
        const match = Array.from(competences_a_developper).find(comp_dev =>
          comp_formation.toLowerCase().includes(comp_dev) ||
          comp_dev.includes(comp_formation.toLowerCase())
        );

        if (match) {
          competences_developpees.push(comp_formation);
        }
      });

      if (competences_developpees.length > 0) {
        const points = Math.min(40, competences_developpees.length * 10);
        score += points;
        raisons.push(`${competences_developpees.length} compétences nécessaires seront développées`);
      }
    }

    // 3. Certification (10 points)
    if (formation.certification) {
      score += 10;
      raisons.push(`Certification reconnue : ${formation.certification.nom}`);
    }

    // 4. Modalités adaptées (10 points)
    if (formation.modalites?.includes('distanciel')) {
      score += 5;
      raisons.push(`Formation à distance (flexible)`);
    }
    if (formation.modalites?.includes('mixte')) {
      score += 5;
      raisons.push(`Format mixte (équilibre présentiel/distanciel)`);
    }

    // Financement possible
    if (formation.prix && formation.prix <= 5000) {
      financement_possible.push('Pôle Emploi');
    }
    if (formation.certification) {
      financement_possible.push('OPCO');
    }

    return {
      score_pertinence: Math.min(100, score),
      raisons_match: raisons,
      competences_developpees,
      financement_possible: [...new Set(financement_possible)]
    };
  }
}

// ============================================================================
// EXPORT DE L'INSTANCE SINGLETON
// ============================================================================

export const formationMatcher = new FormationMatcher();

