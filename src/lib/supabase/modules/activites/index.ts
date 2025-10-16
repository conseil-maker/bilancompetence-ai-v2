/**
 * Module de gestion des activités
 * Journal d'audit et traçabilité
 */

import { createClient } from '@/lib/supabase/client';
import type {
  Activite,
  Inserts,
} from '@/types/database.types';

// =====================================================
// ACTIVITÉS
// =====================================================

/**
 * Récupère toutes les activités d'un bilan
 */
export async function getActivites(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('activites')
    .select('*')
    .eq('bilan_id', bilanId)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Activite[];
}

/**
 * Récupère les activités d'un utilisateur
 */
export async function getActivitesByUser(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('activites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Activite[];
}

/**
 * Récupère les activités par type
 */
export async function getActivitesByType(bilanId: string, type: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('activites')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('type', type)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Activite[];
}

/**
 * Récupère les activités récentes (7 derniers jours)
 */
export async function getActivitesRecentes(bilanId: string) {
  const supabase = createClient();
  
  const date7JoursAvant = new Date();
  date7JoursAvant.setDate(date7JoursAvant.getDate() - 7);

  const { data, error } = await supabase
    .from('activites')
    .select('*')
    .eq('bilan_id', bilanId)
    .gte('created_at', date7JoursAvant.toISOString())
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Activite[];
}

/**
 * Récupère les activités dans une plage de dates
 */
export async function getActivitesByDateRange(
  bilanId: string,
  dateDebut: string,
  dateFin: string
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('activites')
    .select('*')
    .eq('bilan_id', bilanId)
    .gte('created_at', dateDebut)
    .lte('created_at', dateFin)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Activite[];
}

/**
 * Crée une nouvelle activité
 */
export async function createActivite(activite: Inserts<'activites'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('activites')
    .insert(activite)
    .select()
    .single();

  if (error) throw error;
  return data as Activite;
}

/**
 * Enregistre une activité
 */
export async function logActivite(
  bilanId: string,
  userId: string,
  type: string,
  description: string,
  metadata?: Record<string, any>
) {
  return createActivite({
    bilan_id: bilanId,
    user_id: userId,
    type,
    description,
    metadata: metadata || null,
  });
}

/**
 * Supprime les anciennes activités (90 jours)
 */
export async function nettoyerAnciennesActivites() {
  const supabase = createClient();
  
  const date90JoursAvant = new Date();
  date90JoursAvant.setDate(date90JoursAvant.getDate() - 90);

  const { error } = await supabase
    .from('activites')
    .delete()
    .lt('created_at', date90JoursAvant.toISOString());

  if (error) throw error;
}

// =====================================================
// STATISTIQUES
// =====================================================

/**
 * Récupère les statistiques des activités
 */
export async function getActivitesStats(bilanId: string) {
  const activites = await getActivites(bilanId);

  const stats = {
    total: activites.length,
    parType: {} as Record<string, number>,
    parJour: {} as Record<string, number>,
  };

  activites.forEach((activite) => {
    // Par type
    stats.parType[activite.type] = (stats.parType[activite.type] || 0) + 1;

    // Par jour
    const jour = new Date(activite.created_at).toISOString().split('T')[0];
    stats.parJour[jour] = (stats.parJour[jour] || 0) + 1;
  });

  return stats;
}

/**
 * Récupère la timeline d'activités
 */
export async function getTimeline(bilanId: string, limit: number = 50) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('activites')
    .select(`
      *,
      user:profiles(*)
    `)
    .eq('bilan_id', bilanId)
    .order('created_at', { ascending: false})
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Génère un rapport d'activité
 */
export async function genererRapportActivite(
  bilanId: string,
  dateDebut: string,
  dateFin: string
) {
  const activites = await getActivitesByDateRange(bilanId, dateDebut, dateFin);

  const rapport = {
    periode: {
      debut: dateDebut,
      fin: dateFin,
    },
    total: activites.length,
    parType: {} as Record<string, number>,
    parUtilisateur: {} as Record<string, number>,
    activites: activites.map((a) => ({
      date: a.created_at,
      type: a.type,
      description: a.description,
    })),
  };

  activites.forEach((activite) => {
    rapport.parType[activite.type] = (rapport.parType[activite.type] || 0) + 1;
    rapport.parUtilisateur[activite.user_id] =
      (rapport.parUtilisateur[activite.user_id] || 0) + 1;
  });

  return rapport;
}

// =====================================================
// TYPES D'ACTIVITÉS PRÉDÉFINIS
// =====================================================

export const TYPES_ACTIVITES = {
  // Authentification
  LOGIN: 'login',
  LOGOUT: 'logout',

  // Bilan
  BILAN_CREE: 'bilan_cree',
  BILAN_MODIFIE: 'bilan_modifie',
  PHASE_CHANGEE: 'phase_changee',
  PHASE_COMPLETEE: 'phase_completee',
  STATUT_CHANGE: 'statut_change',

  // Compétences
  COMPETENCE_AJOUTEE: 'competence_ajoutee',
  COMPETENCE_MODIFIEE: 'competence_modifiee',
  COMPETENCE_VALIDEE: 'competence_validee',
  EXTRACTION_COMPETENCES: 'extraction_competences',

  // Expériences
  EXPERIENCE_AJOUTEE: 'experience_ajoutee',
  EXPERIENCE_MODIFIEE: 'experience_modifiee',

  // Pistes Métiers
  PISTE_METIER_AJOUTEE: 'piste_metier_ajoutee',
  PISTE_METIER_MODIFIEE: 'piste_metier_modifiee',
  SUGGESTION_PISTES_METIERS: 'suggestion_pistes_metiers',
  GAP_ANALYSIS: 'gap_analysis',

  // Formations
  FORMATION_AJOUTEE: 'formation_ajoutee',
  FORMATION_MODIFIEE: 'formation_modifiee',
  SUGGESTION_FORMATIONS: 'suggestion_formations',

  // Plan d'Action
  ACTION_AJOUTEE: 'action_ajoutee',
  ACTION_MODIFIEE: 'action_modifiee',
  ACTION_COMPLETEE: 'action_completee',

  // RDV
  RDV_CREE: 'rdv_cree',
  RDV_MODIFIE: 'rdv_modifie',
  RDV_CONFIRME: 'rdv_confirme',
  RDV_ANNULE: 'rdv_annule',
  NOTES_ENTRETIEN_AJOUTEES: 'notes_entretien_ajoutees',

  // Tests
  TEST_CREE: 'test_cree',
  TEST_COMPLETE: 'test_complete',
  TEST_ANALYSE: 'test_analyse',

  // Documents
  DOCUMENT_AJOUTE: 'document_ajoute',
  DOCUMENT_SIGNE: 'document_signe',
  DOCUMENT_TELECHARGE: 'document_telecharge',

  // Messages
  MESSAGE_ENVOYE: 'message_envoye',
  MESSAGE_LU: 'message_lu',

  // Qualiopi
  ENQUETE_ENVOYEE: 'enquete_envoyee',
  ENQUETE_COMPLETEE: 'enquete_completee',
  RECLAMATION_CREEE: 'reclamation_creee',
  RECLAMATION_TRAITEE: 'reclamation_traitee',
} as const;

