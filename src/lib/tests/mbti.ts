// ============================================================================
// TEST MBTI (Myers-Briggs Type Indicator)
// ============================================================================

export interface MBTIQuestion {
  id: number;
  texte: string;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  sens: 'A' | 'B'; // A = premier trait, B = deuxième trait
}

export interface MBTIReponse {
  questionId: number;
  choix: 'A' | 'B';
}

export interface MBTIResultat {
  type: string; // Ex: "INTJ"
  dimensions: {
    EI: { score: number; trait: 'E' | 'I'; pourcentage: number };
    SN: { score: number; trait: 'S' | 'N'; pourcentage: number };
    TF: { score: number; trait: 'T' | 'F'; pourcentage: number };
    JP: { score: number; trait: 'J' | 'P'; pourcentage: number };
  };
  description: string;
  forces: string[];
  faiblesses: string[];
  metiersAdaptes: string[];
  styleApprentissage: string;
  styleCommunication: string;
}

// ============================================================================
// QUESTIONS MBTI (Version simplifiée - 40 questions au lieu de 93)
// ============================================================================

export const MBTI_QUESTIONS: MBTIQuestion[] = [
  // Dimension E/I (Extraversion/Introversion) - 10 questions
  {
    id: 1,
    texte: "Lors d'une soirée, vous préférez :",
    dimension: 'EI',
    sens: 'A',
  },
  {
    id: 2,
    texte: "A) Parler avec beaucoup de personnes différentes",
    dimension: 'EI',
    sens: 'A',
  },
  {
    id: 3,
    texte: "B) Avoir des conversations profondes avec quelques personnes",
    dimension: 'EI',
    sens: 'B',
  },
  // ... (Continuer avec les 37 autres questions)
  
  // Pour l'exemple, voici une structure complète mais simplifiée
];

// Questions complètes MBTI (40 questions - 10 par dimension)
export const MBTI_QUESTIONS_COMPLETES = [
  // E/I - Extraversion vs Introversion (10 questions)
  { id: 1, texte: "Vous rechargez vos batteries en :", optionA: "Étant avec des gens", optionB: "Passant du temps seul", dimension: 'EI' },
  { id: 2, texte: "Dans un groupe, vous avez tendance à :", optionA: "Prendre la parole facilement", optionB: "Écouter d'abord", dimension: 'EI' },
  { id: 3, texte: "Vous préférez :", optionA: "Avoir un large cercle d'amis", optionB: "Avoir quelques amis proches", dimension: 'EI' },
  { id: 4, texte: "Après une journée chargée, vous :", optionA: "Sortez pour décompresser", optionB: "Restez chez vous pour vous ressourcer", dimension: 'EI' },
  { id: 5, texte: "Vous réfléchissez mieux :", optionA: "En parlant à voix haute", optionB: "Dans votre tête", dimension: 'EI' },
  { id: 6, texte: "Vous êtes plus à l'aise :", optionA: "Au centre de l'attention", optionB: "En retrait", dimension: 'EI' },
  { id: 7, texte: "Vous préférez travailler :", optionA: "En équipe", optionB: "Seul", dimension: 'EI' },
  { id: 8, texte: "Vous êtes énergisé par :", optionA: "Les interactions sociales", optionB: "Le temps en solitaire", dimension: 'EI' },
  { id: 9, texte: "Dans une réunion, vous :", optionA: "Partagez vos idées spontanément", optionB: "Réfléchissez avant de parler", dimension: 'EI' },
  { id: 10, texte: "Vous préférez :", optionA: "Rencontrer de nouvelles personnes", optionB: "Approfondir les relations existantes", dimension: 'EI' },

  // S/N - Sensation vs Intuition (10 questions)
  { id: 11, texte: "Vous faites plus confiance à :", optionA: "Votre expérience pratique", optionB: "Votre intuition", dimension: 'SN' },
  { id: 12, texte: "Vous préférez :", optionA: "Les faits concrets", optionB: "Les possibilités futures", dimension: 'SN' },
  { id: 13, texte: "Vous êtes plus intéressé par :", optionA: "Ce qui est réel et actuel", optionB: "Ce qui pourrait être", dimension: 'SN' },
  { id: 14, texte: "Vous apprenez mieux avec :", optionA: "Des exemples concrets", optionB: "Des concepts théoriques", dimension: 'SN' },
  { id: 15, texte: "Vous êtes plus attiré par :", optionA: "Le pratique et l'utile", optionB: "Le nouveau et l'innovant", dimension: 'SN' },
  { id: 16, texte: "Vous préférez :", optionA: "Suivre des procédures éprouvées", optionB: "Inventer de nouvelles méthodes", dimension: 'SN' },
  { id: 17, texte: "Vous êtes plus :", optionA: "Réaliste", optionB: "Imaginatif", dimension: 'SN' },
  { id: 18, texte: "Vous vous concentrez sur :", optionA: "Les détails", optionB: "La vue d'ensemble", dimension: 'SN' },
  { id: 19, texte: "Vous préférez :", optionA: "L'expérience directe", optionB: "Les théories abstraites", dimension: 'SN' },
  { id: 20, texte: "Vous êtes plus :", optionA: "Pragmatique", optionB: "Visionnaire", dimension: 'SN' },

  // T/F - Pensée vs Sentiment (10 questions)
  { id: 21, texte: "Vous prenez des décisions basées sur :", optionA: "La logique", optionB: "Les valeurs personnelles", dimension: 'TF' },
  { id: 22, texte: "Vous préférez être :", optionA: "Juste", optionB: "Compatissant", dimension: 'TF' },
  { id: 23, texte: "Vous êtes plus :", optionA: "Objectif", optionB: "Subjectif", dimension: 'TF' },
  { id: 24, texte: "Dans un conflit, vous :", optionA: "Analysez les faits", optionB: "Considérez les sentiments", dimension: 'TF' },
  { id: 25, texte: "Vous valorisez plus :", optionA: "La vérité", optionB: "L'harmonie", dimension: 'TF' },
  { id: 26, texte: "Vous êtes plus :", optionA: "Critique", optionB: "Empathique", dimension: 'TF' },
  { id: 27, texte: "Vous préférez :", optionA: "Être cohérent", optionB: "Être accommodant", dimension: 'TF' },
  { id: 28, texte: "Vous êtes plus motivé par :", optionA: "L'efficacité", optionB: "Les relations", dimension: 'TF' },
  { id: 29, texte: "Vous êtes plus :", optionA: "Ferme", optionB: "Doux", dimension: 'TF' },
  { id: 30, texte: "Vous préférez :", optionA: "Analyser", optionB: "Sympathiser", dimension: 'TF' },

  // J/P - Jugement vs Perception (10 questions)
  { id: 31, texte: "Vous préférez :", optionA: "Planifier à l'avance", optionB: "Être spontané", dimension: 'JP' },
  { id: 32, texte: "Vous êtes plus à l'aise avec :", optionA: "Les décisions prises", optionB: "Les options ouvertes", dimension: 'JP' },
  { id: 33, texte: "Vous préférez :", optionA: "Terminer les projets", optionB: "Commencer de nouveaux projets", dimension: 'JP' },
  { id: 34, texte: "Votre espace de travail est :", optionA: "Organisé", optionB: "Flexible", dimension: 'JP' },
  { id: 35, texte: "Vous préférez :", optionA: "Suivre un planning", optionB: "Improviser", dimension: 'JP' },
  { id: 36, texte: "Vous êtes plus :", optionA: "Structuré", optionB: "Adaptable", dimension: 'JP' },
  { id: 37, texte: "Vous préférez :", optionA: "Avoir un plan clair", optionB: "Voir où les choses mènent", dimension: 'JP' },
  { id: 38, texte: "Vous travaillez mieux :", optionA: "Avec des délais", optionB: "Sans pression de temps", dimension: 'JP' },
  { id: 39, texte: "Vous êtes plus :", optionA: "Décisif", optionB: "Exploratoire", dimension: 'JP' },
  { id: 40, texte: "Vous préférez :", optionA: "La routine", optionB: "La variété", dimension: 'JP' },
];

// ============================================================================
// DESCRIPTIONS DES 16 TYPES MBTI
// ============================================================================

export const MBTI_DESCRIPTIONS: Record<string, {
  nom: string;
  description: string;
  forces: string[];
  faiblesses: string[];
  metiersAdaptes: string[];
  styleApprentissage: string;
  styleCommunication: string;
}> = {
  'INTJ': {
    nom: "L'Architecte",
    description: "Stratège imaginatif et perfectionniste, avec un plan pour tout.",
    forces: [
      "Pensée stratégique",
      "Indépendance",
      "Détermination",
      "Vision à long terme",
      "Innovation"
    ],
    faiblesses: [
      "Arrogance",
      "Insensibilité",
      "Trop critique",
      "Difficulté à exprimer les émotions"
    ],
    metiersAdaptes: [
      "Architecte",
      "Ingénieur",
      "Scientifique",
      "Consultant stratégique",
      "Développeur de logiciels"
    ],
    styleApprentissage: "Théorique et conceptuel, préfère comprendre les principes sous-jacents",
    styleCommunication: "Direct et précis, axé sur l'efficacité"
  },
  'INTP': {
    nom: "Le Logicien",
    description: "Penseur innovant avec une soif inextinguible de connaissance.",
    forces: [
      "Analyse logique",
      "Créativité intellectuelle",
      "Ouverture d'esprit",
      "Objectivité"
    ],
    faiblesses: [
      "Insensibilité",
      "Absent-mindedness",
      "Condescendance",
      "Difficulté à terminer les projets"
    ],
    metiersAdaptes: [
      "Chercheur",
      "Philosophe",
      "Mathématicien",
      "Programmeur",
      "Analyste"
    ],
    styleApprentissage: "Exploration autonome, questionnement constant",
    styleCommunication: "Analytique et précis, peut sembler détaché"
  },
  'ENTJ': {
    nom: "Le Commandant",
    description: "Leader audacieux, imaginatif et volontaire, trouvant toujours un chemin.",
    forces: [
      "Leadership naturel",
      "Confiance en soi",
      "Efficacité",
      "Vision stratégique"
    ],
    faiblesses: [
      "Intolérance",
      "Impatience",
      "Arrogance",
      "Insensibilité émotionnelle"
    ],
    metiersAdaptes: [
      "CEO",
      "Entrepreneur",
      "Avocat",
      "Consultant en management",
      "Directeur"
    ],
    styleApprentissage: "Orienté vers les objectifs, apprentissage actif",
    styleCommunication: "Direct et assertif, axé sur les résultats"
  },
  'ENTP': {
    nom: "Le Débatteur",
    description: "Penseur intelligent et curieux qui ne peut résister à un défi intellectuel.",
    forces: [
      "Créativité",
      "Charisme",
      "Énergie",
      "Pensée rapide"
    ],
    faiblesses: [
      "Argumentatif",
      "Intolérant",
      "Difficulté à se concentrer",
      "Insensible"
    ],
    metiersAdaptes: [
      "Entrepreneur",
      "Avocat",
      "Consultant",
      "Inventeur",
      "Marketeur"
    ],
    styleApprentissage: "Exploration de nouvelles idées, débat intellectuel",
    styleCommunication: "Énergique et persuasif, aime le débat"
  },
  // ... (Continuer avec les 12 autres types)
  'INFJ': {
    nom: "L'Avocat",
    description: "Idéaliste calme et mystique, mais inspirant et infatigable.",
    forces: ["Empathie", "Créativité", "Idéalisme", "Détermination"],
    faiblesses: ["Perfectionnisme", "Sensibilité", "Épuisement"],
    metiersAdaptes: ["Psychologue", "Conseiller", "Écrivain", "Coach", "Travailleur social"],
    styleApprentissage: "Réflexif et intuitif",
    styleCommunication: "Empathique et profond"
  },
  'INFP': {
    nom: "Le Médiateur",
    description: "Poétique, gentil et altruiste, toujours désireux d'aider une bonne cause.",
    forces: ["Empathie", "Créativité", "Idéalisme", "Ouverture"],
    faiblesses: ["Trop idéaliste", "Difficulté pratique", "Trop altruiste"],
    metiersAdaptes: ["Écrivain", "Artiste", "Psychologue", "Enseignant", "Conseiller"],
    styleApprentissage: "Personnel et créatif",
    styleCommunication: "Doux et authentique"
  },
  'ENFJ': {
    nom: "Le Protagoniste",
    description: "Leader charismatique et inspirant, capable de captiver leur audience.",
    forces: ["Leadership", "Empathie", "Charisme", "Altruisme"],
    faiblesses: ["Trop idéaliste", "Trop sensible", "Difficulté à prendre des décisions difficiles"],
    metiersAdaptes: ["Enseignant", "Coach", "Conseiller", "Manager RH", "Politicien"],
    styleApprentissage: "Collaboratif et inspirant",
    styleCommunication: "Chaleureux et persuasif"
  },
  'ENFP': {
    nom: "Le Campagneur",
    description: "Enthousiaste, créatif et sociable, trouvant toujours une raison de sourire.",
    forces: ["Enthousiasme", "Créativité", "Sociabilité", "Optimisme"],
    faiblesses: ["Difficulté à se concentrer", "Trop émotionnel", "Stress"],
    metiersAdaptes: ["Journaliste", "Acteur", "Consultant", "Psychologue", "Entrepreneur"],
    styleApprentissage: "Exploratoire et enthousiaste",
    styleCommunication: "Énergique et expressif"
  },
  'ISTJ': {
    nom: "Le Logisticien",
    description: "Pratique et factuel, fiable et responsable.",
    forces: ["Fiabilité", "Organisation", "Pragmatisme", "Honnêteté"],
    faiblesses: ["Rigidité", "Insensibilité", "Jugement"],
    metiersAdaptes: ["Comptable", "Administrateur", "Militaire", "Juge", "Ingénieur"],
    styleApprentissage: "Structuré et pratique",
    styleCommunication: "Clair et factuel"
  },
  'ISFJ': {
    nom: "Le Défenseur",
    description: "Protecteur très dévoué et chaleureux, toujours prêt à défendre leurs proches.",
    forces: ["Fiabilité", "Loyauté", "Pratique", "Sensibilité"],
    faiblesses: ["Trop humble", "Trop altruiste", "Résistance au changement"],
    metiersAdaptes: ["Infirmier", "Enseignant", "Travailleur social", "Bibliothécaire", "Administrateur"],
    styleApprentissage: "Pratique et structuré",
    styleCommunication: "Attentionné et supportif"
  },
  'ESTJ': {
    nom: "L'Exécutif",
    description: "Excellent administrateur, inégalé dans la gestion des choses ou des personnes.",
    forces: ["Organisation", "Leadership", "Honnêteté", "Dévouement"],
    faiblesses: ["Inflexibilité", "Jugement", "Difficulté à exprimer les émotions"],
    metiersAdaptes: ["Manager", "Juge", "Militaire", "Directeur", "Administrateur"],
    styleApprentissage: "Structuré et orienté résultats",
    styleCommunication: "Direct et assertif"
  },
  'ESFJ': {
    nom: "Le Consul",
    description: "Extraordinairement attentionné, social et populaire, toujours désireux d'aider.",
    forces: ["Loyauté", "Sensibilité", "Fiabilité", "Sociabilité"],
    faiblesses: ["Trop altruiste", "Besoin d'approbation", "Rigidité"],
    metiersAdaptes: ["Infirmier", "Enseignant", "Travailleur social", "Manager RH", "Organisateur d'événements"],
    styleApprentissage: "Collaboratif et structuré",
    styleCommunication: "Chaleureux et supportif"
  },
  'ISTP': {
    nom: "Le Virtuose",
    description: "Expérimentateur audacieux et pratique, maître de tous les types d'outils.",
    forces: ["Pratique", "Créativité", "Spontanéité", "Rationalité"],
    faiblesses: ["Insensibilité", "Difficulté à long terme", "Prise de risque"],
    metiersAdaptes: ["Mécanicien", "Ingénieur", "Pilote", "Artisan", "Technicien"],
    styleApprentissage: "Pratique et expérimental",
    styleCommunication: "Direct et factuel"
  },
  'ISFP': {
    nom: "L'Aventurier",
    description: "Artiste flexible et charmant, toujours prêt à explorer et expérimenter.",
    forces: ["Créativité", "Sensibilité", "Passion", "Curiosité"],
    faiblesses: ["Trop compétitif", "Imprévisible", "Difficulté à planifier"],
    metiersAdaptes: ["Artiste", "Musicien", "Designer", "Chef", "Vétérinaire"],
    styleApprentissage: "Expérimental et créatif",
    styleCommunication: "Doux et authentique"
  },
  'ESTP': {
    nom: "L'Entrepreneur",
    description: "Intelligent, énergique et très perceptif, vivant vraiment sur le fil du rasoir.",
    forces: ["Audace", "Rationalité", "Pratique", "Sociabilité"],
    faiblesses: ["Impatience", "Prise de risque", "Insensibilité"],
    metiersAdaptes: ["Entrepreneur", "Vendeur", "Athlète", "Pompier", "Agent de change"],
    styleApprentissage: "Actif et expérimental",
    styleCommunication: "Énergique et direct"
  },
  'ESFP': {
    nom: "L'Amuseur",
    description: "Spontané, énergique et enthousiaste, la vie n'est jamais ennuyeuse autour d'eux.",
    forces: ["Audace", "Pratique", "Sociabilité", "Enthousiasme"],
    faiblesses: ["Sensibilité", "Difficulté à se concentrer", "Difficulté à planifier"],
    metiersAdaptes: ["Acteur", "Musicien", "Organisateur d'événements", "Vendeur", "Photographe"],
    styleApprentissage: "Actif et social",
    styleCommunication: "Énergique et expressif"
  },
};

// ============================================================================
// FONCTION DE CALCUL DU RÉSULTAT MBTI
// ============================================================================

export function calculerResultatMBTI(reponses: MBTIReponse[]): MBTIResultat {
  // Initialiser les scores
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0,
  };

  // Calculer les scores pour chaque dimension
  reponses.forEach(reponse => {
    const question = MBTI_QUESTIONS_COMPLETES.find(q => q.id === reponse.questionId);
    if (!question) return;

    const dimension = question.dimension;
    
    if (dimension === 'EI') {
      if (reponse.choix === 'A') scores.E++;
      else scores.I++;
    } else if (dimension === 'SN') {
      if (reponse.choix === 'A') scores.S++;
      else scores.N++;
    } else if (dimension === 'TF') {
      if (reponse.choix === 'A') scores.T++;
      else scores.F++;
    } else if (dimension === 'JP') {
      if (reponse.choix === 'A') scores.J++;
      else scores.P++;
    }
  });

  // Déterminer le type
  const EI = scores.E > scores.I ? 'E' : 'I';
  const SN = scores.S > scores.N ? 'S' : 'N';
  const TF = scores.T > scores.F ? 'T' : 'F';
  const JP = scores.J > scores.P ? 'J' : 'P';
  
  const type = `${EI}${SN}${TF}${JP}`;
  const description = MBTI_DESCRIPTIONS[type];

  return {
    type,
    dimensions: {
      EI: {
        score: scores.E - scores.I,
        trait: EI,
        pourcentage: Math.round((Math.max(scores.E, scores.I) / 10) * 100),
      },
      SN: {
        score: scores.S - scores.N,
        trait: SN,
        pourcentage: Math.round((Math.max(scores.S, scores.N) / 10) * 100),
      },
      TF: {
        score: scores.T - scores.F,
        trait: TF,
        pourcentage: Math.round((Math.max(scores.T, scores.F) / 10) * 100),
      },
      JP: {
        score: scores.J - scores.P,
        trait: JP,
        pourcentage: Math.round((Math.max(scores.J, scores.P) / 10) * 100),
      },
    },
    description: description.description,
    forces: description.forces,
    faiblesses: description.faiblesses,
    metiersAdaptes: description.metiersAdaptes,
    styleApprentissage: description.styleApprentissage,
    styleCommunication: description.styleCommunication,
  };
}

