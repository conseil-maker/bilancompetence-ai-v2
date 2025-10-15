/**
 * Types TypeScript pour les Documents Obligatoires
 * Conformité Qualiopi et exigences CPF/OPCO
 * 
 * Documents requis :
 * - Convention de bilan de compétences (tripartite)
 * - Feuilles d'émargement (par séance)
 * - Document de synthèse (remis au bénéficiaire)
 * - Attestation de fin de formation
 * - Certificat de réalisation (pour OPCO/CPF)
 */

// =====================================================
// ENUMS
// =====================================================

export enum TypeDocument {
  CONVENTION = 'CONVENTION',
  EMARGEMENT = 'EMARGEMENT',
  SYNTHESE = 'SYNTHESE',
  ATTESTATION = 'ATTESTATION',
  CERTIFICAT = 'CERTIFICAT',
}

export enum StatutDocument {
  BROUILLON = 'BROUILLON',
  EN_ATTENTE_SIGNATURE = 'EN_ATTENTE_SIGNATURE',
  SIGNE = 'SIGNE',
  ARCHIVE = 'ARCHIVE',
}

export enum TypeSignature {
  ELECTRONIQUE = 'ELECTRONIQUE',
  MANUSCRITE = 'MANUSCRITE',
  CACHET = 'CACHET',
}

// =====================================================
// CONVENTION DE BILAN
// =====================================================

export interface Convention {
  id: string;
  bilanId: string;
  
  // Parties prenantes
  beneficiaire: PartieConvention;
  entreprise?: PartieConvention; // Optionnel si bilan à titre personnel
  organisme: PartieConvention;
  
  // Informations du bilan
  titre: string;
  objectifs: string[];
  dureeHeures: number; // Durée totale en heures
  dateDebut: Date;
  dateFinPrevue: Date;
  
  // Modalités
  modalites: {
    lieu: string;
    horaires: string;
    distanciel: boolean;
    presentiel: boolean;
    mixte: boolean;
  };
  
  // Tarification
  tarif: {
    montantTotal: number;
    montantPrisEnCharge?: number;
    montantRestant?: number;
    financeur?: 'CPF' | 'OPCO' | 'Entreprise' | 'Personnel' | 'Autre';
    detailsFinancement?: string;
  };
  
  // Mentions légales
  mentionsLegales: {
    rgpd: boolean;
    droitRetractation: boolean;
    confidentialite: boolean;
    proprieteSynthese: boolean; // La synthèse appartient au bénéficiaire
  };
  
  // Signatures
  signatures: Signature[];
  
  // Métadonnées
  statut: StatutDocument;
  dateCreation: Date;
  dateSignature?: Date;
  urlDocument?: string; // URL du PDF signé
}

export interface PartieConvention {
  type: 'beneficiaire' | 'entreprise' | 'organisme';
  nom: string;
  prenom?: string; // Pour les personnes physiques
  raisonSociale?: string; // Pour les personnes morales
  adresse: Adresse;
  email: string;
  telephone: string;
  siret?: string; // Pour les entreprises et organismes
  representantLegal?: {
    nom: string;
    prenom: string;
    fonction: string;
  };
}

export interface Adresse {
  rue: string;
  complement?: string;
  codePostal: string;
  ville: string;
  pays: string;
}

export interface Signature {
  partieId: string;
  type: TypeSignature;
  dateSignature: Date;
  nomSignataire: string;
  fonction?: string;
  urlSignature?: string; // URL de l'image de la signature
  ipAddress?: string;
  userAgent?: string;
  certificat?: string; // Pour signature électronique qualifiée
}

// =====================================================
// FEUILLE D'ÉMARGEMENT
// =====================================================

export interface FeuilleEmargement {
  id: string;
  bilanId: string;
  seanceId: string;
  
  // Informations de la séance
  seance: {
    numero: number;
    date: Date;
    heureDebut: string; // Format HH:MM
    heureFin: string; // Format HH:MM
    dureeMinutes: number;
    theme: string;
    phase: 'PRELIMINAIRE' | 'INVESTIGATION' | 'CONCLUSION' | 'SUIVI';
    modalite: 'Présentiel' | 'Distanciel' | 'Téléphone';
    lieu?: string;
  };
  
  // Participants
  beneficiaire: {
    nom: string;
    prenom: string;
    signatureArrivee?: SignatureEmargement;
    signatureDepart?: SignatureEmargement;
  };
  
  consultant: {
    nom: string;
    prenom: string;
    signatureArrivee?: SignatureEmargement;
    signatureDepart?: SignatureEmargement;
  };
  
  // Contenu de la séance
  contenu: {
    objectifs: string[];
    activitesRealisees: string[];
    documentsRemis: string[];
    observations?: string;
  };
  
  // Validation
  statut: StatutDocument;
  dateCreation: Date;
  urlDocument?: string; // URL du PDF
  qrCode?: string; // QR code de vérification
}

export interface SignatureEmargement {
  horodatage: Date;
  type: TypeSignature;
  urlSignature?: string;
  ipAddress?: string;
  geolocalisation?: {
    latitude: number;
    longitude: number;
  };
}

// =====================================================
// DOCUMENT DE SYNTHÈSE
// =====================================================

export interface DocumentSynthese {
  id: string;
  bilanId: string;
  
  // Informations générales
  beneficiaire: {
    nom: string;
    prenom: string;
    email: string;
  };
  
  consultant: {
    nom: string;
    prenom: string;
    email: string;
  };
  
  // Période du bilan
  periode: {
    dateDebut: Date;
    dateFin: Date;
    dureeHeures: number;
    nombreSeances: number;
  };
  
  // Contenu de la synthèse
  contenu: {
    // 1. Parcours réalisé
    parcours: {
      phasePreliminaire: {
        duree: number;
        objectifsDefinis: string[];
        motivations: string;
      };
      phaseInvestigation: {
        duree: number;
        testsRealises: string[];
        competencesIdentifiees: Competence[];
        pistesExplorees: PisteProfessionnelle[];
      };
      phaseConclusion: {
        duree: number;
        projetProfessionnel: string;
        planAction: ActionPlanifiee[];
      };
    };
    
    // 2. Synthèse des résultats
    synthese: {
      pointsForts: string[];
      competencesCles: string[];
      valeursEtMotivations: string[];
      contraintesIdentifiees: string[];
    };
    
    // 3. Projet professionnel
    projet: {
      type: 'evolution' | 'reconversion' | 'creation' | 'formation' | 'autre';
      titre: string;
      description: string;
      objectifPrincipal: string;
      objectifsSecondaires: string[];
      echeance: 'court_terme' | 'moyen_terme' | 'long_terme';
      faisabilite: {
        score: number; // 0-10
        facteursFavorables: string[];
        obstacles: string[];
      };
    };
    
    // 4. Plan d'action
    planAction: {
      actions: ActionPlanifiee[];
      priorites: string[];
      ressourcesNecessaires: string[];
      accompagnementRecommande?: string;
    };
    
    // 5. Recommandations
    recommandations: {
      formations: string[];
      reseaux: string[];
      ressources: string[];
      autresRecommandations: string[];
    };
  };
  
  // Confidentialité
  confidentialite: {
    mentionConfidentialite: string;
    droitProprieteBeneficiaire: boolean;
    interdictionDiffusion: boolean;
  };
  
  // Signatures
  signatures: {
    beneficiaire?: Signature;
    consultant: Signature;
  };
  
  // Métadonnées
  statut: StatutDocument;
  dateCreation: Date;
  dateRemise?: Date;
  urlDocument?: string; // URL du PDF
  versionNumber: number;
}

export interface Competence {
  nom: string;
  categorie: 'technique' | 'transversale' | 'comportementale';
  niveau: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  description?: string;
  preuves?: string[];
}

export interface PisteProfessionnelle {
  metier: string;
  codeRome?: string;
  secteur: string;
  adequation: number; // 0-100
  motivations: string[];
  freins: string[];
  actionsExploration: string[];
}

export interface ActionPlanifiee {
  titre: string;
  description: string;
  categorie: 'formation' | 'recherche' | 'reseau' | 'creation' | 'autre';
  priorite: 'haute' | 'moyenne' | 'basse';
  echeance?: Date;
  etapes: string[];
  ressourcesNecessaires: string[];
  indicateursReussite: string[];
  statut: 'a_faire' | 'en_cours' | 'terminee' | 'abandonnee';
}

// =====================================================
// ATTESTATION DE FIN DE FORMATION
// =====================================================

export interface AttestationFinFormation {
  id: string;
  bilanId: string;
  
  // Informations du bénéficiaire
  beneficiaire: {
    nom: string;
    prenom: string;
    dateNaissance: Date;
    adresse: Adresse;
  };
  
  // Informations de la formation
  formation: {
    intitule: string;
    type: 'Bilan de compétences';
    dureeHeures: number;
    dateDebut: Date;
    dateFin: Date;
    lieu: string;
    modalite: 'Présentiel' | 'Distanciel' | 'Mixte';
  };
  
  // Organisme de formation
  organisme: {
    nom: string;
    siret: string;
    numeroDeclarationActivite: string;
    adresse: Adresse;
    representantLegal: {
      nom: string;
      prenom: string;
      fonction: string;
    };
  };
  
  // Résultats
  resultats: {
    objectifsAtteints: string[];
    competencesAcquises: string[];
    assiduiteHeures: number;
    tauxAssiduitePercent: number;
  };
  
  // Signature
  signature: Signature;
  
  // Métadonnées
  numeroAttestation: string;
  dateEmission: Date;
  urlDocument?: string;
}

// =====================================================
// CERTIFICAT DE RÉALISATION
// =====================================================

export interface CertificatRealisation {
  id: string;
  bilanId: string;
  
  // Informations du bénéficiaire
  beneficiaire: {
    nom: string;
    prenom: string;
    dateNaissance: Date;
    numeroSecuriteSociale?: string; // Pour CPF
  };
  
  // Informations de l'action de formation
  action: {
    intitule: string;
    type: 'Bilan de compétences';
    numeroAction?: string; // Numéro d'action CPF
    dureeHeures: number;
    dateDebut: Date;
    dateFin: Date;
    heuresRealisees: number;
    tauxRealisation: number; // Pourcentage
  };
  
  // Organisme de formation
  organisme: {
    nom: string;
    siret: string;
    numeroDeclarationActivite: string;
    numeroCertificationQualiopi: string;
    adresse: Adresse;
  };
  
  // Financement
  financement: {
    financeur: 'CPF' | 'OPCO' | 'Entreprise' | 'Personnel';
    montantPrisEnCharge: number;
    numeroConvention?: string;
    numeroDossier?: string;
  };
  
  // Validation
  validation: {
    dateRealisation: Date;
    certifieConforme: boolean;
    observations?: string;
  };
  
  // Signature
  signature: Signature;
  cachetOrganisme?: string; // URL du cachet
  
  // Métadonnées
  numeroCertificat: string;
  dateEmission: Date;
  urlDocument?: string;
}

// =====================================================
// GÉNÉRATEUR DE DOCUMENTS
// =====================================================

export interface GenerateurDocuments {
  // Générer une convention
  genererConvention(bilan: any): Promise<Convention>;
  
  // Générer une feuille d'émargement
  genererFeuilleEmargement(seance: any): Promise<FeuilleEmargement>;
  
  // Générer un document de synthèse
  genererSynthese(bilan: any): Promise<DocumentSynthese>;
  
  // Générer une attestation
  genererAttestation(bilan: any): Promise<AttestationFinFormation>;
  
  // Générer un certificat
  genererCertificat(bilan: any): Promise<CertificatRealisation>;
  
  // Générer le PDF
  genererPDF(document: any, type: TypeDocument): Promise<string>;
  
  // Envoyer pour signature électronique
  envoyerPourSignature(documentId: string, signataires: string[]): Promise<void>;
  
  // Vérifier le statut de signature
  verifierStatutSignature(documentId: string): Promise<StatutDocument>;
}

// =====================================================
// TEMPLATES DE DOCUMENTS
// =====================================================

export interface TemplateDocument {
  type: TypeDocument;
  nom: string;
  version: string;
  contenuHTML: string;
  contenuCSS: string;
  variables: VariableTemplate[];
  mentionsLegales: string[];
}

export interface VariableTemplate {
  nom: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object';
  obligatoire: boolean;
  description: string;
  valeurParDefaut?: any;
}

// =====================================================
// STOCKAGE ET ARCHIVAGE
// =====================================================

export interface StockageDocument {
  id: string;
  bilanId: string;
  typeDocument: TypeDocument;
  nomFichier: string;
  cheminStockage: string; // Chemin dans Supabase Storage
  tailleFichier: number;
  mimeType: string;
  hash: string; // Hash SHA-256 pour intégrité
  
  // Métadonnées
  dateCreation: Date;
  dateModification?: Date;
  creePar: string; // userId
  
  // Archivage
  archive: boolean;
  dateArchivage?: Date;
  dureeConservationAnnees: number; // Durée légale de conservation
  dateSuppressionPrevue: Date;
}

// =====================================================
// EXPORT
// =====================================================

export type {
  Convention,
  FeuilleEmargement,
  DocumentSynthese,
  AttestationFinFormation,
  CertificatRealisation,
  PartieConvention,
  Signature,
  SignatureEmargement,
  Competence,
  PisteProfessionnelle,
  ActionPlanifiee,
  GenerateurDocuments,
  TemplateDocument,
  VariableTemplate,
  StockageDocument,
};

