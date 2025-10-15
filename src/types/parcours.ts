/**
 * Types pour le parcours de bilan de compétences
 * Conforme aux normes Qualiopi et aux exigences CPF/OPCO
 */

// ============================================================================
// ÉNUMÉRATIONS
// ============================================================================

/**
 * Phases du bilan de compétences selon le Code du travail
 */
export enum PhaseBilan {
  PRELIMINAIRE = 'PRELIMINAIRE',
  INVESTIGATION = 'INVESTIGATION',
  CONCLUSION = 'CONCLUSION',
  SUIVI = 'SUIVI',
}

/**
 * Statut d'une phase du parcours
 */
export enum StatutPhase {
  NON_COMMENCE = 'NON_COMMENCE',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  VALIDE = 'VALIDE',
}

/**
 * Types d'entretiens
 */
export enum TypeEntretien {
  PRELIMINAIRE = 'PRELIMINAIRE',
  INVESTIGATION = 'INVESTIGATION',
  RESTITUTION = 'RESTITUTION',
  SUIVI_6_MOIS = 'SUIVI_6_MOIS',
}

/**
 * Modalités d'entretien
 */
export enum ModaliteEntretien {
  PRESENTIEL = 'PRESENTIEL',
  DISTANCIEL = 'DISTANCIEL',
  TELEPHONE = 'TELEPHONE',
}

/**
 * Types de tests psychométriques
 */
export enum TypeTest {
  MBTI = 'MBTI',
  DISC = 'DISC',
  BIG_FIVE = 'BIG_FIVE',
  RIASEC = 'RIASEC',
  STRONG = 'STRONG',
  PERSONNALITE = 'PERSONNALITE',
  COMPETENCES = 'COMPETENCES',
  MOTIVATIONS = 'MOTIVATIONS',
  VALEURS = 'VALEURS',
}

/**
 * Statut d'un test
 */
export enum StatutTest {
  NON_COMMENCE = 'NON_COMMENCE',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  ANALYSE = 'ANALYSE',
}

/**
 * Types de documents
 */
export enum TypeDocument {
  CONVENTION = 'CONVENTION',
  EMARGEMENT = 'EMARGEMENT',
  ATTESTATION = 'ATTESTATION',
  SYNTHESE = 'SYNTHESE',
  PLAN_ACTION = 'PLAN_ACTION',
  QUESTIONNAIRE_SATISFACTION = 'QUESTIONNAIRE_SATISFACTION',
  CV = 'CV',
  LETTRE_MOTIVATION = 'LETTRE_MOTIVATION',
  AUTRE = 'AUTRE',
}

// ============================================================================
// INTERFACES PRINCIPALES
// ============================================================================

/**
 * Parcours complet de bilan de compétences
 */
export interface ParcoursBilan {
  id: string;
  bilanId: string;
  beneficiaireId: string;
  consultantId: string;
  
  // Dates clés
  dateDebut: Date;
  dateFin?: Date;
  dureeEstimee: number; // en heures
  dureeRealisee: number; // en heures
  
  // Phases
  phaseActuelle: PhaseBilan;
  phases: {
    preliminaire: PhasePreliminaire;
    investigation: PhaseInvestigation;
    conclusion: PhaseConclusion;
    suivi: PhaseSuivi;
  };
  
  // Progression
  progression: number; // 0-100
  etapesCompletees: string[];
  etapesRestantes: string[];
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// PHASE PRÉLIMINAIRE
// ============================================================================

/**
 * Phase préliminaire du bilan
 * Objectif : Analyser la demande, informer sur les conditions de déroulement,
 * définir conjointement les modalités de réalisation
 */
export interface PhasePreliminaire {
  statut: StatutPhase;
  dateDebut?: Date;
  dateFin?: Date;
  duree: number; // en heures
  
  // Entretien préliminaire
  entretienPreliminaire: EntretienPreliminaire;
  
  // Validation
  objectifsValides: boolean;
  conventionSignee: boolean;
  dateSignatureConvention?: Date;
  
  // Documents
  documents: DocumentParcours[];
}

/**
 * Entretien préliminaire
 */
export interface EntretienPreliminaire {
  id: string;
  date: Date;
  duree: number; // en minutes
  modalite: ModaliteEntretien;
  lieu?: string;
  lienVisio?: string;
  
  // Contenu
  motivations: string;
  attentes: string;
  contexte: string;
  situationProfessionnelle: SituationProfessionnelle;
  objectifs: string[];
  contraintes: string[];
  
  // Informations données
  informationsMethodologie: boolean;
  informationsDuree: boolean;
  informationsModalites: boolean;
  informationsConfidentialite: boolean;
  
  // Validation
  beneficiaireAccepte: boolean;
  consultantAccepte: boolean;
  
  // Notes
  notes: string;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Situation professionnelle du bénéficiaire
 */
export interface SituationProfessionnelle {
  statut: 'SALARIE' | 'DEMANDEUR_EMPLOI' | 'INDEPENDANT' | 'AUTRE';
  posteActuel?: string;
  entrepriseActuelle?: string;
  secteurActivite?: string;
  anciennete?: number; // en mois
  niveauEtudes: string;
  diplomes: string[];
  experiencesProfessionnelles: ExperienceProfessionnelle[];
}

/**
 * Expérience professionnelle
 */
export interface ExperienceProfessionnelle {
  id: string;
  poste: string;
  entreprise: string;
  secteur: string;
  dateDebut: Date;
  dateFin?: Date;
  enCours: boolean;
  description: string;
  competences: string[];
  realisations: string[];
}

// ============================================================================
// PHASE D'INVESTIGATION
// ============================================================================

/**
 * Phase d'investigation
 * Objectif : Analyser les compétences, aptitudes et motivations,
 * identifier les possibilités d'évolution professionnelle
 */
export interface PhaseInvestigation {
  statut: StatutPhase;
  dateDebut?: Date;
  dateFin?: Date;
  duree: number; // en heures
  
  // Entretiens
  entretiens: EntretienInvestigation[];
  
  // Tests et évaluations
  tests: TestPsychometrique[];
  evaluationCompetences: EvaluationCompetences;
  
  // Exploration professionnelle
  pistesProfessionnelles: PisteProfessionnelle[];
  metiersExplores: MetierExplore[];
  
  // Analyse
  competencesIdentifiees: Competence[];
  competencesTransferables: Competence[];
  softSkills: string[];
  motivations: string[];
  valeurs: string[];
  
  // Documents
  documents: DocumentParcours[];
}

/**
 * Entretien d'investigation
 */
export interface EntretienInvestigation {
  id: string;
  numero: number;
  date: Date;
  duree: number; // en minutes
  modalite: ModaliteEntretien;
  lieu?: string;
  lienVisio?: string;
  
  // Thématiques abordées
  thematiques: string[];
  
  // Contenu
  objectifSeance: string;
  deroulement: string;
  pointsCles: string[];
  decouvertes: string[];
  
  // Travail intersession
  travailDemande?: string;
  travailRealise?: boolean;
  
  // Notes
  notes: string;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Test psychométrique
 */
export interface TestPsychometrique {
  id: string;
  type: TypeTest;
  nom: string;
  description: string;
  
  // Passation
  statut: StatutTest;
  dateDebut?: Date;
  dateFin?: Date;
  duree: number; // en minutes
  
  // Résultats
  resultats?: any; // Structure dépend du type de test
  interpretation?: string;
  recommandations?: string[];
  
  // Documents
  rapportPDF?: string; // URL du rapport
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Évaluation des compétences
 */
export interface EvaluationCompetences {
  competencesTechniques: Competence[];
  competencesTransversales: Competence[];
  competencesManageriales: Competence[];
  competencesLinguistiques: CompetenceLinguistique[];
  competencesInformatiques: CompetenceInformatique[];
  
  // Auto-évaluation vs évaluation consultant
  autoEvaluation: { [competenceId: string]: number }; // 1-5
  evaluationConsultant: { [competenceId: string]: number }; // 1-5
  
  // Analyse des écarts
  ecarts: EcartCompetence[];
}

/**
 * Compétence
 */
export interface Competence {
  id: string;
  nom: string;
  categorie: string;
  description: string;
  niveau: number; // 1-5
  preuves: string[]; // Exemples de mise en œuvre
  transferable: boolean;
  domaines: string[]; // Domaines d'application
}

/**
 * Compétence linguistique
 */
export interface CompetenceLinguistique {
  langue: string;
  niveauOral: string; // A1, A2, B1, B2, C1, C2
  niveauEcrit: string;
  certification?: string;
}

/**
 * Compétence informatique
 */
export interface CompetenceInformatique {
  outil: string;
  categorie: string; // Bureautique, Programmation, Design, etc.
  niveau: number; // 1-5
}

/**
 * Écart de compétence
 */
export interface EcartCompetence {
  competenceId: string;
  competenceNom: string;
  autoEvaluation: number;
  evaluationConsultant: number;
  ecart: number;
  analyse: string;
}

/**
 * Piste professionnelle
 */
export interface PisteProfessionnelle {
  id: string;
  type: 'EVOLUTION' | 'RECONVERSION' | 'CREATION_ENTREPRISE' | 'FORMATION';
  titre: string;
  description: string;
  
  // Pertinence
  score: number; // 0-100
  adequation: string;
  
  // Faisabilité
  faisabilite: 'IMMEDIATE' | 'COURT_TERME' | 'MOYEN_TERME' | 'LONG_TERME';
  prerequis: string[];
  formationsNecessaires: string[];
  
  // Intérêt
  interesseBeneficiaire: boolean;
  noteInteret: number; // 1-5
  
  // Statut
  statut: 'IDENTIFIEE' | 'EN_EXPLORATION' | 'VALIDEE' | 'ECARTEE';
  raisonEcart?: string;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Métier exploré
 */
export interface MetierExplore {
  id: string;
  codeROME: string;
  intitule: string;
  famille: string;
  
  // Exploration
  dateExploration: Date;
  methodesExploration: string[]; // Enquête métier, immersion, documentation, etc.
  
  // Informations collectées
  missions: string[];
  competencesRequises: string[];
  formationsRequises: string[];
  conditionsTravail: string;
  perspectives: string;
  salaireMoyen?: number;
  
  // Adéquation
  adequationCompetences: number; // 0-100
  adequationMotivations: number; // 0-100
  adequationValeurs: number; // 0-100
  
  // Intérêt
  interesseBeneficiaire: boolean;
  noteInteret: number; // 1-5
  avantages: string[];
  inconvenients: string[];
  
  // Contacts
  personnesRencontrees: Contact[];
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Contact professionnel
 */
export interface Contact {
  nom: string;
  prenom: string;
  poste: string;
  entreprise: string;
  email?: string;
  telephone?: string;
  dateContact: Date;
  typeContact: 'ENQUETE_METIER' | 'IMMERSION' | 'RESEAU' | 'AUTRE';
  notes: string;
}

// ============================================================================
// PHASE DE CONCLUSION
// ============================================================================

/**
 * Phase de conclusion
 * Objectif : Élaborer un projet professionnel, vérifier sa pertinence,
 * prévoir les principales modalités et étapes de sa mise en œuvre
 */
export interface PhaseConclusion {
  statut: StatutPhase;
  dateDebut?: Date;
  dateFin?: Date;
  duree: number; // en heures
  
  // Synthèse
  synthese: SyntheseBilan;
  
  // Projet professionnel
  projetProfessionnel: ProjetProfessionnel;
  
  // Plan d'action
  planAction: PlanAction;
  
  // Entretien de restitution
  entretienRestitution: EntretienRestitution;
  
  // Documents
  documents: DocumentParcours[];
}

/**
 * Synthèse du bilan
 */
export interface SyntheseBilan {
  id: string;
  
  // Parcours
  parcoursRealise: string;
  dureeReelle: number;
  nombreEntretiens: number;
  nombreTests: number;
  
  // Compétences
  competencesCles: Competence[];
  pointsForts: string[];
  axesAmelioration: string[];
  
  // Motivations et valeurs
  motivationsPrincipales: string[];
  valeursPrincipales: string[];
  
  // Projet
  projetRetenu: string;
  alternativesIdentifiees: string[];
  
  // Recommandations
  recommandations: string[];
  
  // Métadonnées
  dateRedaction: Date;
  validePar: string; // ID consultant
  valideParBeneficiaire: boolean;
  dateValidation?: Date;
}

/**
 * Projet professionnel
 */
export interface ProjetProfessionnel {
  id: string;
  type: 'EVOLUTION' | 'RECONVERSION' | 'CREATION_ENTREPRISE' | 'FORMATION';
  titre: string;
  description: string;
  
  // Objectifs
  objectifPrincipal: string;
  objectifsSecondaires: string[];
  
  // Métier(s) visé(s)
  metiersVises: MetierVise[];
  
  // Faisabilité
  atouts: string[];
  freins: string[];
  ressources: string[];
  
  // Temporalité
  echeance: 'COURT_TERME' | 'MOYEN_TERME' | 'LONG_TERME';
  etapesCles: EtapeProjet[];
  
  // Validation
  pertinenceValidee: boolean;
  faisabiliteValidee: boolean;
  motivationValidee: boolean;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Métier visé
 */
export interface MetierVise {
  codeROME: string;
  intitule: string;
  secteur: string;
  adequation: number; // 0-100
  priorite: number; // 1, 2, 3...
}

/**
 * Étape du projet
 */
export interface EtapeProjet {
  id: string;
  ordre: number;
  titre: string;
  description: string;
  echeance: string;
  prerequis: string[];
  ressourcesNecessaires: string[];
  indicateursReussite: string[];
  statut: 'A_FAIRE' | 'EN_COURS' | 'TERMINEE';
}

/**
 * Plan d'action
 */
export interface PlanAction {
  id: string;
  
  // Actions
  actions: ActionPlanAction[];
  
  // Suivi
  dateCreation: Date;
  dateRevision?: Date;
  prochaineSuivi: Date;
  
  // Validation
  validePar: string; // ID consultant
  valideParBeneficiaire: boolean;
  dateValidation?: Date;
}

/**
 * Action du plan d'action
 */
export interface ActionPlanAction {
  id: string;
  ordre: number;
  categorie: 'FORMATION' | 'RECHERCHE_EMPLOI' | 'RESEAU' | 'CREATION_ENTREPRISE' | 'AUTRE';
  titre: string;
  description: string;
  
  // Temporalité
  echeance: Date;
  dureeEstimee?: number; // en jours
  
  // Détails
  etapes: string[];
  ressources: string[];
  contacts: Contact[];
  
  // Suivi
  statut: 'A_FAIRE' | 'EN_COURS' | 'TERMINEE' | 'REPORTEE' | 'ANNULEE';
  progression: number; // 0-100
  dateDebut?: Date;
  dateFin?: Date;
  
  // Notes
  notes: string;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entretien de restitution
 */
export interface EntretienRestitution {
  id: string;
  date: Date;
  duree: number; // en minutes
  modalite: ModaliteEntretien;
  lieu?: string;
  lienVisio?: string;
  
  // Contenu
  synthesePresentee: boolean;
  projetPresenté: boolean;
  planActionPresente: boolean;
  
  // Échanges
  questionsbeneficiaire: string[];
  reponsesConsultant: string[];
  pointsDebat: string[];
  
  // Validation
  beneficiaireSatisfait: boolean;
  beneficiaireAccepte: boolean;
  documentRemis: boolean;
  
  // Questionnaire de satisfaction
  questionnaireSatisfaction?: QuestionnaireSatisfaction;
  
  // Notes
  notes: string;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Questionnaire de satisfaction
 */
export interface QuestionnaireSatisfaction {
  id: string;
  dateRemplissage: Date;
  
  // Satisfaction globale
  satisfactionGlobale: number; // 1-5
  
  // Détails
  satisfactionAccueil: number; // 1-5
  satisfactionMethodologie: number; // 1-5
  satisfactionConsultant: number; // 1-5
  satisfactionOutils: number; // 1-5
  satisfactionResultats: number; // 1-5
  
  // Objectifs
  objectifsAtteints: boolean;
  objectifsPartiel?: string;
  
  // Recommandation
  recommanderaitService: boolean;
  
  // Commentaires
  pointsForts: string;
  axesAmelioration: string;
  commentairesLibres: string;
  
  // Autorisation
  autorisationTemoignage: boolean;
  autorisationContact: boolean;
}

// ============================================================================
// PHASE DE SUIVI
// ============================================================================

/**
 * Phase de suivi (6 mois après)
 * Objectif : Vérifier la mise en œuvre du projet professionnel
 */
export interface PhaseSuivi {
  statut: StatutPhase;
  datePrevue: Date;
  dateRealisee?: Date;
  
  // Entretien de suivi
  entretienSuivi?: EntretienSuivi;
  
  // Enquête à froid
  enqueteFroid?: EnqueteFroid;
  
  // Documents
  documents: DocumentParcours[];
}

/**
 * Entretien de suivi à 6 mois
 */
export interface EntretienSuivi {
  id: string;
  date: Date;
  duree: number; // en minutes
  modalite: ModaliteEntretien;
  lieu?: string;
  lienVisio?: string;
  
  // Situation actuelle
  situationActuelle: string;
  projetMisEnOeuvre: boolean;
  etapeRealisees: string[];
  difficultes: string[];
  
  // Évolution
  changementsSituation: string;
  nouvellesOpportunites: string[];
  besoinAccompagnement: boolean;
  typeAccompagnement?: string;
  
  // Satisfaction
  satisfactionParcours: number; // 1-5
  utilitePercue: number; // 1-5
  
  // Notes
  notes: string;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Enquête à froid (6 mois)
 */
export interface EnqueteFroid {
  id: string;
  dateEnvoi: Date;
  dateReponse?: Date;
  repondu: boolean;
  
  // Situation professionnelle
  situationActuelle: 'EMPLOI' | 'FORMATION' | 'RECHERCHE' | 'CREATION_ENTREPRISE' | 'AUTRE';
  detailsSituation: string;
  
  // Projet
  projetRealise: boolean;
  tauxRealisation: number; // 0-100
  
  // Impact du bilan
  impactCarriere: number; // 1-5
  impactConfiance: number; // 1-5
  impactClarte: number; // 1-5
  
  // Recommandation
  recommanderaitService: boolean;
  
  // Commentaires
  commentaires: string;
}

// ============================================================================
// DOCUMENTS
// ============================================================================

/**
 * Document du parcours
 */
export interface DocumentParcours {
  id: string;
  type: TypeDocument;
  nom: string;
  description?: string;
  
  // Fichier
  url: string;
  mimeType: string;
  taille: number; // en bytes
  
  // Signature
  requireSignature: boolean;
  signePar?: string[]; // IDs des signataires
  dateSignature?: Date;
  
  // Métadonnées
  uploadePar: string; // ID utilisateur
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TYPES UTILITAIRES
// ============================================================================

/**
 * Événement du parcours (pour la timeline)
 */
export interface EvenementParcours {
  id: string;
  type: 'ENTRETIEN' | 'TEST' | 'DOCUMENT' | 'VALIDATION' | 'AUTRE';
  titre: string;
  description: string;
  date: Date;
  phase: PhaseBilan;
  important: boolean;
  icone?: string;
}

/**
 * Notification du parcours
 */
export interface NotificationParcours {
  id: string;
  destinataire: string; // ID utilisateur
  type: 'RAPPEL' | 'VALIDATION' | 'DOCUMENT' | 'MESSAGE';
  titre: string;
  message: string;
  lien?: string;
  lue: boolean;
  dateEnvoi: Date;
  dateLecture?: Date;
}

/**
 * Statistiques du parcours
 */
export interface StatistiquesParcours {
  dureeReelle: number; // en heures
  nombreEntretiens: number;
  nombreTests: number;
  nombreDocuments: number;
  tauxCompletion: number; // 0-100
  satisfactionGlobale?: number; // 1-5
}

