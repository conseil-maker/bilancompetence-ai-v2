/**
 * Module de conformité Qualiopi
 * Enquêtes, réclamations, veille, formations consultants
 */

import { createClient } from '@/lib/supabase/client';
import type {
  EnqueteSatisfaction,
  Reclamation,
  Veille,
  FormationConsultant,
  Inserts,
  Updates,
  EnqueteType,
  EnqueteStatut,
  ReclamationStatut,
  VeilleType,
} from '@/types/database.types';

// =====================================================
// ENQUÊTES DE SATISFACTION
// =====================================================

/**
 * Récupère toutes les enquêtes d'un bilan
 */
export async function getEnquetes(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('enquetes_satisfaction')
    .select('*')
    .eq('bilan_id', bilanId)
    .order('date_envoi', { ascending: false});

  if (error) throw error;
  return data as EnqueteSatisfaction[];
}

/**
 * Récupère les enquêtes par type
 */
export async function getEnquetesByType(bilanId: string, type: EnqueteType) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('enquetes_satisfaction')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('type', type)
    .order('date_envoi', { ascending: false});

  if (error) throw error;
  return data as EnqueteSatisfaction[];
}

/**
 * Récupère les enquêtes par statut
 */
export async function getEnquetesByStatut(
  bilanId: string,
  statut: EnqueteStatut
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('enquetes_satisfaction')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('statut', statut)
    .order('date_envoi', { ascending: false});

  if (error) throw error;
  return data as EnqueteSatisfaction[];
}

/**
 * Crée une nouvelle enquête
 */
export async function createEnquete(enquete: Inserts<'enquetes_satisfaction'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('enquetes_satisfaction')
    .insert(enquete)
    .select()
    .single();

  if (error) throw error;
  return data as EnqueteSatisfaction;
}

/**
 * Met à jour une enquête
 */
export async function updateEnquete(
  enqueteId: string,
  updates: Updates<'enquetes_satisfaction'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('enquetes_satisfaction')
    .update(updates)
    .eq('id', enqueteId)
    .select()
    .single();

  if (error) throw error;
  return data as EnqueteSatisfaction;
}

/**
 * Enregistre les réponses d'une enquête
 */
export async function enregistrerReponsesEnquete(
  enqueteId: string,
  reponses: Record<string, any>,
  satisfactionGlobale: number,
  recommanderait: boolean
) {
  return updateEnquete(enqueteId, {
    reponses,
    satisfaction_globale: satisfactionGlobale,
    recommanderait,
    statut: 'completee',
    date_reponse: new Date().toISOString(),
  });
}

/**
 * Supprime une enquête
 */
export async function deleteEnquete(enqueteId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('enquetes_satisfaction')
    .delete()
    .eq('id', enqueteId);

  if (error) throw error;
}

// =====================================================
// RÉCLAMATIONS
// =====================================================

/**
 * Récupère toutes les réclamations
 */
export async function getReclamations() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('reclamations')
    .select('*')
    .order('date_reclamation', { ascending: false});

  if (error) throw error;
  return data as Reclamation[];
}

/**
 * Récupère les réclamations d'un bilan
 */
export async function getReclamationsBilan(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('reclamations')
    .select('*')
    .eq('bilan_id', bilanId)
    .order('date_reclamation', { ascending: false});

  if (error) throw error;
  return data as Reclamation[];
}

/**
 * Récupère les réclamations par statut
 */
export async function getReclamationsByStatut(statut: ReclamationStatut) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('reclamations')
    .select('*')
    .eq('statut', statut)
    .order('date_reclamation', { ascending: false});

  if (error) throw error;
  return data as Reclamation[];
}

/**
 * Récupère les réclamations non traitées
 */
export async function getReclamationsNonTraitees() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('reclamations')
    .select('*')
    .in('statut', ['nouvelle', 'en_cours'])
    .order('gravite', { ascending: false})
    .order('date_reclamation', { ascending: true });

  if (error) throw error;
  return data as Reclamation[];
}

/**
 * Crée une nouvelle réclamation
 */
export async function createReclamation(reclamation: Inserts<'reclamations'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('reclamations')
    .insert(reclamation)
    .select()
    .single();

  if (error) throw error;
  return data as Reclamation;
}

/**
 * Met à jour une réclamation
 */
export async function updateReclamation(
  reclamationId: string,
  updates: Updates<'reclamations'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('reclamations')
    .update(updates)
    .eq('id', reclamationId)
    .select()
    .single();

  if (error) throw error;
  return data as Reclamation;
}

/**
 * Traite une réclamation
 */
export async function traiterReclamation(
  reclamationId: string,
  analyse: string,
  actionsCorrectives: string,
  actionsPreventives: string,
  reponse: string
) {
  return updateReclamation(reclamationId, {
    statut: 'traitee',
    analyse,
    actions_correctives: actionsCorrectives,
    actions_preventives: actionsPreventives,
    reponse,
    date_traitement: new Date().toISOString(),
  });
}

/**
 * Clôture une réclamation
 */
export async function cloturerReclamation(
  reclamationId: string,
  satisfait: boolean
) {
  return updateReclamation(reclamationId, {
    statut: 'close',
    satisfait,
    date_cloture: new Date().toISOString(),
  });
}

/**
 * Supprime une réclamation
 */
export async function deleteReclamation(reclamationId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('reclamations')
    .delete()
    .eq('id', reclamationId);

  if (error) throw error;
}

// =====================================================
// VEILLE
// =====================================================

/**
 * Récupère toutes les veilles
 */
export async function getVeilles() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('veille')
    .select('*')
    .order('date_publication', { ascending: false});

  if (error) throw error;
  return data as Veille[];
}

/**
 * Récupère les veilles par type
 */
export async function getVeillesByType(type: VeilleType) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('veille')
    .select('*')
    .eq('type', type)
    .order('date_publication', { ascending: false});

  if (error) throw error;
  return data as Veille[];
}

/**
 * Récupère les veilles par thème
 */
export async function getVeillesByTheme(theme: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('veille')
    .select('*')
    .contains('themes', [theme])
    .order('date_publication', { ascending: false});

  if (error) throw error;
  return data as Veille[];
}

/**
 * Récupère les veilles nécessitant une action
 */
export async function getVeillesActionsNecessaires() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('veille')
    .select('*')
    .eq('action_realisee', false)
    .not('actions_necessaires', 'is', null)
    .order('date_publication', { ascending: false});

  if (error) throw error;
  return data as Veille[];
}

/**
 * Crée une nouvelle veille
 */
export async function createVeille(veille: Inserts<'veille'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('veille')
    .insert(veille)
    .select()
    .single();

  if (error) throw error;
  return data as Veille;
}

/**
 * Met à jour une veille
 */
export async function updateVeille(
  veilleId: string,
  updates: Updates<'veille'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('veille')
    .update(updates)
    .eq('id', veilleId)
    .select()
    .single();

  if (error) throw error;
  return data as Veille;
}

/**
 * Marque une veille comme diffusée à l'équipe
 */
export async function diffuserVeille(veilleId: string) {
  return updateVeille(veilleId, {
    diffusee_equipe: true,
    date_diffusion: new Date().toISOString(),
  });
}

/**
 * Marque l'action d'une veille comme réalisée
 */
export async function marquerActionRealisee(veilleId: string) {
  return updateVeille(veilleId, { action_realisee: true });
}

/**
 * Supprime une veille
 */
export async function deleteVeille(veilleId: string) {
  const supabase = createClient();
  
  const { error } = await supabase.from('veille').delete().eq('id', veilleId);

  if (error) throw error;
}

// =====================================================
// FORMATIONS CONSULTANTS
// =====================================================

/**
 * Récupère toutes les formations d'un consultant
 */
export async function getFormationsConsultant(consultantId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('formations_consultants')
    .select('*')
    .eq('consultant_id', consultantId)
    .order('date_debut', { ascending: false});

  if (error) throw error;
  return data as FormationConsultant[];
}

/**
 * Récupère les formations par domaine
 */
export async function getFormationsConsultantByDomaine(
  consultantId: string,
  domaine: string
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('formations_consultants')
    .select('*')
    .eq('consultant_id', consultantId)
    .eq('domaine', domaine)
    .order('date_debut', { ascending: false});

  if (error) throw error;
  return data as FormationConsultant[];
}

/**
 * Crée une nouvelle formation consultant
 */
export async function createFormationConsultant(
  formation: Inserts<'formations_consultants'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('formations_consultants')
    .insert(formation)
    .select()
    .single();

  if (error) throw error;
  return data as FormationConsultant;
}

/**
 * Met à jour une formation consultant
 */
export async function updateFormationConsultant(
  formationId: string,
  updates: Updates<'formations_consultants'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('formations_consultants')
    .update(updates)
    .eq('id', formationId)
    .select()
    .single();

  if (error) throw error;
  return data as FormationConsultant;
}

/**
 * Supprime une formation consultant
 */
export async function deleteFormationConsultant(formationId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('formations_consultants')
    .delete()
    .eq('id', formationId);

  if (error) throw error;
}

// =====================================================
// STATISTIQUES QUALIOPI
// =====================================================

/**
 * Récupère les statistiques des enquêtes de satisfaction
 */
export async function getEnquetesStats() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('enquetes_satisfaction')
    .select('*');

  if (error) throw error;

  const enquetes = data as EnqueteSatisfaction[];

  const stats = {
    total: enquetes.length,
    parType: {} as Record<EnqueteType, number>,
    parStatut: {} as Record<EnqueteStatut, number>,
    completees: enquetes.filter((e) => e.statut === 'completee').length,
    tauxReponse:
      (enquetes.filter((e) => e.statut === 'completee').length /
        enquetes.length) *
        100 || 0,
    satisfactionMoyenne:
      enquetes.reduce((sum, e) => sum + (e.satisfaction_globale || 0), 0) /
        enquetes.filter((e) => e.satisfaction_globale).length || 0,
    tauxRecommandation:
      (enquetes.filter((e) => e.recommanderait).length /
        enquetes.filter((e) => e.recommanderait !== null).length) *
        100 || 0,
    projetsRealises: enquetes.filter((e) => e.projet_realise).length,
  };

  enquetes.forEach((enquete) => {
    stats.parType[enquete.type] = (stats.parType[enquete.type] || 0) + 1;
    stats.parStatut[enquete.statut] =
      (stats.parStatut[enquete.statut] || 0) + 1;
  });

  return stats;
}

/**
 * Récupère les statistiques des réclamations
 */
export async function getReclamationsStats() {
  const reclamations = await getReclamations();

  const stats = {
    total: reclamations.length,
    parStatut: {} as Record<ReclamationStatut, number>,
    nouvelles: reclamations.filter((r) => r.statut === 'nouvelle').length,
    enCours: reclamations.filter((r) => r.statut === 'en_cours').length,
    traitees: reclamations.filter((r) => r.statut === 'traitee').length,
    closes: reclamations.filter((r) => r.statut === 'close').length,
    tauxSatisfaction:
      (reclamations.filter((r) => r.satisfait).length /
        reclamations.filter((r) => r.satisfait !== null).length) *
        100 || 0,
    delaiTraitementMoyen: 0,
  };

  reclamations.forEach((reclamation) => {
    stats.parStatut[reclamation.statut] =
      (stats.parStatut[reclamation.statut] || 0) + 1;
  });

  // Calcul du délai moyen de traitement
  const reclamationsTraitees = reclamations.filter(
    (r) => r.date_traitement && r.date_reclamation
  );
  if (reclamationsTraitees.length > 0) {
    const delaiTotal = reclamationsTraitees.reduce((sum, r) => {
      const debut = new Date(r.date_reclamation).getTime();
      const fin = new Date(r.date_traitement!).getTime();
      return sum + (fin - debut) / (1000 * 60 * 60 * 24); // en jours
    }, 0);
    stats.delaiTraitementMoyen = delaiTotal / reclamationsTraitees.length;
  }

  return stats;
}

/**
 * Récupère les statistiques de la veille
 */
export async function getVeilleStats() {
  const veilles = await getVeilles();

  const stats = {
    total: veilles.length,
    parType: {} as Record<VeilleType, number>,
    diffusees: veilles.filter((v) => v.diffusee_equipe).length,
    actionsRealisees: veilles.filter((v) => v.action_realisee).length,
    actionsEnAttente: veilles.filter(
      (v) => v.actions_necessaires && !v.action_realisee
    ).length,
  };

  veilles.forEach((veille) => {
    stats.parType[veille.type] = (stats.parType[veille.type] || 0) + 1;
  });

  return stats;
}

/**
 * Récupère les statistiques des formations consultants
 */
export async function getFormationsConsultantsStats(consultantId: string) {
  const formations = await getFormationsConsultant(consultantId);

  const stats = {
    total: formations.length,
    heuresTotal: formations.reduce((sum, f) => sum + (f.duree_heures || 0), 0),
    diplomesObtenus: formations.filter((f) => f.diplome_obtenu).length,
    certificationsObtenues: formations.filter((f) => f.certification_obtenue)
      .length,
    parDomaine: {} as Record<string, number>,
  };

  formations.forEach((formation) => {
    if (formation.domaine) {
      stats.parDomaine[formation.domaine] =
        (stats.parDomaine[formation.domaine] || 0) + 1;
    }
  });

  return stats;
}

