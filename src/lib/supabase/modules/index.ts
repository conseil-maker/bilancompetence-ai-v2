/**
 * Export centralisé de tous les modules Supabase
 * Facilite l'importation dans l'application
 */

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

// Réexport des types
export type {
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

