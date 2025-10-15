// ============================================================================
// TEST RIASEC (Holland Code - Realistic, Investigative, Artistic, Social, Enterprising, Conventional)
// ============================================================================

export interface RIASECQuestion {
  id: number;
  texte: string;
  dimension: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
}

export interface RIASECReponse {
  questionId: number;
  interesse: boolean; // true = intéressé, false = pas intéressé
}

export interface RIASECResultat {
  code: string; // Ex: "RIA" (3 lettres dominantes)
  scores: {
    R: { score: number; pourcentage: number };
    I: { score: number; pourcentage: number };
    A: { score: number; pourcentage: number };
    S: { score: number; pourcentage: number };
    E: { score: number; pourcentage: number };
    C: { score: number; pourcentage: number };
  };
  description: string;
  interets: string[];
  environnementsTravail: string[];
  metiersAdaptes: string[];
  formations: string[];
}

// ============================================================================
// QUESTIONS RIASEC (60 questions - 10 par dimension)
// ============================================================================

export const RIASEC_QUESTIONS: RIASECQuestion[] = [
  // Realistic (Réaliste) - 10 questions
  { id: 1, texte: "Réparer des appareils électroniques ou mécaniques", dimension: 'R' },
  { id: 2, texte: "Travailler avec des outils et des machines", dimension: 'R' },
  { id: 3, texte: "Construire ou assembler des objets", dimension: 'R' },
  { id: 4, texte: "Travailler en extérieur", dimension: 'R' },
  { id: 5, texte: "Conduire des véhicules ou des engins", dimension: 'R' },
  { id: 6, texte: "Faire du travail physique", dimension: 'R' },
  { id: 7, texte: "Travailler avec les mains", dimension: 'R' },
  { id: 8, texte: "Installer ou réparer des équipements", dimension: 'R' },
  { id: 9, texte: "Faire de l'agriculture ou de l'élevage", dimension: 'R' },
  { id: 10, texte: "Pratiquer des activités sportives", dimension: 'R' },

  // Investigative (Investigateur) - 10 questions
  { id: 11, texte: "Faire de la recherche scientifique", dimension: 'I' },
  { id: 12, texte: "Analyser des données ou des statistiques", dimension: 'I' },
  { id: 13, texte: "Résoudre des problèmes complexes", dimension: 'I' },
  { id: 14, texte: "Faire des expériences en laboratoire", dimension: 'I' },
  { id: 15, texte: "Étudier des théories scientifiques", dimension: 'I' },
  { id: 16, texte: "Programmer ou développer des logiciels", dimension: 'I' },
  { id: 17, texte: "Faire des calculs mathématiques", dimension: 'I' },
  { id: 18, texte: "Lire des publications scientifiques", dimension: 'I' },
  { id: 19, texte: "Observer et analyser des phénomènes", dimension: 'I' },
  { id: 20, texte: "Développer de nouvelles théories", dimension: 'I' },

  // Artistic (Artistique) - 10 questions
  { id: 21, texte: "Créer des œuvres d'art (peinture, sculpture)", dimension: 'A' },
  { id: 22, texte: "Écrire des histoires, poèmes ou articles", dimension: 'A' },
  { id: 23, texte: "Jouer d'un instrument de musique", dimension: 'A' },
  { id: 24, texte: "Concevoir des designs graphiques", dimension: 'A' },
  { id: 25, texte: "Faire du théâtre ou de la danse", dimension: 'A' },
  { id: 26, texte: "Décorer ou aménager des espaces", dimension: 'A' },
  { id: 27, texte: "Créer des contenus vidéo ou photo", dimension: 'A' },
  { id: 28, texte: "Composer de la musique", dimension: 'A' },
  { id: 29, texte: "Exprimer votre créativité librement", dimension: 'A' },
  { id: 30, texte: "Travailler dans la mode ou le stylisme", dimension: 'A' },

  // Social - 10 questions
  { id: 31, texte: "Aider les gens à résoudre leurs problèmes", dimension: 'S' },
  { id: 32, texte: "Enseigner ou former des personnes", dimension: 'S' },
  { id: 33, texte: "Soigner ou prendre soin des autres", dimension: 'S' },
  { id: 34, texte: "Conseiller ou guider les gens", dimension: 'S' },
  { id: 35, texte: "Travailler avec des enfants", dimension: 'S' },
  { id: 36, texte: "Organiser des événements communautaires", dimension: 'S' },
  { id: 37, texte: "Écouter et soutenir les personnes en difficulté", dimension: 'S' },
  { id: 38, texte: "Travailler dans le domaine social", dimension: 'S' },
  { id: 39, texte: "Animer des groupes ou des ateliers", dimension: 'S' },
  { id: 40, texte: "Aider au développement personnel des autres", dimension: 'S' },

  // Enterprising (Entreprenant) - 10 questions
  { id: 41, texte: "Diriger ou manager une équipe", dimension: 'E' },
  { id: 42, texte: "Vendre des produits ou services", dimension: 'E' },
  { id: 43, texte: "Créer ou gérer une entreprise", dimension: 'E' },
  { id: 44, texte: "Négocier des contrats ou accords", dimension: 'E' },
  { id: 45, texte: "Convaincre et persuader les gens", dimension: 'E' },
  { id: 46, texte: "Prendre des décisions importantes", dimension: 'E' },
  { id: 47, texte: "Développer des stratégies commerciales", dimension: 'E' },
  { id: 48, texte: "Faire du marketing ou de la publicité", dimension: 'E' },
  { id: 49, texte: "Organiser et coordonner des projets", dimension: 'E' },
  { id: 50, texte: "Prendre des risques calculés", dimension: 'E' },

  // Conventional (Conventionnel) - 10 questions
  { id: 51, texte: "Organiser et classer des documents", dimension: 'C' },
  { id: 52, texte: "Tenir des comptes ou faire de la comptabilité", dimension: 'C' },
  { id: 53, texte: "Suivre des procédures établies", dimension: 'C' },
  { id: 54, texte: "Gérer des bases de données", dimension: 'C' },
  { id: 55, texte: "Faire du travail administratif", dimension: 'C' },
  { id: 56, texte: "Vérifier l'exactitude des informations", dimension: 'C' },
  { id: 57, texte: "Utiliser des logiciels de bureautique", dimension: 'C' },
  { id: 58, texte: "Planifier et organiser des tâches", dimension: 'C' },
  { id: 59, texte: "Respecter des règles et des normes", dimension: 'C' },
  { id: 60, texte: "Gérer des stocks ou des inventaires", dimension: 'C' },
];

// ============================================================================
// DESCRIPTIONS DES TYPES RIASEC
// ============================================================================

export const RIASEC_DESCRIPTIONS = {
  R: {
    nom: "Réaliste",
    description: "Préfère les activités concrètes, pratiques et manuelles. Aime travailler avec des objets, des outils, des machines ou des animaux.",
    interets: [
      "Activités physiques et manuelles",
      "Mécanique et technologie",
      "Construction et réparation",
      "Travail en extérieur",
      "Sports et activités pratiques"
    ],
    environnementsTravail: [
      "Ateliers",
      "Chantiers",
      "Laboratoires techniques",
      "Extérieur",
      "Usines"
    ],
    metiers: [
      "Mécanicien",
      "Électricien",
      "Agriculteur",
      "Pilote",
      "Ingénieur civil",
      "Technicien",
      "Charpentier",
      "Plombier",
      "Vétérinaire",
      "Chef cuisinier"
    ],
    formations: [
      "BTS Maintenance",
      "CAP Électricité",
      "Licence Génie civil",
      "Formation technique",
      "École d'ingénieurs"
    ]
  },
  I: {
    nom: "Investigateur",
    description: "Préfère les activités intellectuelles, analytiques et scientifiques. Aime observer, apprendre, analyser et résoudre des problèmes.",
    interets: [
      "Sciences et recherche",
      "Analyse et résolution de problèmes",
      "Mathématiques et statistiques",
      "Technologie et programmation",
      "Théories et concepts abstraits"
    ],
    environnementsTravail: [
      "Laboratoires",
      "Centres de recherche",
      "Universités",
      "Bureaux d'études",
      "Entreprises tech"
    ],
    metiers: [
      "Chercheur",
      "Scientifique",
      "Médecin",
      "Pharmacien",
      "Ingénieur",
      "Analyste de données",
      "Développeur",
      "Mathématicien",
      "Biologiste",
      "Chimiste"
    ],
    formations: [
      "Doctorat",
      "Master scientifique",
      "École d'ingénieurs",
      "Médecine",
      "Informatique"
    ]
  },
  A: {
    nom: "Artistique",
    description: "Préfère les activités créatives, expressives et esthétiques. Aime créer, innover et s'exprimer à travers l'art.",
    interets: [
      "Arts visuels et plastiques",
      "Musique et spectacle",
      "Écriture et littérature",
      "Design et création",
      "Expression personnelle"
    ],
    environnementsTravail: [
      "Ateliers d'artistes",
      "Studios",
      "Agences créatives",
      "Théâtres",
      "Galeries"
    ],
    metiers: [
      "Artiste",
      "Designer graphique",
      "Musicien",
      "Écrivain",
      "Acteur",
      "Photographe",
      "Architecte",
      "Styliste",
      "Décorateur d'intérieur",
      "Réalisateur"
    ],
    formations: [
      "École d'art",
      "Conservatoire",
      "Beaux-Arts",
      "Design graphique",
      "Architecture"
    ]
  },
  S: {
    nom: "Social",
    description: "Préfère les activités d'aide, d'enseignement et de soin aux autres. Aime travailler avec les gens pour les aider, les former ou les soigner.",
    interets: [
      "Aide et soutien aux personnes",
      "Enseignement et formation",
      "Santé et soins",
      "Développement personnel",
      "Relations humaines"
    ],
    environnementsTravail: [
      "Écoles",
      "Hôpitaux",
      "Centres sociaux",
      "Cabinets de conseil",
      "Associations"
    ],
    metiers: [
      "Enseignant",
      "Infirmier",
      "Psychologue",
      "Travailleur social",
      "Conseiller",
      "Éducateur",
      "Coach",
      "Formateur",
      "Ergothérapeute",
      "Orthophoniste"
    ],
    formations: [
      "Sciences de l'éducation",
      "Psychologie",
      "Soins infirmiers",
      "Travail social",
      "Coaching"
    ]
  },
  E: {
    nom: "Entreprenant",
    description: "Préfère les activités de leadership, de vente et de persuasion. Aime diriger, influencer, convaincre et prendre des risques.",
    interets: [
      "Leadership et management",
      "Vente et négociation",
      "Entrepreneuriat",
      "Stratégie et décision",
      "Influence et persuasion"
    ],
    environnementsTravail: [
      "Bureaux d'entreprise",
      "Commerces",
      "Agences",
      "Startups",
      "Organisations"
    ],
    metiers: [
      "Manager",
      "Commercial",
      "Entrepreneur",
      "Consultant",
      "Directeur",
      "Avocat",
      "Agent immobilier",
      "Responsable marketing",
      "Chef d'entreprise",
      "Politicien"
    ],
    formations: [
      "École de commerce",
      "MBA",
      "Management",
      "Marketing",
      "Droit des affaires"
    ]
  },
  C: {
    nom: "Conventionnel",
    description: "Préfère les activités structurées, organisées et précises. Aime travailler avec des données, des chiffres et suivre des procédures établies.",
    interets: [
      "Organisation et planification",
      "Gestion de données",
      "Comptabilité et finance",
      "Administration",
      "Respect des procédures"
    ],
    environnementsTravail: [
      "Bureaux",
      "Banques",
      "Administrations",
      "Cabinets comptables",
      "Services administratifs"
    ],
    metiers: [
      "Comptable",
      "Secrétaire",
      "Administrateur",
      "Contrôleur de gestion",
      "Banquier",
      "Archiviste",
      "Assistant administratif",
      "Gestionnaire",
      "Auditeur",
      "Analyste financier"
    ],
    formations: [
      "Comptabilité",
      "Gestion",
      "Administration",
      "Finance",
      "Secrétariat"
    ]
  },
};

// Codes Holland combinés (les plus courants)
export const RIASEC_CODES_COMBINES = {
  "RIA": { nom: "Le Créateur Technique", description: "Combine compétences techniques, analyse et créativité" },
  "RIE": { nom: "L'Innovateur Pratique", description: "Entrepreneur technique orienté innovation" },
  "RIC": { nom: "Le Technicien Précis", description: "Excellence technique avec rigueur méthodologique" },
  "IAS": { nom: "Le Chercheur Humaniste", description: "Recherche scientifique au service de l'humain" },
  "IAE": { nom: "L'Innovateur Stratégique", description: "Combine analyse, créativité et entrepreneuriat" },
  "IAC": { nom: "Le Scientifique Créatif", description: "Recherche rigoureuse avec approche créative" },
  "ASE": { nom: "Le Leader Créatif", description: "Leadership inspirant avec vision artistique" },
  "ASI": { nom: "Le Thérapeute Créatif", description: "Aide aux personnes avec approche créative" },
  "SEC": { nom: "Le Manager Organisé", description: "Leadership avec excellence organisationnelle" },
  "SEI": { nom: "Le Consultant Expert", description: "Conseil stratégique basé sur l'expertise" },
  "ECS": { nom: "Le Manager RH", description: "Leadership orienté personnes et organisation" },
  "ECI": { nom: "Le Consultant Analytique", description: "Conseil basé sur l'analyse et les données" },
};

// ============================================================================
// FONCTION DE CALCUL DU RÉSULTAT RIASEC
// ============================================================================

export function calculerResultatRIASEC(reponses: RIASECReponse[]): RIASECResultat {
  // Initialiser les scores
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  // Calculer les scores
  reponses.forEach(reponse => {
    const question = RIASEC_QUESTIONS.find(q => q.id === reponse.questionId);
    if (!question) return;

    if (reponse.interesse) {
      scores[question.dimension]++;
    }
  });

  // Calculer les pourcentages
  const maxScore = 10; // 10 questions par dimension
  const pourcentages = {
    R: Math.round((scores.R / maxScore) * 100),
    I: Math.round((scores.I / maxScore) * 100),
    A: Math.round((scores.A / maxScore) * 100),
    S: Math.round((scores.S / maxScore) * 100),
    E: Math.round((scores.E / maxScore) * 100),
    C: Math.round((scores.C / maxScore) * 100),
  };

  // Déterminer le code Holland (3 lettres dominantes)
  const sortedDimensions = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .map(([dim]) => dim);
  
  const code = sortedDimensions.slice(0, 3).join('');

  // Obtenir la description du code combiné ou de la dimension principale
  const codeDescription = RIASEC_CODES_COMBINES[code as keyof typeof RIASEC_CODES_COMBINES];
  const dimensionPrincipale = RIASEC_DESCRIPTIONS[sortedDimensions[0] as keyof typeof RIASEC_DESCRIPTIONS];

  // Compiler les métiers adaptés des 3 dimensions principales
  const metiersAdaptes: string[] = [];
  const formations: string[] = [];
  const interets: string[] = [];
  const environnementsTravail: string[] = [];

  sortedDimensions.slice(0, 3).forEach(dim => {
    const desc = RIASEC_DESCRIPTIONS[dim as keyof typeof RIASEC_DESCRIPTIONS];
    metiersAdaptes.push(...desc.metiers);
    formations.push(...desc.formations);
    interets.push(...desc.interets);
    environnementsTravail.push(...desc.environnementsTravail);
  });

  return {
    code,
    scores: {
      R: { score: scores.R, pourcentage: pourcentages.R },
      I: { score: scores.I, pourcentage: pourcentages.I },
      A: { score: scores.A, pourcentage: pourcentages.A },
      S: { score: scores.S, pourcentage: pourcentages.S },
      E: { score: scores.E, pourcentage: pourcentages.E },
      C: { score: scores.C, pourcentage: pourcentages.C },
    },
    description: codeDescription 
      ? `${codeDescription.nom} - ${codeDescription.description}`
      : dimensionPrincipale.description,
    interets: [...new Set(interets)].slice(0, 10),
    environnementsTravail: [...new Set(environnementsTravail)].slice(0, 8),
    metiersAdaptes: [...new Set(metiersAdaptes)].slice(0, 15),
    formations: [...new Set(formations)].slice(0, 10),
  };
}

