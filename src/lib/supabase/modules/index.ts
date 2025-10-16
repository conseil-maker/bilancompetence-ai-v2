/**
 * Export centralisé de tous les modules Supabase
 * Facilite l'importation dans l'application
 */

// Modules de base
export * as profiles from './profiles';
export * as bilans from './bilans';

// Module Compétences
export * as competences from './competences';

// Module Pistes Métiers
export * as pistesMetiers from './pistes-metiers';

// Module Plan d'Action
export * as planAction from './plan-action';

// Module RDV
export * as rdv from './rdv';

// Module Notifications
export * as notifications from './notifications';

// Module Qualiopi
export * as qualiopi from './qualiopi';

// Modules fonctionnels
export * as tests from './tests';
export * as documents from './documents';
export * as messages from './messages';
export * as resources from './resources';
export * as activites from './activites';

// Réexport des types
export type {
  // Base
  Profile,
  Bilan,
  UserRole,
  BilanStatus,
  BilanPhase,
  BilanFinanceur,
  
  // Compétences
  Experience,
  Competence,
  CompetenceExperience,
  ExperienceType,
  CompetenceCategorie,
  CompetenceSource,
  
  // Pistes Métiers
  PisteMetier,
  EcartCompetence,
  Formation,
  FormationEcart,
  PisteMetierSource,
  PisteMetierStatut,
  EcartStatut,
  FormationType,
  FormationStatut,
  
  // Plan d'Action
  PlanAction,
  ActionType,
  ActionStatut,
  
  // RDV
  Rdv,
  NoteEntretien,
  RdvType,
  RdvModalite,
  RdvStatut,
  
  // Notifications
  Notification,
  NotificationType,
  NotificationPriorite,
  
  // Tests
  Test,
  TestType,
  TestStatut,
  
  // Documents
  Document,
  DocumentType,
  
  // Messages
  Message,
  
  // Resources
  Resource,
  ResourceType,
  
  // Activités
  Activite,
  
  // Qualiopi
  EnqueteSatisfaction,
  Reclamation,
  Veille,
  FormationConsultant,
  EnqueteType,
  EnqueteStatut,
  ReclamationType,
  ReclamationGravite,
  ReclamationStatut,
  VeilleType,
  
  // Types génériques
  Inserts,
  Updates,
  Tables,
} from '@/types/database.types';

