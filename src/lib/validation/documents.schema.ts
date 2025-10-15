import { z } from 'zod';

// ============================================================================
// SCHÉMAS DE BASE
// ============================================================================

export const AdresseSchema = z.object({
  rue: z.string().min(1, 'La rue est requise'),
  codePostal: z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres requis)'),
  ville: z.string().min(1, 'La ville est requise'),
  pays: z.string().default('France'),
});

export const PersonneSchema = z.object({
  id: z.string().uuid(),
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.string().email('Email invalide').optional(),
  telephone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, 'Téléphone invalide').optional(),
});

export const BeneficiaireSchema = PersonneSchema.extend({
  dateNaissance: z.string().datetime(),
  adresse: AdresseSchema.optional(),
});

export const ConsultantSchema = PersonneSchema.extend({
  qualifications: z.array(z.string()).optional(),
});

export const OrganismeSchema = z.object({
  id: z.string().uuid(),
  nom: z.string().min(1, 'Le nom de l\'organisme est requis'),
  siret: z.string().regex(/^\d{14}$/, 'SIRET invalide (14 chiffres requis)'),
  numeroDeclarationActivite: z.string().min(1, 'Le numéro de déclaration d\'activité est requis'),
  numeroQualiopi: z.string().min(1, 'Le numéro Qualiopi est requis'),
  dateValiditeQualiopi: z.string().datetime().optional(),
  adresse: AdresseSchema,
  contact: z.object({
    nom: z.string().min(1),
    prenom: z.string().min(1),
    email: z.string().email(),
    telephone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/),
  }).optional(),
});

// ============================================================================
// SCHÉMA: CONVENTION DE BILAN
// ============================================================================

export const PeriodeSchema = z.object({
  dateDebut: z.string().datetime(),
  dateFin: z.string().datetime(),
  dureeHeures: z.number().min(20, 'Durée minimale: 20 heures').max(30, 'Durée maximale: 30 heures'),
  modalites: z.array(z.enum(['PRESENTIEL', 'DISTANCIEL', 'MIXTE'])),
});

export const PhaseSchema = z.object({
  nom: z.string().min(1),
  description: z.string().min(1),
  dureeHeures: z.number().positive(),
  activites: z.array(z.string()),
});

export const FinanceurSchema = z.object({
  type: z.enum(['CPF', 'OPCO', 'POLE_EMPLOI', 'ENTREPRISE', 'PERSONNEL']),
  nom: z.string().min(1),
  montantPrisEnCharge: z.number().nonnegative().optional(),
  numeroAgreement: z.string().optional(),
});

export const ConventionBilanSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('CONVENTION_BILAN'),
  statut: z.enum(['BROUILLON', 'EN_ATTENTE', 'VALIDE', 'REFUSE']),
  dateCreation: z.string().datetime(),
  dateModification: z.string().datetime(),
  versionNumber: z.number().int().positive(),
  
  beneficiaire: BeneficiaireSchema,
  consultant: ConsultantSchema,
  organisme: OrganismeSchema,
  
  periode: PeriodeSchema,
  objectifs: z.array(z.string()).min(1, 'Au moins un objectif est requis'),
  phases: z.array(PhaseSchema).length(3, 'Exactement 3 phases requises'),
  
  financeur: FinanceurSchema,
  conditionsParticulieres: z.array(z.string()).optional(),
  
  signatures: z.object({
    beneficiaire: z.string().nullable(),
    consultant: z.string().nullable(),
    organisme: z.string().nullable(),
  }),
  
  mentionsLegales: z.object({
    confidentialite: z.boolean(),
    droitRetractation: z.boolean(),
    protectionDonnees: z.boolean(),
  }),
});

// ============================================================================
// SCHÉMA: FEUILLE D'ÉMARGEMENT
// ============================================================================

export const ParticipantEmargementSchema = z.object({
  id: z.string().uuid(),
  nom: z.string().min(1),
  prenom: z.string().min(1),
  signatureArrivee: z.string().nullable(),
  signatureDepart: z.string().nullable(),
  heureArrivee: z.string().datetime().nullable(),
  heureDepart: z.string().datetime().nullable(),
});

export const SeanceSchema = z.object({
  numero: z.number().int().positive(),
  date: z.string().datetime(),
  heureDebut: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format heure invalide (HH:MM)'),
  heureFin: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format heure invalide (HH:MM)'),
  dureeMinutes: z.number().int().positive(),
  theme: z.string().min(1),
  phase: z.enum(['PRELIMINAIRE', 'INVESTIGATION', 'CONCLUSION', 'SUIVI']),
  modalite: z.enum(['PRESENTIEL', 'DISTANCIEL']),
  lieu: z.string().optional(),
});

export const ContenuSeanceSchema = z.object({
  objectifs: z.array(z.string()).min(1),
  activites: z.array(z.string()).min(1),
  methodesUtilisees: z.array(z.string()),
  documentsRemis: z.array(z.string()).optional(),
  observations: z.string().optional(),
});

export const FeuilleEmargementSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('FEUILLE_EMARGEMENT'),
  statut: z.enum(['BROUILLON', 'EN_ATTENTE', 'VALIDE']),
  dateCreation: z.string().datetime(),
  dateModification: z.string().datetime(),
  versionNumber: z.number().int().positive(),
  
  beneficiaire: ParticipantEmargementSchema,
  consultant: ParticipantEmargementSchema,
  seance: SeanceSchema,
  contenu: ContenuSeanceSchema,
});

// ============================================================================
// SCHÉMA: DOCUMENT DE SYNTHÈSE
// ============================================================================

export const IntroductionSchema = z.object({
  contexte: z.string().min(50, 'Le contexte doit contenir au moins 50 caractères'),
  motivations: z.string().min(50, 'Les motivations doivent contenir au moins 50 caractères'),
  objectifs: z.array(z.string()).min(1),
});

export const ParcoursPhaseSchema = z.object({
  dureeHeures: z.number().positive(),
  activitesRealisees: z.array(z.string()),
  testsRealises: z.array(z.string()).optional(),
  competencesIdentifiees: z.array(z.string()).optional(),
  pistesExplorees: z.array(z.string()).optional(),
  resultats: z.string().optional(),
  syntheseRealisee: z.boolean().optional(),
  projetDefini: z.boolean().optional(),
});

export const SyntheseContenuSchema = z.object({
  texte: z.string().min(300, 'La synthèse doit contenir au moins 300 caractères'),
  pointsForts: z.array(z.string()).min(3, 'Au moins 3 points forts requis'),
  competencesCles: z.array(z.string()).min(5, 'Au moins 5 compétences clés requises'),
});

export const ProjetProfessionnelSchema = z.object({
  type: z.enum(['EVOLUTION', 'RECONVERSION', 'CREATION_ENTREPRISE', 'FORMATION', 'NON_DEFINI']),
  description: z.string().min(100, 'La description doit contenir au moins 100 caractères'),
  objectifs: z.array(z.string()).min(1),
  echeance: z.string().min(1),
  moyensNecessaires: z.array(z.string()),
});

export const PlanActionSchema = z.object({
  actions: z.array(z.object({
    titre: z.string().min(1),
    description: z.string().min(1),
    echeance: z.string().min(1),
    priorite: z.enum(['HAUTE', 'MOYENNE', 'BASSE']),
    categorie: z.enum(['FORMATION', 'RECHERCHE_EMPLOI', 'RESEAU', 'CERTIFICATION', 'AUTRE']),
    statut: z.enum(['A_FAIRE', 'EN_COURS', 'TERMINE']),
  })).min(3, 'Au moins 3 actions requises'),
  priorites: z.array(z.string()),
  ressources: z.array(z.string()),
});

export const DocumentSyntheseSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('DOCUMENT_SYNTHESE'),
  statut: z.enum(['BROUILLON', 'VALIDE']),
  dateCreation: z.string().datetime(),
  dateModification: z.string().datetime(),
  versionNumber: z.number().int().positive(),
  
  beneficiaire: BeneficiaireSchema,
  consultant: ConsultantSchema,
  organisme: z.object({
    id: z.string().uuid(),
    nom: z.string().min(1),
  }),
  
  periode: z.object({
    dateDebut: z.string().datetime(),
    dateFin: z.string().datetime(),
    dureeHeures: z.number().positive(),
  }),
  
  contenu: z.object({
    introduction: IntroductionSchema,
    parcours: z.object({
      phasePreliminaire: ParcoursPhaseSchema,
      phaseInvestigation: ParcoursPhaseSchema,
      phaseConclusion: ParcoursPhaseSchema,
    }),
    synthese: SyntheseContenuSchema,
    projetProfessionnel: ProjetProfessionnelSchema,
    planAction: PlanActionSchema,
    recommandations: z.array(z.string()).min(3, 'Au moins 3 recommandations requises'),
    conclusion: z.string().min(100, 'La conclusion doit contenir au moins 100 caractères'),
  }),
  
  confidentialite: z.object({
    proprietaire: z.enum(['BENEFICIAIRE', 'ORGANISME']),
    diffusionAutorisee: z.boolean(),
    archivageDuree: z.number().int().positive(),
  }),
});

// ============================================================================
// SCHÉMA: ATTESTATION DE FIN DE FORMATION
// ============================================================================

export const FormationSchema = z.object({
  intitule: z.string().min(1),
  codeCPF: z.string().min(1),
  dateDebut: z.string().datetime(),
  dateFin: z.string().datetime(),
  dureeHeures: z.number().positive(),
  modalites: z.array(z.enum(['Présentiel', 'Distanciel'])),
});

export const PhaseRealiseeSchema = z.object({
  nom: z.string().min(1),
  dureeHeures: z.number().positive(),
  objectifs: z.array(z.string()),
  realise: z.boolean(),
});

export const AssiduitéSchema = z.object({
  tauxPresence: z.number().min(0).max(100),
  nombreSeancesPrevu: z.number().int().positive(),
  nombreSeancesRealise: z.number().int().nonnegative(),
  observations: z.string().optional(),
});

export const SignatureSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  fonction: z.string().min(1),
  date: z.string().datetime(),
});

export const AttestationFinFormationSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('ATTESTATION_FIN_FORMATION'),
  statut: z.literal('VALIDE'),
  dateCreation: z.string().datetime(),
  dateModification: z.string().datetime(),
  versionNumber: z.number().int().positive(),
  
  numeroAttestation: z.string().min(1),
  
  beneficiaire: BeneficiaireSchema,
  consultant: ConsultantSchema,
  organisme: OrganismeSchema,
  
  formation: FormationSchema,
  phases: z.array(PhaseRealiseeSchema).length(3),
  assiduite: AssiduitéSchema,
  
  dateEmission: z.string().datetime(),
  signature: SignatureSchema,
});

// ============================================================================
// SCHÉMA: CERTIFICAT DE RÉALISATION
// ============================================================================

export const ActionFormationSchema = z.object({
  intitule: z.string().min(1),
  codeCPF: z.string().min(1),
  categorie: z.string().min(1),
  dateDebut: z.string().datetime(),
  dateFin: z.string().datetime(),
  dureeHeures: z.number().positive(),
  modalites: z.array(z.string()),
});

export const RealisationSchema = z.object({
  dateDebut: z.string().datetime(),
  dateFin: z.string().datetime(),
  dureeRealisee: z.number().positive(),
  tauxRealisation: z.number().min(0).max(100),
  assiduite: z.string().min(1),
});

export const FinanceurCertificatSchema = z.object({
  type: z.enum(['CPF', 'OPCO', 'POLE_EMPLOI', 'ENTREPRISE', 'PERSONNEL']),
  nom: z.string().min(1),
  montantPrisEnCharge: z.number().nonnegative(),
});

export const ReferencesLegalesSchema = z.object({
  articleCodeTravail: z.string().min(1),
  certificationQualiopi: z.string().min(1),
  numeroDeclarationActivite: z.string().min(1),
});

export const CertificatRealisationSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('CERTIFICAT_REALISATION'),
  statut: z.literal('VALIDE'),
  dateCreation: z.string().datetime(),
  dateModification: z.string().datetime(),
  versionNumber: z.number().int().positive(),
  
  numeroCertificat: z.string().min(1),
  
  beneficiaire: BeneficiaireSchema,
  organisme: OrganismeSchema,
  
  action: ActionFormationSchema,
  realisation: RealisationSchema,
  financeur: FinanceurCertificatSchema,
  referencesLegales: ReferencesLegalesSchema,
  
  dateEmission: z.string().datetime(),
  signature: SignatureSchema,
  signatureNumerique: z.string().length(64, 'Signature numérique invalide (SHA-256 requis)'),
});

// ============================================================================
// TYPES TYPESCRIPT INFÉRÉS
// ============================================================================

export type ConventionBilan = z.infer<typeof ConventionBilanSchema>;
export type FeuilleEmargement = z.infer<typeof FeuilleEmargementSchema>;
export type DocumentSynthese = z.infer<typeof DocumentSyntheseSchema>;
export type AttestationFinFormation = z.infer<typeof AttestationFinFormationSchema>;
export type CertificatRealisation = z.infer<typeof CertificatRealisationSchema>;

