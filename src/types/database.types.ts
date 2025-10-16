/**
 * Types TypeScript générés depuis le schéma de base de données Supabase
 * Base de données: BilanCompetence.AI v2
 * Date: 2025-10-17
 * 
 * Ces types correspondent exactement à la structure de la base de données
 * et sont utilisés pour garantir la sécurité des types dans toute l'application.
 */

// =====================================================
// TYPE JSON
// =====================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// =====================================================
// ENUMS
// =====================================================

export type UserRole = 'beneficiaire' | 'consultant' | 'admin';

export type BilanStatus = 
  | 'en_attente' 
  | 'preliminaire' 
  | 'investigation' 
  | 'conclusion' 
  | 'termine' 
  | 'abandonne';

export type TestType = 
  | 'personnalite' 
  | 'interets' 
  | 'competences' 
  | 'valeurs' 
  | 'autre';

export type MessageStatus = 'envoye' | 'lu' | 'archive';

export type ExperienceType = 
  | 'professionnelle' 
  | 'formation' 
  | 'benevolat' 
  | 'projet_personnel';

export type CompetenceCategorie = 
  | 'technique' 
  | 'transversale' 
  | 'comportementale' 
  | 'linguistique';

export type CompetenceSource = 
  | 'cv' 
  | 'test' 
  | 'entretien' 
  | 'ia_extraction';

export type PisteMetierSource = 
  | 'ia_suggestion' 
  | 'consultant_suggestion' 
  | 'beneficiaire_recherche';

export type PisteMetierStatut = 
  | 'a_explorer' 
  | 'en_exploration' 
  | 'interesse' 
  | 'non_interesse' 
  | 'retenu';

export type EcartStatut = 
  | 'acquise' 
  | 'a_developper' 
  | 'a_acquerir';

export type FormationType = 
  | 'diplome' 
  | 'certification' 
  | 'formation_courte' 
  | 'mooc' 
  | 'vae';

export type FormationStatut = 
  | 'suggeree' 
  | 'interesse' 
  | 'inscrit' 
  | 'en_cours' 
  | 'terminee' 
  | 'abandonnee';

export type ActionType = 
  | 'formation' 
  | 'recherche_emploi' 
  | 'vae' 
  | 'creation_entreprise' 
  | 'bilan_complementaire' 
  | 'autre';

export type ActionStatut = 
  | 'a_faire' 
  | 'en_cours' 
  | 'termine' 
  | 'abandonne' 
  | 'en_attente';

export type RdvType = 
  | 'information' 
  | 'preliminaire' 
  | 'investigation' 
  | 'conclusion' 
  | 'suivi' 
  | 'autre';

export type RdvModalite = 
  | 'presentiel' 
  | 'visio' 
  | 'telephone';

export type RdvStatut = 
  | 'planifie' 
  | 'confirme' 
  | 'en_cours' 
  | 'termine' 
  | 'annule' 
  | 'reporte';

export type NotificationType = 
  | 'rdv' 
  | 'message' 
  | 'action_echeance' 
  | 'phase_complete' 
  | 'test_disponible' 
  | 'alerte' 
  | 'info';

export type NotificationPriorite = 
  | 'basse' 
  | 'normale' 
  | 'haute' 
  | 'urgente';

export type EnqueteType = 
  | 'a_chaud' 
  | 'a_froid_6mois' 
  | 'a_froid_12mois';

export type EnqueteStatut = 
  | 'envoyee' 
  | 'completee' 
  | 'expiree';

export type ReclamationType = 
  | 'qualite_prestation' 
  | 'delai' 
  | 'communication' 
  | 'administratif' 
  | 'autre';

export type ReclamationGravite = 
  | 'faible' 
  | 'moyenne' 
  | 'haute' 
  | 'critique';

export type ReclamationStatut = 
  | 'nouvelle' 
  | 'en_cours' 
  | 'traitee' 
  | 'close' 
  | 'escaladee';

export type VeilleType = 
  | 'reglementaire' 
  | 'sectorielle' 
  | 'methodologique' 
  | 'technologique';

export type SanteBilan = 'vert' | 'orange' | 'rouge';

export type EdofStatus = 
  | 'non_declare' 
  | 'en_cours' 
  | 'valide' 
  | 'refuse';

// =====================================================
// DATABASE INTERFACE
// =====================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          bio: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id: string;
          role?: UserRole;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          role?: UserRole;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
      };
      bilans: {
        Row: {
          id: string;
          beneficiaire_id: string;
          consultant_id: string | null;
          status: BilanStatus;
          titre: string;
          description: string | null;
          objectifs: Json | null;
          date_debut: string | null;
          date_fin_prevue: string | null;
          date_fin_reelle: string | null;
          preliminaire_completed_at: string | null;
          preliminaire_notes: string | null;
          preliminaire_commentaire: string | null;
          investigation_completed_at: string | null;
          investigation_notes: string | null;
          investigation_commentaire: string | null;
          conclusion_completed_at: string | null;
          conclusion_commentaire: string | null;
          synthese_document_url: string | null;
          engagement_score: number | null;
          sante_bilan: SanteBilan | null;
          alerte_decrochage: boolean;
          derniere_activite: string | null;
          numero_cpf: string | null;
          edof_status: EdofStatus;
          edof_declared_at: string | null;
          edof_reference: string | null;
          financeur: string | null;
          montant_finance: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          beneficiaire_id: string;
          consultant_id?: string | null;
          status?: BilanStatus;
          titre: string;
          description?: string | null;
          objectifs?: Json | null;
          date_debut?: string | null;
          date_fin_prevue?: string | null;
          date_fin_reelle?: string | null;
          preliminaire_completed_at?: string | null;
          preliminaire_notes?: string | null;
          preliminaire_commentaire?: string | null;
          investigation_completed_at?: string | null;
          investigation_notes?: string | null;
          investigation_commentaire?: string | null;
          conclusion_completed_at?: string | null;
          conclusion_commentaire?: string | null;
          synthese_document_url?: string | null;
          engagement_score?: number | null;
          sante_bilan?: SanteBilan | null;
          alerte_decrochage?: boolean;
          derniere_activite?: string | null;
          numero_cpf?: string | null;
          edof_status?: EdofStatus;
          edof_declared_at?: string | null;
          edof_reference?: string | null;
          financeur?: string | null;
          montant_finance?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          beneficiaire_id?: string;
          consultant_id?: string | null;
          status?: BilanStatus;
          titre?: string;
          description?: string | null;
          objectifs?: Json | null;
          date_debut?: string | null;
          date_fin_prevue?: string | null;
          date_fin_reelle?: string | null;
          preliminaire_completed_at?: string | null;
          preliminaire_notes?: string | null;
          preliminaire_commentaire?: string | null;
          investigation_completed_at?: string | null;
          investigation_notes?: string | null;
          investigation_commentaire?: string | null;
          conclusion_completed_at?: string | null;
          conclusion_commentaire?: string | null;
          synthese_document_url?: string | null;
          engagement_score?: number | null;
          sante_bilan?: SanteBilan | null;
          alerte_decrochage?: boolean;
          derniere_activite?: string | null;
          numero_cpf?: string | null;
          edof_status?: EdofStatus;
          edof_declared_at?: string | null;
          edof_reference?: string | null;
          financeur?: string | null;
          montant_finance?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      experiences: {
        Row: {
          id: string;
          bilan_id: string;
          titre: string;
          entreprise: string | null;
          type: ExperienceType;
          description: string | null;
          realisations: string[] | null;
          date_debut: string;
          date_fin: string | null;
          duree_mois: number | null;
          lieu: string | null;
          secteur_activite: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bilan_id: string;
          titre: string;
          entreprise?: string | null;
          type: ExperienceType;
          description?: string | null;
          realisations?: string[] | null;
          date_debut: string;
          date_fin?: string | null;
          lieu?: string | null;
          secteur_activite?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          bilan_id?: string;
          titre?: string;
          entreprise?: string | null;
          type?: ExperienceType;
          description?: string | null;
          realisations?: string[] | null;
          date_debut?: string;
          date_fin?: string | null;
          lieu?: string | null;
          secteur_activite?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      competences: {
        Row: {
          id: string;
          bilan_id: string;
          nom: string;
          categorie: CompetenceCategorie;
          sous_categorie: string | null;
          niveau: number | null;
          niveau_label: string | null;
          source: CompetenceSource;
          validee_par_consultant: boolean;
          code_rome: string | null;
          code_esco: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bilan_id: string;
          nom: string;
          categorie: CompetenceCategorie;
          sous_categorie?: string | null;
          niveau?: number | null;
          niveau_label?: string | null;
          source: CompetenceSource;
          validee_par_consultant?: boolean;
          code_rome?: string | null;
          code_esco?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          bilan_id?: string;
          nom?: string;
          categorie?: CompetenceCategorie;
          sous_categorie?: string | null;
          niveau?: number | null;
          niveau_label?: string | null;
          source?: CompetenceSource;
          validee_par_consultant?: boolean;
          code_rome?: string | null;
          code_esco?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      competences_experiences: {
        Row: {
          id: string;
          competence_id: string;
          experience_id: string;
          contexte: string | null;
          niveau_utilisation: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          competence_id: string;
          experience_id: string;
          contexte?: string | null;
          niveau_utilisation?: number | null;
          created_at?: string;
        };
        Update: {
          competence_id?: string;
          experience_id?: string;
          contexte?: string | null;
          niveau_utilisation?: number | null;
        };
      };
      pistes_metiers: {
        Row: {
          id: string;
          bilan_id: string;
          titre: string;
          code_rome: string | null;
          code_esco: string | null;
          famille_metier: string | null;
          secteur_activite: string | null;
          description: string | null;
          missions_principales: string[] | null;
          environnement_travail: string | null;
          score_adequation: number | null;
          source: PisteMetierSource;
          statut: PisteMetierStatut;
          priorite: number | null;
          salaire_min: number | null;
          salaire_max: number | null;
          nombre_offres: number | null;
          tendance_recrutement: string | null;
          regions_recrutement: string[] | null;
          enquete_realisee: boolean;
          enquete_notes: string | null;
          contacts_professionnels: string[] | null;
          created_at: string;
          updated_at: string;
          favoris: boolean;
        };
        Insert: {
          id?: string;
          bilan_id: string;
          titre: string;
          code_rome?: string | null;
          code_esco?: string | null;
          famille_metier?: string | null;
          secteur_activite?: string | null;
          description?: string | null;
          missions_principales?: string[] | null;
          environnement_travail?: string | null;
          score_adequation?: number | null;
          source: PisteMetierSource;
          statut?: PisteMetierStatut;
          priorite?: number | null;
          salaire_min?: number | null;
          salaire_max?: number | null;
          nombre_offres?: number | null;
          tendance_recrutement?: string | null;
          regions_recrutement?: string[] | null;
          enquete_realisee?: boolean;
          enquete_notes?: string | null;
          contacts_professionnels?: string[] | null;
          created_at?: string;
          updated_at?: string;
          favoris?: boolean;
        };
        Update: {
          id?: string;
          bilan_id?: string;
          titre?: string;
          code_rome?: string | null;
          code_esco?: string | null;
          famille_metier?: string | null;
          secteur_activite?: string | null;
          description?: string | null;
          missions_principales?: string[] | null;
          environnement_travail?: string | null;
          score_adequation?: number | null;
          source?: PisteMetierSource;
          statut?: PisteMetierStatut;
          priorite?: number | null;
          salaire_min?: number | null;
          salaire_max?: number | null;
          nombre_offres?: number | null;
          tendance_recrutement?: string | null;
          regions_recrutement?: string[] | null;
          enquete_realisee?: boolean;
          enquete_notes?: string | null;
          contacts_professionnels?: string[] | null;
          created_at?: string;
          updated_at?: string;
          favoris?: boolean;
        };
      };
      ecarts_competences: {
        Row: {
          id: string;
          piste_metier_id: string;
          competence_requise: string;
          niveau_requis: number;
          importance: string | null;
          competence_actuelle_id: string | null;
          niveau_actuel: number | null;
          ecart: number | null;
          statut_ecart: EcartStatut | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          piste_metier_id: string;
          competence_requise: string;
          niveau_requis: number;
          importance?: string | null;
          competence_actuelle_id?: string | null;
          niveau_actuel?: number | null;
          created_at?: string;
        };
        Update: {
          piste_metier_id?: string;
          competence_requise?: string;
          niveau_requis?: number;
          importance?: string | null;
          competence_actuelle_id?: string | null;
          niveau_actuel?: number | null;
        };
      };
      formations: {
        Row: {
          id: string;
          bilan_id: string;
          piste_metier_id: string | null;
          titre: string;
          organisme: string | null;
          type: FormationType | null;
          niveau: string | null;
          description: string | null;
          objectifs: string[] | null;
          competences_visees: string[] | null;
          duree_heures: number | null;
          duree_mois: number | null;
          modalite: string | null;
          cout_euros: number | null;
          eligible_cpf: boolean;
          url_formation: string | null;
          url_organisme: string | null;
          statut: FormationStatut;
          date_debut_prevue: string | null;
          date_fin_prevue: string | null;
          source: string | null;
          created_at: string;
          updated_at: string;
          favoris: boolean;
        };
        Insert: {
          id?: string;
          bilan_id: string;
          piste_metier_id?: string | null;
          titre: string;
          organisme?: string | null;
          type?: FormationType | null;
          niveau?: string | null;
          description?: string | null;
          objectifs?: string[] | null;
          competences_visees?: string[] | null;
          duree_heures?: number | null;
          duree_mois?: number | null;
          modalite?: string | null;
          cout_euros?: number | null;
          eligible_cpf?: boolean;
          url_formation?: string | null;
          url_organisme?: string | null;
          statut?: FormationStatut;
          date_debut_prevue?: string | null;
          date_fin_prevue?: string | null;
          source?: string | null;
          created_at?: string;
          updated_at?: string;
          favoris?: boolean;
        };
        Update: {
          id?: string;
          bilan_id?: string;
          piste_metier_id?: string | null;
          titre?: string;
          organisme?: string | null;
          type?: FormationType | null;
          niveau?: string | null;
          description?: string | null;
          objectifs?: string[] | null;
          competences_visees?: string[] | null;
          duree_heures?: number | null;
          duree_mois?: number | null;
          modalite?: string | null;
          cout_euros?: number | null;
          eligible_cpf?: boolean;
          url_formation?: string | null;
          url_organisme?: string | null;
          statut?: FormationStatut;
          date_debut_prevue?: string | null;
          date_fin_prevue?: string | null;
          source?: string | null;
          created_at?: string;
          updated_at?: string;
          favoris?: boolean;
        };
      };
      formations_ecarts: {
        Row: {
          id: string;
          formation_id: string;
          ecart_competence_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          formation_id: string;
          ecart_competence_id: string;
          created_at?: string;
        };
        Update: {
          formation_id?: string;
          ecart_competence_id?: string;
        };
      };
      plan_action: {
        Row: {
          id: string;
          bilan_id: string;
          piste_metier_id: string | null;
          formation_id: string | null;
          titre: string;
          description: string | null;
          type: ActionType;
          categorie: string | null;
          statut: ActionStatut;
          priorite: number | null;
          ordre: number | null;
          date_debut_prevue: string | null;
          date_fin_prevue: string | null;
          date_debut_reelle: string | null;
          date_fin_reelle: string | null;
          date_echeance: string | null;
          rappel_active: boolean;
          date_rappel: string | null;
          rappel_envoye: boolean;
          sous_taches: Json | null;
          ressources_necessaires: string[] | null;
          contacts: string[] | null;
          liens: string[] | null;
          progression: number;
          notes: string | null;
          obstacles: string | null;
          validee_par_consultant: boolean;
          commentaire_consultant: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          bilan_id: string;
          piste_metier_id?: string | null;
          formation_id?: string | null;
          titre: string;
          description?: string | null;
          type: ActionType;
          categorie?: string | null;
          statut?: ActionStatut;
          priorite?: number | null;
          ordre?: number | null;
          date_debut_prevue?: string | null;
          date_fin_prevue?: string | null;
          date_debut_reelle?: string | null;
          date_fin_reelle?: string | null;
          date_echeance?: string | null;
          rappel_active?: boolean;
          date_rappel?: string | null;
          rappel_envoye?: boolean;
          sous_taches?: Json | null;
          ressources_necessaires?: string[] | null;
          contacts?: string[] | null;
          liens?: string[] | null;
          progression?: number;
          notes?: string | null;
          obstacles?: string | null;
          validee_par_consultant?: boolean;
          commentaire_consultant?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          bilan_id?: string;
          piste_metier_id?: string | null;
          formation_id?: string | null;
          titre?: string;
          description?: string | null;
          type?: ActionType;
          categorie?: string | null;
          statut?: ActionStatut;
          priorite?: number | null;
          ordre?: number | null;
          date_debut_prevue?: string | null;
          date_fin_prevue?: string | null;
          date_debut_reelle?: string | null;
          date_fin_reelle?: string | null;
          date_echeance?: string | null;
          rappel_active?: boolean;
          date_rappel?: string | null;
          rappel_envoye?: boolean;
          sous_taches?: Json | null;
          ressources_necessaires?: string[] | null;
          contacts?: string[] | null;
          liens?: string[] | null;
          progression?: number;
          notes?: string | null;
          obstacles?: string | null;
          validee_par_consultant?: boolean;
          commentaire_consultant?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      rdv: {
        Row: {
          id: string;
          bilan_id: string;
          beneficiaire_id: string;
          consultant_id: string | null;
          titre: string;
          type: RdvType;
          phase: string | null;
          description: string | null;
          objectifs: string[] | null;
          date_rdv: string;
          duree_minutes: number;
          date_fin: string | null;
          modalite: RdvModalite;
          lieu: string | null;
          lien_visio: string | null;
          telephone: string | null;
          statut: RdvStatut;
          confirme_beneficiaire: boolean;
          confirme_consultant: boolean;
          rappel_24h_envoye: boolean;
          rappel_1h_envoye: boolean;
          notes_consultant: string | null;
          compte_rendu: string | null;
          documents_partages: string[] | null;
          actions_decidees: Json | null;
          rdv_precedent_id: string | null;
          raison_annulation: string | null;
          raison_report: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          bilan_id: string;
          beneficiaire_id: string;
          consultant_id?: string | null;
          titre: string;
          type: RdvType;
          phase?: string | null;
          description?: string | null;
          objectifs?: string[] | null;
          date_rdv: string;
          duree_minutes?: number;
          modalite: RdvModalite;
          lieu?: string | null;
          lien_visio?: string | null;
          telephone?: string | null;
          statut?: RdvStatut;
          confirme_beneficiaire?: boolean;
          confirme_consultant?: boolean;
          rappel_24h_envoye?: boolean;
          rappel_1h_envoye?: boolean;
          notes_consultant?: string | null;
          compte_rendu?: string | null;
          documents_partages?: string[] | null;
          actions_decidees?: Json | null;
          rdv_precedent_id?: string | null;
          raison_annulation?: string | null;
          raison_report?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          bilan_id?: string;
          beneficiaire_id?: string;
          consultant_id?: string | null;
          titre?: string;
          type?: RdvType;
          phase?: string | null;
          description?: string | null;
          objectifs?: string[] | null;
          date_rdv?: string;
          duree_minutes?: number;
          modalite?: RdvModalite;
          lieu?: string | null;
          lien_visio?: string | null;
          telephone?: string | null;
          statut?: RdvStatut;
          confirme_beneficiaire?: boolean;
          confirme_consultant?: boolean;
          rappel_24h_envoye?: boolean;
          rappel_1h_envoye?: boolean;
          notes_consultant?: string | null;
          compte_rendu?: string | null;
          documents_partages?: string[] | null;
          actions_decidees?: Json | null;
          rdv_precedent_id?: string | null;
          raison_annulation?: string | null;
          raison_report?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationType;
          titre: string;
          message: string;
          lien: string | null;
          action_label: string | null;
          priorite: NotificationPriorite;
          lue: boolean;
          lue_at: string | null;
          archivee: boolean;
          bilan_id: string | null;
          rdv_id: string | null;
          action_id: string | null;
          envoye_email: boolean;
          envoye_sms: boolean;
          envoye_push: boolean;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: NotificationType;
          titre: string;
          message: string;
          lien?: string | null;
          action_label?: string | null;
          priorite?: NotificationPriorite;
          lue?: boolean;
          lue_at?: string | null;
          archivee?: boolean;
          bilan_id?: string | null;
          rdv_id?: string | null;
          action_id?: string | null;
          envoye_email?: boolean;
          envoye_sms?: boolean;
          envoye_push?: boolean;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          user_id?: string;
          type?: NotificationType;
          titre?: string;
          message?: string;
          lien?: string | null;
          action_label?: string | null;
          priorite?: NotificationPriorite;
          lue?: boolean;
          lue_at?: string | null;
          archivee?: boolean;
          bilan_id?: string | null;
          rdv_id?: string | null;
          action_id?: string | null;
          envoye_email?: boolean;
          envoye_sms?: boolean;
          envoye_push?: boolean;
          expires_at?: string | null;
        };
      };
      notes_entretien: {
        Row: {
          id: string;
          rdv_id: string;
          bilan_id: string;
          consultant_id: string;
          notes: string;
          observations: string | null;
          points_cles: string[] | null;
          citations: string[] | null;
          themes_abordes: string[] | null;
          competences_identifiees: string[] | null;
          freins_identifies: string[] | null;
          motivations_identifiees: string[] | null;
          actions_a_suivre: Json | null;
          confidentiel: boolean;
          partage_avec_beneficiaire: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          rdv_id: string;
          bilan_id: string;
          consultant_id: string;
          notes: string;
          observations?: string | null;
          points_cles?: string[] | null;
          citations?: string[] | null;
          themes_abordes?: string[] | null;
          competences_identifiees?: string[] | null;
          freins_identifies?: string[] | null;
          motivations_identifiees?: string[] | null;
          actions_a_suivre?: Json | null;
          confidentiel?: boolean;
          partage_avec_beneficiaire?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          rdv_id?: string;
          bilan_id?: string;
          consultant_id?: string;
          notes?: string;
          observations?: string | null;
          points_cles?: string[] | null;
          citations?: string[] | null;
          themes_abordes?: string[] | null;
          competences_identifiees?: string[] | null;
          freins_identifies?: string[] | null;
          motivations_identifiees?: string[] | null;
          actions_a_suivre?: Json | null;
          confidentiel?: boolean;
          partage_avec_beneficiaire?: boolean;
          updated_at?: string;
        };
      };
      tests: {
        Row: {
          id: string;
          bilan_id: string;
          type: TestType;
          nom: string;
          description: string | null;
          resultats: Json | null;
          score: number | null;
          interpretation: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          bilan_id: string;
          type: TestType;
          nom: string;
          description?: string | null;
          resultats?: Json | null;
          score?: number | null;
          interpretation?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          bilan_id?: string;
          type?: TestType;
          nom?: string;
          description?: string | null;
          resultats?: Json | null;
          score?: number | null;
          interpretation?: string | null;
          completed_at?: string | null;
        };
      };
      documents: {
        Row: {
          id: string;
          bilan_id: string | null;
          uploaded_by: string;
          nom: string;
          type: string | null;
          file_path: string;
          file_size: number | null;
          mime_type: string | null;
          signed_at: string | null;
          signature_url: string | null;
          signature_beneficiaire: string | null;
          signature_consultant: string | null;
          signature_employeur: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          bilan_id?: string | null;
          uploaded_by: string;
          nom: string;
          type?: string | null;
          file_path: string;
          file_size?: number | null;
          mime_type?: string | null;
          signed_at?: string | null;
          signature_url?: string | null;
          signature_beneficiaire?: string | null;
          signature_consultant?: string | null;
          signature_employeur?: string | null;
          created_at?: string;
        };
        Update: {
          bilan_id?: string | null;
          uploaded_by?: string;
          nom?: string;
          type?: string | null;
          file_path?: string;
          file_size?: number | null;
          mime_type?: string | null;
          signed_at?: string | null;
          signature_url?: string | null;
          signature_beneficiaire?: string | null;
          signature_consultant?: string | null;
          signature_employeur?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          bilan_id: string;
          sender_id: string;
          receiver_id: string;
          subject: string | null;
          content: string;
          status: MessageStatus;
          sent_at: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          bilan_id: string;
          sender_id: string;
          receiver_id: string;
          subject?: string | null;
          content: string;
          status?: MessageStatus;
          sent_at?: string;
          read_at?: string | null;
        };
        Update: {
          bilan_id?: string;
          sender_id?: string;
          receiver_id?: string;
          subject?: string | null;
          content?: string;
          status?: MessageStatus;
          read_at?: string | null;
        };
      };
      resources: {
        Row: {
          id: string;
          created_by: string;
          titre: string;
          description: string | null;
          type: string | null;
          url: string | null;
          file_path: string | null;
          tags: string[] | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_by: string;
          titre: string;
          description?: string | null;
          type?: string | null;
          url?: string | null;
          file_path?: string | null;
          tags?: string[] | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          created_by?: string;
          titre?: string;
          description?: string | null;
          type?: string | null;
          url?: string | null;
          file_path?: string | null;
          tags?: string[] | null;
          is_public?: boolean;
          updated_at?: string;
        };
      };
      activites: {
        Row: {
          id: string;
          bilan_id: string | null;
          user_id: string;
          type: string;
          description: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          bilan_id?: string | null;
          user_id: string;
          type: string;
          description?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          bilan_id?: string | null;
          user_id?: string;
          type?: string;
          description?: string | null;
          metadata?: Json | null;
        };
      };
      enquetes_satisfaction: {
        Row: {
          id: string;
          bilan_id: string;
          beneficiaire_id: string;
          type: EnqueteType;
          date_envoi: string;
          date_reponse: string | null;
          statut: EnqueteStatut;
          reponses: Json | null;
          satisfaction_globale: number | null;
          recommanderait: boolean | null;
          points_forts: string | null;
          points_amelioration: string | null;
          commentaire_libre: string | null;
          projet_realise: boolean | null;
          situation_actuelle: string | null;
          details_situation: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bilan_id: string;
          beneficiaire_id: string;
          type: EnqueteType;
          date_envoi?: string;
          date_reponse?: string | null;
          statut?: EnqueteStatut;
          reponses?: Json | null;
          satisfaction_globale?: number | null;
          recommanderait?: boolean | null;
          points_forts?: string | null;
          points_amelioration?: string | null;
          commentaire_libre?: string | null;
          projet_realise?: boolean | null;
          situation_actuelle?: string | null;
          details_situation?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          bilan_id?: string;
          beneficiaire_id?: string;
          type?: EnqueteType;
          date_envoi?: string;
          date_reponse?: string | null;
          statut?: EnqueteStatut;
          reponses?: Json | null;
          satisfaction_globale?: number | null;
          recommanderait?: boolean | null;
          points_forts?: string | null;
          points_amelioration?: string | null;
          commentaire_libre?: string | null;
          projet_realise?: boolean | null;
          situation_actuelle?: string | null;
          details_situation?: string | null;
          updated_at?: string;
        };
      };
      reclamations: {
        Row: {
          id: string;
          bilan_id: string | null;
          beneficiaire_id: string | null;
          objet: string;
          description: string;
          type: ReclamationType | null;
          gravite: ReclamationGravite;
          date_reclamation: string;
          date_accuse_reception: string | null;
          date_traitement: string | null;
          date_cloture: string | null;
          statut: ReclamationStatut;
          responsable_traitement_id: string | null;
          analyse: string | null;
          actions_correctives: string | null;
          actions_preventives: string | null;
          reponse: string | null;
          satisfait: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bilan_id?: string | null;
          beneficiaire_id?: string | null;
          objet: string;
          description: string;
          type?: ReclamationType | null;
          gravite?: ReclamationGravite;
          date_reclamation?: string;
          date_accuse_reception?: string | null;
          date_traitement?: string | null;
          date_cloture?: string | null;
          statut?: ReclamationStatut;
          responsable_traitement_id?: string | null;
          analyse?: string | null;
          actions_correctives?: string | null;
          actions_preventives?: string | null;
          reponse?: string | null;
          satisfait?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          bilan_id?: string | null;
          beneficiaire_id?: string | null;
          objet?: string;
          description?: string;
          type?: ReclamationType | null;
          gravite?: ReclamationGravite;
          date_reclamation?: string;
          date_accuse_reception?: string | null;
          date_traitement?: string | null;
          date_cloture?: string | null;
          statut?: ReclamationStatut;
          responsable_traitement_id?: string | null;
          analyse?: string | null;
          actions_correctives?: string | null;
          actions_preventives?: string | null;
          reponse?: string | null;
          satisfait?: boolean | null;
          updated_at?: string;
        };
      };
      veille: {
        Row: {
          id: string;
          titre: string;
          type: VeilleType;
          source: string;
          resume: string;
          contenu: string | null;
          url: string | null;
          themes: string[] | null;
          impact: string | null;
          actions_necessaires: string | null;
          responsable_id: string | null;
          date_action_prevue: string | null;
          action_realisee: boolean;
          diffusee_equipe: boolean;
          date_diffusion: string | null;
          date_publication: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          titre: string;
          type: VeilleType;
          source: string;
          resume: string;
          contenu?: string | null;
          url?: string | null;
          themes?: string[] | null;
          impact?: string | null;
          actions_necessaires?: string | null;
          responsable_id?: string | null;
          date_action_prevue?: string | null;
          action_realisee?: boolean;
          diffusee_equipe?: boolean;
          date_diffusion?: string | null;
          date_publication?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          titre?: string;
          type?: VeilleType;
          source?: string;
          resume?: string;
          contenu?: string | null;
          url?: string | null;
          themes?: string[] | null;
          impact?: string | null;
          actions_necessaires?: string | null;
          responsable_id?: string | null;
          date_action_prevue?: string | null;
          action_realisee?: boolean;
          diffusee_equipe?: boolean;
          date_diffusion?: string | null;
          date_publication?: string | null;
          created_by?: string | null;
        };
      };
      formations_consultants: {
        Row: {
          id: string;
          consultant_id: string;
          titre: string;
          organisme: string | null;
          type: string | null;
          domaine: string | null;
          description: string | null;
          objectifs: string[] | null;
          competences_acquises: string[] | null;
          duree_heures: number | null;
          modalite: string | null;
          date_debut: string | null;
          date_fin: string | null;
          diplome_obtenu: boolean;
          certification_obtenue: boolean;
          nom_diplome: string | null;
          attestation_url: string | null;
          certificat_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          consultant_id: string;
          titre: string;
          organisme?: string | null;
          type?: string | null;
          domaine?: string | null;
          description?: string | null;
          objectifs?: string[] | null;
          competences_acquises?: string[] | null;
          duree_heures?: number | null;
          modalite?: string | null;
          date_debut?: string | null;
          date_fin?: string | null;
          diplome_obtenu?: boolean;
          certification_obtenue?: boolean;
          nom_diplome?: string | null;
          attestation_url?: string | null;
          certificat_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          consultant_id?: string;
          titre?: string;
          organisme?: string | null;
          type?: string | null;
          domaine?: string | null;
          description?: string | null;
          objectifs?: string[] | null;
          competences_acquises?: string[] | null;
          duree_heures?: number | null;
          modalite?: string | null;
          date_debut?: string | null;
          date_fin?: string | null;
          diplome_obtenu?: boolean;
          certification_obtenue?: boolean;
          nom_diplome?: string | null;
          attestation_url?: string | null;
          certificat_url?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}

// =====================================================
// TYPES HELPER
// =====================================================

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Alias pour faciliter l'utilisation
export type Profile = Tables<'profiles'>;
export type Bilan = Tables<'bilans'>;
export type Experience = Tables<'experiences'>;
export type Competence = Tables<'competences'>;
export type CompetenceExperience = Tables<'competences_experiences'>;
export type PisteMetier = Tables<'pistes_metiers'>;
export type EcartCompetence = Tables<'ecarts_competences'>;
export type Formation = Tables<'formations'>;
export type FormationEcart = Tables<'formations_ecarts'>;
export type PlanAction = Tables<'plan_action'>;
export type Rdv = Tables<'rdv'>;
export type Notification = Tables<'notifications'>;
export type NoteEntretien = Tables<'notes_entretien'>;
export type Test = Tables<'tests'>;
export type Document = Tables<'documents'>;
export type Message = Tables<'messages'>;
export type Resource = Tables<'resources'>;
export type Activite = Tables<'activites'>;
export type EnqueteSatisfaction = Tables<'enquetes_satisfaction'>;
export type Reclamation = Tables<'reclamations'>;
export type Veille = Tables<'veille'>;
export type FormationConsultant = Tables<'formations_consultants'>;

// Types pour les relations
export interface BilanWithRelations extends Bilan {
  beneficiaire?: Profile;
  consultant?: Profile;
  experiences?: Experience[];
  competences?: Competence[];
  pistes_metiers?: PisteMetier[];
  plan_action?: PlanAction[];
  tests?: Test[];
  documents?: Document[];
  messages?: Message[];
  rdv?: Rdv[];
  activites?: Activite[];
}

export interface ExperienceWithCompetences extends Experience {
  competences?: Competence[];
}

export interface PisteMetierWithDetails extends PisteMetier {
  ecarts_competences?: EcartCompetence[];
  formations?: Formation[];
}

export interface RdvWithDetails extends Rdv {
  beneficiaire?: Profile;
  consultant?: Profile;
  notes_entretien?: NoteEntretien;
}

