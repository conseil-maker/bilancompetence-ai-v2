// ============================================================================
// JOB MATCHER - Matching intelligent avec offres d'emploi
// ============================================================================

import { ProfilComplet, MetierRecommande } from '../ai/analysis-engine';

// ============================================================================
// TYPES
// ============================================================================

export interface OffreEmploi {
  id: string;
  intitule: string;
  description: string;
  entreprise: {
    nom?: string;
    description?: string;
  };
  lieuTravail: {
    libelle: string;
    latitude?: number;
    longitude?: number;
    codePostal?: string;
    commune?: string;
  };
  typeContrat: string;
  natureContrat: string;
  experienceExige?: string;
  competences?: Array<{
    code: string;
    libelle: string;
    exigence: string;
  }>;
  salaire?: {
    libelle?: string;
    commentaire?: string;
  };
  dureeTravailLibelle?: string;
  dateCreation: string;
  origineOffre: {
    urlOrigine?: string;
  };
}

export interface OffreMatchee extends OffreEmploi {
  score_compatibilite: number; // 0-100
  raisons_match: string[];
  competences_matchees: string[];
  competences_manquantes: string[];
  distance_km?: number;
}

export interface RechercheEmploiParams {
  metiers?: string[]; // Codes ROME
  commune?: string;
  distance?: number; // km
  typeContrat?: string;
  experienceExige?: string;
  limit?: number;
}

// ============================================================================
// CLIENT API FRANCE TRAVAIL (ex-Pôle Emploi)
// ============================================================================

export class FranceTravailClient {
  private baseUrl = 'https://api.francetravail.io/partenaire';
  private accessToken?: string;
  private tokenExpiry?: number;

  constructor(
    private clientId: string = process.env.FRANCE_TRAVAIL_CLIENT_ID || '',
    private clientSecret: string = process.env.FRANCE_TRAVAIL_CLIENT_SECRET || ''
  ) {}

  /**
   * Obtenir un token d'accès OAuth2
   */
  private async getAccessToken(): Promise<string> {
    // Vérifier si le token est encore valide
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${this.baseUrl}/connexion/oauth2/access_token?realm=%2Fpartenaire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          scope: 'api_offresdemploiv2 o2dsoffre'
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur authentification France Travail: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // -1 min de marge

      return this.accessToken;
    } catch (error) {
      console.error('Erreur obtention token France Travail:', error);
      throw error;
    }
  }

  /**
   * Rechercher des offres d'emploi
   */
  async rechercherOffres(params: RechercheEmploiParams): Promise<OffreEmploi[]> {
    try {
      const token = await this.getAccessToken();

      // Construire les paramètres de recherche
      const searchParams = new URLSearchParams();
      
      if (params.metiers && params.metiers.length > 0) {
        searchParams.append('codeROME', params.metiers.join(','));
      }
      
      if (params.commune) {
        searchParams.append('commune', params.commune);
      }
      
      if (params.distance) {
        searchParams.append('distance', params.distance.toString());
      }
      
      if (params.typeContrat) {
        searchParams.append('typeContrat', params.typeContrat);
      }
      
      if (params.experienceExige) {
        searchParams.append('experience', params.experienceExige);
      }

      searchParams.append('range', `0-${params.limit || 50}`);
      searchParams.append('sort', '2'); // Tri par date de création décroissante

      const response = await fetch(
        `${this.baseUrl}/offresdemploi/v2/offres/search?${searchParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur recherche offres: ${response.statusText}`);
      }

      const data = await response.json();
      return data.resultats || [];
    } catch (error) {
      console.error('Erreur recherche offres France Travail:', error);
      return [];
    }
  }

  /**
   * Obtenir les détails d'une offre
   */
  async getOffreDetails(offreId: string): Promise<OffreEmploi | null> {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(
        `${this.baseUrl}/offresdemploi/v2/offres/${offreId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur récupération offre: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur récupération offre France Travail:', error);
      return null;
    }
  }
}

// ============================================================================
// MOTEUR DE MATCHING
// ============================================================================

export class JobMatcher {
  private franceTravailClient: FranceTravailClient;

  constructor() {
    this.franceTravailClient = new FranceTravailClient();
  }

  /**
   * Matcher un profil avec des offres d'emploi
   */
  async matcherOffres(
    profil: ProfilComplet,
    metiersRecommandes: MetierRecommande[],
    params: Partial<RechercheEmploiParams> = {}
  ): Promise<OffreMatchee[]> {
    // Extraire les codes ROME des métiers recommandés
    const codesROME = metiersRecommandes
      .filter(m => m.code_rome)
      .map(m => m.code_rome!);

    if (codesROME.length === 0) {
      console.warn('Aucun code ROME disponible pour la recherche');
      return [];
    }

    // Rechercher les offres
    const offres = await this.franceTravailClient.rechercherOffres({
      metiers: codesROME,
      ...params,
      limit: params.limit || 50
    });

    // Calculer le score de compatibilité pour chaque offre
    const offresMatchees: OffreMatchee[] = offres.map(offre => {
      const match = this.calculerScoreCompatibilite(offre, profil, metiersRecommandes);
      return {
        ...offre,
        ...match
      };
    });

    // Trier par score décroissant et retourner les meilleures
    return offresMatchees
      .sort((a, b) => b.score_compatibilite - a.score_compatibilite)
      .slice(0, params.limit || 20);
  }

  /**
   * Calculer le score de compatibilité entre une offre et un profil
   */
  private calculerScoreCompatibilite(
    offre: OffreEmploi,
    profil: ProfilComplet,
    metiersRecommandes: MetierRecommande[]
  ): {
    score_compatibilite: number;
    raisons_match: string[];
    competences_matchees: string[];
    competences_manquantes: string[];
  } {
    let score = 0;
    const raisons: string[] = [];
    const competences_matchees: string[] = [];
    const competences_manquantes: string[] = [];

    // 1. Matching métier (40 points)
    const metierMatch = metiersRecommandes.find(m => 
      offre.intitule.toLowerCase().includes(m.nom.toLowerCase()) ||
      m.nom.toLowerCase().includes(offre.intitule.toLowerCase())
    );

    if (metierMatch) {
      score += 40;
      raisons.push(`Correspond au métier recommandé "${metierMatch.nom}" (${metierMatch.score_compatibilite}% de compatibilité)`);
    } else {
      score += 10; // Score partiel si pas de match exact
    }

    // 2. Matching compétences (40 points)
    if (offre.competences && offre.competences.length > 0 && profil.competences) {
      const competences_offre = offre.competences.map(c => c.libelle.toLowerCase());
      const competences_profil = profil.competences.map(c => c.nom.toLowerCase());

      competences_offre.forEach(comp_offre => {
        const match = competences_profil.find(comp_profil => 
          comp_offre.includes(comp_profil) || comp_profil.includes(comp_offre)
        );

        if (match) {
          competences_matchees.push(comp_offre);
        } else {
          competences_manquantes.push(comp_offre);
        }
      });

      const taux_match = competences_matchees.length / competences_offre.length;
      const points_competences = Math.round(taux_match * 40);
      score += points_competences;

      if (competences_matchees.length > 0) {
        raisons.push(`${competences_matchees.length} compétences correspondent`);
      }
      if (competences_manquantes.length > 0 && competences_manquantes.length <= 2) {
        raisons.push(`Seulement ${competences_manquantes.length} compétences à développer`);
      }
    }

    // 3. Expérience (10 points)
    if (offre.experienceExige && profil.experience) {
      const experience_totale_mois = profil.experience.reduce((sum, exp) => sum + exp.duree, 0);
      const experience_annees = experience_totale_mois / 12;

      const experience_requise = this.parseExperienceRequise(offre.experienceExige);
      
      if (experience_annees >= experience_requise) {
        score += 10;
        raisons.push(`Expérience suffisante (${Math.round(experience_annees)} ans)`);
      } else if (experience_annees >= experience_requise - 1) {
        score += 5;
        raisons.push(`Expérience proche du requis`);
      }
    } else if (!offre.experienceExige || offre.experienceExige === 'D' || offre.experienceExige === '1') {
      // Débutant accepté
      score += 10;
      raisons.push(`Débutant accepté`);
    }

    // 4. Type de contrat (10 points)
    if (offre.typeContrat === 'CDI') {
      score += 10;
      raisons.push(`CDI proposé`);
    } else if (offre.typeContrat === 'CDD') {
      score += 5;
    }

    return {
      score_compatibilite: Math.min(100, score),
      raisons_match: raisons,
      competences_matchees,
      competences_manquantes
    };
  }

  /**
   * Parser l'expérience requise (codes France Travail)
   */
  private parseExperienceRequise(code: string): number {
    const mapping: Record<string, number> = {
      'D': 0,   // Débutant accepté
      '1': 0,   // Moins de 1 an
      '2': 1,   // De 1 à 3 ans
      '3': 3    // Plus de 3 ans
    };
    return mapping[code] || 0;
  }

  /**
   * Calculer la distance entre deux points GPS
   */
  private calculerDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

// ============================================================================
// EXPORT DE L'INSTANCE SINGLETON
// ============================================================================

export const jobMatcher = new JobMatcher();

