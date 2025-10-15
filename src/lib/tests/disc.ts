// ============================================================================
// TEST DISC (Dominance, Influence, Stabilité, Conformité)
// ============================================================================

export interface DISCQuestion {
  id: number;
  texte: string;
  options: {
    D: string; // Dominance
    I: string; // Influence
    S: string; // Stabilité
    C: string; // Conformité
  };
}

export interface DISCReponse {
  questionId: number;
  choix: 'D' | 'I' | 'S' | 'C';
}

export interface DISCResultat {
  profil: string; // Ex: "DI", "SC", etc.
  scores: {
    D: { score: number; pourcentage: number };
    I: { score: number; pourcentage: number };
    S: { score: number; pourcentage: number };
    C: { score: number; pourcentage: number };
  };
  traitDominant: 'D' | 'I' | 'S' | 'C';
  description: string;
  forces: string[];
  faiblesses: string[];
  styleManagement: string;
  styleCommunication: string;
  metiersAdaptes: string[];
  conseils: string[];
}

// ============================================================================
// QUESTIONS DISC (24 questions)
// ============================================================================

export const DISC_QUESTIONS: DISCQuestion[] = [
  {
    id: 1,
    texte: "Face à un défi, vous êtes plutôt :",
    options: {
      D: "Direct et déterminé à gagner",
      I: "Enthousiaste et optimiste",
      S: "Patient et coopératif",
      C: "Analytique et méthodique"
    }
  },
  {
    id: 2,
    texte: "Dans une équipe, vous êtes celui qui :",
    options: {
      D: "Prend les décisions rapidement",
      I: "Motive et inspire les autres",
      S: "Écoute et soutient",
      C: "Vérifie les détails et la qualité"
    }
  },
  {
    id: 3,
    texte: "Votre approche du travail est :",
    options: {
      D: "Orientée résultats et efficacité",
      I: "Créative et collaborative",
      S: "Stable et fiable",
      C: "Précise et rigoureuse"
    }
  },
  {
    id: 4,
    texte: "Sous pression, vous avez tendance à :",
    options: {
      D: "Prendre le contrôle",
      I: "Chercher du soutien social",
      S: "Rester calme et patient",
      C: "Analyser la situation en détail"
    }
  },
  {
    id: 5,
    texte: "Vous préférez un environnement de travail :",
    options: {
      D: "Compétitif et stimulant",
      I: "Social et dynamique",
      S: "Harmonieux et prévisible",
      C: "Structuré et organisé"
    }
  },
  {
    id: 6,
    texte: "Votre style de communication est :",
    options: {
      D: "Direct et concis",
      I: "Expressif et enthousiaste",
      S: "Patient et à l'écoute",
      C: "Précis et factuel"
    }
  },
  {
    id: 7,
    texte: "Face à un conflit, vous :",
    options: {
      D: "L'affrontez directement",
      I: "Cherchez à persuader",
      S: "Évitez la confrontation",
      C: "Analysez les faits objectivement"
    }
  },
  {
    id: 8,
    texte: "Vous êtes motivé par :",
    options: {
      D: "Les défis et les résultats",
      I: "La reconnaissance et l'interaction",
      S: "La stabilité et l'harmonie",
      C: "La qualité et la précision"
    }
  },
  {
    id: 9,
    texte: "Votre rythme de travail est :",
    options: {
      D: "Rapide et décisif",
      I: "Variable et spontané",
      S: "Régulier et constant",
      C: "Méthodique et réfléchi"
    }
  },
  {
    id: 10,
    texte: "Vous prenez des décisions :",
    options: {
      D: "Rapidement, basées sur l'intuition",
      I: "En consultant les autres",
      S: "Après mûre réflexion",
      C: "Basées sur des données et analyses"
    }
  },
  {
    id: 11,
    texte: "Votre plus grande peur est :",
    options: {
      D: "Perdre le contrôle",
      I: "Être rejeté socialement",
      S: "Le changement soudain",
      C: "Faire des erreurs"
    }
  },
  {
    id: 12,
    texte: "Vous gérez le changement en :",
    options: {
      D: "Le dirigeant activement",
      I: "L'embrassant avec enthousiasme",
      S: "Vous adaptant progressivement",
      C: "L'analysant soigneusement"
    }
  },
  {
    id: 13,
    texte: "Dans une négociation, vous :",
    options: {
      D: "Visez à gagner",
      I: "Cherchez un accord gagnant-gagnant",
      S: "Faites des compromis",
      C: "Vous appuyez sur les faits"
    }
  },
  {
    id: 14,
    texte: "Votre approche des problèmes est :",
    options: {
      D: "Pragmatique et orientée action",
      I: "Créative et collaborative",
      S: "Patiente et systématique",
      C: "Analytique et détaillée"
    }
  },
  {
    id: 15,
    texte: "Vous êtes perçu comme :",
    options: {
      D: "Confiant et assertif",
      I: "Chaleureux et sociable",
      S: "Fiable et loyal",
      C: "Compétent et précis"
    }
  },
  {
    id: 16,
    texte: "Votre style de leadership est :",
    options: {
      D: "Directif et décisif",
      I: "Inspirant et motivant",
      S: "Supportif et participatif",
      C: "Consultatif et basé sur l'expertise"
    }
  },
  {
    id: 17,
    texte: "Vous valorisez :",
    options: {
      D: "Les résultats et l'efficacité",
      I: "Les relations et la collaboration",
      S: "La stabilité et la loyauté",
      C: "La qualité et la précision"
    }
  },
  {
    id: 18,
    texte: "Face à une tâche répétitive, vous :",
    options: {
      D: "Cherchez à l'optimiser ou la déléguer",
      I: "La rendez plus intéressante socialement",
      S: "L'accomplissez avec patience",
      C: "La perfectionnez et la systématisez"
    }
  },
  {
    id: 19,
    texte: "Votre plus grande force est :",
    options: {
      D: "Votre détermination",
      I: "Votre enthousiasme",
      S: "Votre fiabilité",
      C: "Votre rigueur"
    }
  },
  {
    id: 20,
    texte: "Vous apprenez mieux par :",
    options: {
      D: "L'action et l'expérimentation",
      I: "L'interaction et la discussion",
      S: "L'observation et la pratique",
      C: "L'étude et l'analyse"
    }
  },
  {
    id: 21,
    texte: "Votre approche du temps est :",
    options: {
      D: "Le temps c'est de l'argent",
      I: "Le temps est flexible",
      S: "Le temps doit être bien géré",
      C: "Le temps doit être planifié précisément"
    }
  },
  {
    id: 22,
    texte: "Dans un projet, vous vous concentrez sur :",
    options: {
      D: "Les objectifs et les résultats",
      I: "L'équipe et la dynamique",
      S: "Le processus et la continuité",
      C: "Les détails et la qualité"
    }
  },
  {
    id: 23,
    texte: "Votre faiblesse potentielle est :",
    options: {
      D: "L'impatience",
      I: "Le manque de suivi",
      S: "La résistance au changement",
      C: "Le perfectionnisme"
    }
  },
  {
    id: 24,
    texte: "Vous êtes le plus à l'aise quand :",
    options: {
      D: "Vous avez le contrôle",
      I: "Vous êtes entouré de gens",
      S: "Tout est stable et prévisible",
      C: "Vous avez toutes les informations"
    }
  },
];

// ============================================================================
// DESCRIPTIONS DES PROFILS DISC
// ============================================================================

export const DISC_DESCRIPTIONS = {
  D: {
    nom: "Dominance",
    description: "Orienté vers les résultats, direct, décisif et compétitif",
    forces: [
      "Prise de décision rapide",
      "Orientation résultats",
      "Confiance en soi",
      "Capacité à relever des défis",
      "Leadership naturel"
    ],
    faiblesses: [
      "Impatience",
      "Manque de tact",
      "Difficulté à déléguer",
      "Peut être perçu comme agressif",
      "Néglige les détails"
    ],
    styleManagement: "Directif, axé sur les résultats, attend l'excellence",
    styleCommunication: "Direct, concis, orienté action",
    metiersAdaptes: [
      "CEO",
      "Entrepreneur",
      "Directeur commercial",
      "Chef de projet",
      "Consultant"
    ],
    conseils: [
      "Développer la patience",
      "Écouter davantage",
      "Considérer l'impact sur les autres",
      "Prendre le temps d'analyser"
    ]
  },
  I: {
    nom: "Influence",
    description: "Sociable, enthousiaste, optimiste et persuasif",
    forces: [
      "Excellentes compétences relationnelles",
      "Enthousiasme contagieux",
      "Créativité",
      "Capacité à motiver",
      "Optimisme"
    ],
    faiblesses: [
      "Manque de suivi",
      "Désorganisation",
      "Trop optimiste",
      "Difficulté avec les détails",
      "Besoin de reconnaissance"
    ],
    styleManagement: "Inspirant, motivant, axé sur les personnes",
    styleCommunication: "Expressif, enthousiaste, persuasif",
    metiersAdaptes: [
      "Commercial",
      "Marketing",
      "Relations publiques",
      "Formateur",
      "Coach"
    ],
    conseils: [
      "Améliorer le suivi",
      "Être plus organisé",
      "Écouter autant que parler",
      "Se concentrer sur les faits"
    ]
  },
  S: {
    nom: "Stabilité",
    description: "Patient, loyal, fiable et orienté équipe",
    forces: [
      "Fiabilité",
      "Patience",
      "Loyauté",
      "Capacité d'écoute",
      "Esprit d'équipe"
    ],
    faiblesses: [
      "Résistance au changement",
      "Difficulté à dire non",
      "Évite les conflits",
      "Manque d'initiative",
      "Trop accommodant"
    ],
    styleManagement: "Supportif, participatif, axé sur l'harmonie",
    styleCommunication: "Patient, à l'écoute, diplomate",
    metiersAdaptes: [
      "Ressources humaines",
      "Travailleur social",
      "Infirmier",
      "Enseignant",
      "Conseiller"
    ],
    conseils: [
      "Accepter le changement",
      "Exprimer ses besoins",
      "Prendre des initiatives",
      "Gérer les conflits directement"
    ]
  },
  C: {
    nom: "Conformité",
    description: "Analytique, précis, méthodique et orienté qualité",
    forces: [
      "Attention aux détails",
      "Rigueur",
      "Analyse approfondie",
      "Qualité du travail",
      "Respect des normes"
    ],
    faiblesses: [
      "Perfectionnisme",
      "Lenteur décisionnelle",
      "Difficulté à déléguer",
      "Critique excessif",
      "Résistance au changement"
    ],
    styleManagement: "Consultatif, basé sur l'expertise, axé sur la qualité",
    styleCommunication: "Précis, factuel, détaillé",
    metiersAdaptes: [
      "Ingénieur",
      "Comptable",
      "Analyste",
      "Chercheur",
      "Contrôleur qualité"
    ],
    conseils: [
      "Accepter l'imperfection",
      "Prendre des décisions plus rapidement",
      "Être plus flexible",
      "Développer les compétences relationnelles"
    ]
  },
};

// Profils combinés
export const DISC_PROFILS_COMBINES = {
  "DI": {
    nom: "Le Leader Inspirant",
    description: "Combine résultats et relations, excellent pour mobiliser les équipes"
  },
  "DS": {
    nom: "Le Réalisateur Patient",
    description: "Équilibre entre action et stabilité, bon pour les projets à long terme"
  },
  "DC": {
    nom: "Le Perfectionniste Décisif",
    description: "Combine efficacité et qualité, excellent pour les projets techniques"
  },
  "IS": {
    nom: "Le Facilitateur",
    description: "Excellent pour créer l'harmonie et motiver les équipes"
  },
  "IC": {
    nom: "Le Créatif Méthodique",
    description: "Combine créativité et rigueur, bon pour l'innovation structurée"
  },
  "SC": {
    nom: "Le Professionnel Fiable",
    description: "Combine stabilité et qualité, excellent pour les rôles de support"
  },
};

// ============================================================================
// FONCTION DE CALCUL DU RÉSULTAT DISC
// ============================================================================

export function calculerResultatDISC(reponses: DISCReponse[]): DISCResultat {
  // Initialiser les scores
  const scores = { D: 0, I: 0, S: 0, C: 0 };

  // Calculer les scores
  reponses.forEach(reponse => {
    scores[reponse.choix]++;
  });

  // Calculer les pourcentages
  const total = reponses.length;
  const pourcentages = {
    D: Math.round((scores.D / total) * 100),
    I: Math.round((scores.I / total) * 100),
    S: Math.round((scores.S / total) * 100),
    C: Math.round((scores.C / total) * 100),
  };

  // Déterminer le trait dominant
  const traitDominant = Object.keys(scores).reduce((a, b) => 
    scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b
  ) as 'D' | 'I' | 'S' | 'C';

  // Déterminer le profil (1 ou 2 traits dominants)
  const sortedTraits = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .map(([trait]) => trait);
  
  const profil = scores[sortedTraits[0] as keyof typeof scores] - scores[sortedTraits[1] as keyof typeof scores] <= 3
    ? `${sortedTraits[0]}${sortedTraits[1]}`
    : sortedTraits[0];

  const description = DISC_DESCRIPTIONS[traitDominant];

  return {
    profil,
    scores: {
      D: { score: scores.D, pourcentage: pourcentages.D },
      I: { score: scores.I, pourcentage: pourcentages.I },
      S: { score: scores.S, pourcentage: pourcentages.S },
      C: { score: scores.C, pourcentage: pourcentages.C },
    },
    traitDominant,
    description: description.description,
    forces: description.forces,
    faiblesses: description.faiblesses,
    styleManagement: description.styleManagement,
    styleCommunication: description.styleCommunication,
    metiersAdaptes: description.metiersAdaptes,
    conseils: description.conseils,
  };
}

