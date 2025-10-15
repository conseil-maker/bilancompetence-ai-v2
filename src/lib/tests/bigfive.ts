// ============================================================================
// TEST BIG FIVE (OCEAN - Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism)
// ============================================================================

export interface BigFiveQuestion {
  id: number;
  texte: string;
  dimension: 'O' | 'C' | 'E' | 'A' | 'N';
  reverse: boolean; // Si true, inverser le score
}

export interface BigFiveReponse {
  questionId: number;
  score: number; // 1-5 (Pas du tout d'accord à Tout à fait d'accord)
}

export interface BigFiveResultat {
  scores: {
    O: { score: number; niveau: 'Faible' | 'Moyen' | 'Élevé'; pourcentage: number };
    C: { score: number; niveau: 'Faible' | 'Moyen' | 'Élevé'; pourcentage: number };
    E: { score: number; niveau: 'Faible' | 'Moyen' | 'Élevé'; pourcentage: number };
    A: { score: number; niveau: 'Faible' | 'Moyen' | 'Élevé'; pourcentage: number };
    N: { score: number; niveau: 'Faible' | 'Moyen' | 'Élevé'; pourcentage: number };
  };
  profil: string;
  descriptions: {
    O: string;
    C: string;
    E: string;
    A: string;
    N: string;
  };
  metiersAdaptes: string[];
  conseils: string[];
}

// ============================================================================
// QUESTIONS BIG FIVE (50 questions - 10 par dimension)
// ============================================================================

export const BIGFIVE_QUESTIONS: BigFiveQuestion[] = [
  // Openness (Ouverture) - 10 questions
  { id: 1, texte: "J'ai une imagination vive", dimension: 'O', reverse: false },
  { id: 2, texte: "Je m'intéresse à l'art et à la culture", dimension: 'O', reverse: false },
  { id: 3, texte: "J'aime essayer de nouvelles choses", dimension: 'O', reverse: false },
  { id: 4, texte: "Je préfère la routine aux changements", dimension: 'O', reverse: true },
  { id: 5, texte: "J'aime réfléchir à des concepts abstraits", dimension: 'O', reverse: false },
  { id: 6, texte: "Je suis curieux de beaucoup de choses", dimension: 'O', reverse: false },
  { id: 7, texte: "Je préfère les idées traditionnelles", dimension: 'O', reverse: true },
  { id: 8, texte: "J'apprécie la beauté dans l'art et la nature", dimension: 'O', reverse: false },
  { id: 9, texte: "J'aime explorer de nouvelles idées", dimension: 'O', reverse: false },
  { id: 10, texte: "Je préfère m'en tenir à ce que je connais", dimension: 'O', reverse: true },

  // Conscientiousness (Conscience) - 10 questions
  { id: 11, texte: "Je suis toujours préparé", dimension: 'C', reverse: false },
  { id: 12, texte: "Je fais attention aux détails", dimension: 'C', reverse: false },
  { id: 13, texte: "Je termine toujours ce que je commence", dimension: 'C', reverse: false },
  { id: 14, texte: "Je laisse souvent mes affaires traîner", dimension: 'C', reverse: true },
  { id: 15, texte: "Je suis organisé dans mon travail", dimension: 'C', reverse: false },
  { id: 16, texte: "Je respecte toujours mes engagements", dimension: 'C', reverse: false },
  { id: 17, texte: "Je remets souvent les choses à plus tard", dimension: 'C', reverse: true },
  { id: 18, texte: "Je suis méticuleux dans mon travail", dimension: 'C', reverse: false },
  { id: 19, texte: "Je planifie mes activités à l'avance", dimension: 'C', reverse: false },
  { id: 20, texte: "Je néglige mes responsabilités", dimension: 'C', reverse: true },

  // Extraversion - 10 questions
  { id: 21, texte: "Je suis le centre de l'attention lors des fêtes", dimension: 'E', reverse: false },
  { id: 22, texte: "Je me sens à l'aise avec les gens", dimension: 'E', reverse: false },
  { id: 23, texte: "Je commence facilement des conversations", dimension: 'E', reverse: false },
  { id: 24, texte: "Je préfère rester en retrait", dimension: 'E', reverse: true },
  { id: 25, texte: "J'aime être entouré de beaucoup de monde", dimension: 'E', reverse: false },
  { id: 26, texte: "Je parle à beaucoup de personnes différentes lors des fêtes", dimension: 'E', reverse: false },
  { id: 27, texte: "Je garde mes pensées pour moi", dimension: 'E', reverse: true },
  { id: 28, texte: "Je suis plein d'énergie", dimension: 'E', reverse: false },
  { id: 29, texte: "J'aime attirer l'attention", dimension: 'E', reverse: false },
  { id: 30, texte: "Je suis plutôt silencieux en présence d'étrangers", dimension: 'E', reverse: true },

  // Agreeableness (Agréabilité) - 10 questions
  { id: 31, texte: "Je m'intéresse aux autres", dimension: 'A', reverse: false },
  { id: 32, texte: "Je sympathise avec les sentiments des autres", dimension: 'A', reverse: false },
  { id: 33, texte: "Je prends du temps pour les autres", dimension: 'A', reverse: false },
  { id: 34, texte: "Je me soucie peu des autres", dimension: 'A', reverse: true },
  { id: 35, texte: "Je fais en sorte que les gens se sentent à l'aise", dimension: 'A', reverse: false },
  { id: 36, texte: "Je suis toujours prêt à aider", dimension: 'A', reverse: false },
  { id: 37, texte: "Je critique souvent les autres", dimension: 'A', reverse: true },
  { id: 38, texte: "Je fais confiance aux gens", dimension: 'A', reverse: false },
  { id: 39, texte: "Je suis respectueux envers les autres", dimension: 'A', reverse: false },
  { id: 40, texte: "Je peux être froid et distant", dimension: 'A', reverse: true },

  // Neuroticism (Névrosisme/Stabilité émotionnelle) - 10 questions
  { id: 41, texte: "Je suis souvent stressé", dimension: 'N', reverse: false },
  { id: 42, texte: "Je m'inquiète beaucoup", dimension: 'N', reverse: false },
  { id: 43, texte: "Je suis facilement perturbé", dimension: 'N', reverse: false },
  { id: 44, texte: "Je reste calme dans les situations stressantes", dimension: 'N', reverse: true },
  { id: 45, texte: "Mes émotions changent facilement", dimension: 'N', reverse: false },
  { id: 46, texte: "Je me sens souvent anxieux", dimension: 'N', reverse: false },
  { id: 47, texte: "Je suis détendu la plupart du temps", dimension: 'N', reverse: true },
  { id: 48, texte: "Je me fâche facilement", dimension: 'N', reverse: false },
  { id: 49, texte: "Je suis souvent de mauvaise humeur", dimension: 'N', reverse: false },
  { id: 50, texte: "Je gère bien le stress", dimension: 'N', reverse: true },
];

// ============================================================================
// DESCRIPTIONS DES DIMENSIONS BIG FIVE
// ============================================================================

export const BIGFIVE_DESCRIPTIONS = {
  O: {
    nom: "Ouverture à l'expérience",
    faible: {
      description: "Préfère la routine, pragmatique, conventionnel",
      traits: ["Pratique", "Traditionnel", "Préfère la routine", "Concret"],
      metiers: ["Comptable", "Administrateur", "Technicien", "Opérateur"],
    },
    moyen: {
      description: "Équilibre entre tradition et nouveauté",
      traits: ["Équilibré", "Adaptable", "Ouvert mais prudent"],
      metiers: ["Manager", "Enseignant", "Consultant", "Coordinateur"],
    },
    eleve: {
      description: "Créatif, curieux, ouvert aux nouvelles expériences",
      traits: ["Créatif", "Curieux", "Imaginatif", "Aventureux", "Artistique"],
      metiers: ["Artiste", "Designer", "Chercheur", "Entrepreneur", "Écrivain"],
    },
  },
  C: {
    nom: "Conscience professionnelle",
    faible: {
      description: "Spontané, flexible, décontracté",
      traits: ["Spontané", "Flexible", "Décontracté", "Improvisateur"],
      metiers: ["Artiste", "Créatif", "Freelance", "Entrepreneur"],
    },
    moyen: {
      description: "Équilibre entre organisation et flexibilité",
      traits: ["Équilibré", "Organisé mais flexible", "Fiable"],
      metiers: ["Manager", "Consultant", "Enseignant", "Commercial"],
    },
    eleve: {
      description: "Organisé, fiable, discipliné, perfectionniste",
      traits: ["Organisé", "Fiable", "Discipliné", "Méticuleux", "Persévérant"],
      metiers: ["Comptable", "Ingénieur", "Chef de projet", "Administrateur", "Analyste"],
    },
  },
  E: {
    nom: "Extraversion",
    faible: {
      description: "Introverti, réservé, préfère la solitude",
      traits: ["Réservé", "Réfléchi", "Indépendant", "Calme"],
      metiers: ["Chercheur", "Écrivain", "Programmeur", "Bibliothécaire", "Analyste"],
    },
    moyen: {
      description: "Ambivert, équilibre entre solitude et socialisation",
      traits: ["Équilibré", "Adaptable", "Sociable mais besoin de solitude"],
      metiers: ["Manager", "Enseignant", "Consultant", "Chef de projet"],
    },
    eleve: {
      description: "Extraverti, sociable, énergique, aime être entouré",
      traits: ["Sociable", "Énergique", "Enthousiaste", "Assertif", "Expressif"],
      metiers: ["Commercial", "Manager", "Formateur", "Relations publiques", "Animateur"],
    },
  },
  A: {
    nom: "Agréabilité",
    faible: {
      description: "Compétitif, sceptique, direct",
      traits: ["Compétitif", "Sceptique", "Direct", "Indépendant"],
      metiers: ["Avocat", "Négociateur", "Entrepreneur", "Analyste financier"],
    },
    moyen: {
      description: "Équilibre entre coopération et affirmation",
      traits: ["Équilibré", "Coopératif mais assertif", "Diplomatique"],
      metiers: ["Manager", "Consultant", "Enseignant", "Coordinateur"],
    },
    eleve: {
      description: "Coopératif, empathique, altruiste, confiant",
      traits: ["Empathique", "Coopératif", "Altruiste", "Confiant", "Bienveillant"],
      metiers: ["Infirmier", "Travailleur social", "Psychologue", "Enseignant", "Conseiller"],
    },
  },
  N: {
    nom: "Névrosisme (Stabilité émotionnelle)",
    faible: {
      description: "Stable émotionnellement, calme, résilient",
      traits: ["Calme", "Résilient", "Stable", "Confiant", "Détendu"],
      metiers: ["Pompier", "Pilote", "Chirurgien", "Manager", "Militaire"],
    },
    moyen: {
      description: "Équilibre émotionnel normal",
      traits: ["Équilibré", "Gère bien le stress", "Émotions normales"],
      metiers: ["Manager", "Enseignant", "Consultant", "Ingénieur"],
    },
    eleve: {
      description: "Sensible émotionnellement, anxieux, réactif",
      traits: ["Sensible", "Empathique", "Prudent", "Attentif aux détails"],
      metiers: ["Psychologue", "Artiste", "Écrivain", "Chercheur", "Analyste"],
    },
  },
};

// ============================================================================
// FONCTION DE CALCUL DU RÉSULTAT BIG FIVE
// ============================================================================

export function calculerResultatBigFive(reponses: BigFiveReponse[]): BigFiveResultat {
  // Initialiser les scores
  const scores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
  const counts = { O: 0, C: 0, E: 0, A: 0, N: 0 };

  // Calculer les scores
  reponses.forEach(reponse => {
    const question = BIGFIVE_QUESTIONS.find(q => q.id === reponse.questionId);
    if (!question) return;

    const dimension = question.dimension;
    const score = question.reverse ? (6 - reponse.score) : reponse.score;
    
    scores[dimension] += score;
    counts[dimension]++;
  });

  // Calculer les moyennes et niveaux
  const resultat: any = { scores: {}, descriptions: {}, metiersAdaptes: [], conseils: [] };

  (['O', 'C', 'E', 'A', 'N'] as const).forEach(dimension => {
    const moyenne = scores[dimension] / counts[dimension];
    const pourcentage = Math.round((moyenne / 5) * 100);
    
    let niveau: 'Faible' | 'Moyen' | 'Élevé';
    let description;
    let metiers;

    if (moyenne < 2.5) {
      niveau = 'Faible';
      description = BIGFIVE_DESCRIPTIONS[dimension].faible.description;
      metiers = BIGFIVE_DESCRIPTIONS[dimension].faible.metiers;
    } else if (moyenne < 3.5) {
      niveau = 'Moyen';
      description = BIGFIVE_DESCRIPTIONS[dimension].moyen.description;
      metiers = BIGFIVE_DESCRIPTIONS[dimension].moyen.metiers;
    } else {
      niveau = 'Élevé';
      description = BIGFIVE_DESCRIPTIONS[dimension].eleve.description;
      metiers = BIGFIVE_DESCRIPTIONS[dimension].eleve.metiers;
    }

    resultat.scores[dimension] = {
      score: Math.round(moyenne * 10) / 10,
      niveau,
      pourcentage,
    };

    resultat.descriptions[dimension] = description;
    resultat.metiersAdaptes.push(...metiers);
  });

  // Générer le profil textuel
  resultat.profil = `O:${resultat.scores.O.niveau} C:${resultat.scores.C.niveau} E:${resultat.scores.E.niveau} A:${resultat.scores.A.niveau} N:${resultat.scores.N.niveau}`;

  // Dédupliquer les métiers
  resultat.metiersAdaptes = [...new Set(resultat.metiersAdaptes)];

  // Générer des conseils personnalisés
  resultat.conseils = genererConseilsBigFive(resultat.scores);

  return resultat;
}

function genererConseilsBigFive(scores: any): string[] {
  const conseils: string[] = [];

  // Conseils basés sur l'Ouverture
  if (scores.O.niveau === 'Faible') {
    conseils.push("Essayez d'explorer de nouvelles activités pour élargir vos horizons");
  } else if (scores.O.niveau === 'Élevé') {
    conseils.push("Canalisez votre créativité dans des projets concrets");
  }

  // Conseils basés sur la Conscience
  if (scores.C.niveau === 'Faible') {
    conseils.push("Développez des routines et des systèmes d'organisation");
  } else if (scores.C.niveau === 'Élevé') {
    conseils.push("Apprenez à lâcher prise et à accepter l'imperfection");
  }

  // Conseils basés sur l'Extraversion
  if (scores.E.niveau === 'Faible') {
    conseils.push("Respectez votre besoin de solitude tout en maintenant des connexions sociales");
  } else if (scores.E.niveau === 'Élevé') {
    conseils.push("Assurez-vous de prendre du temps pour vous ressourcer seul");
  }

  // Conseils basés sur l'Agréabilité
  if (scores.A.niveau === 'Faible') {
    conseils.push("Développez votre empathie et votre écoute active");
  } else if (scores.A.niveau === 'Élevé') {
    conseils.push("Apprenez à dire non et à défendre vos propres intérêts");
  }

  // Conseils basés sur le Névrosisme
  if (scores.N.niveau === 'Élevé') {
    conseils.push("Pratiquez des techniques de gestion du stress (méditation, sport)");
    conseils.push("Consultez un professionnel si l'anxiété devient envahissante");
  } else if (scores.N.niveau === 'Faible') {
    conseils.push("Votre stabilité émotionnelle est un atout, utilisez-la pour aider les autres");
  }

  return conseils;
}

