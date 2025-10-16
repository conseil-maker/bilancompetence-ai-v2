/**
 * Module de gestion des pistes métiers et formations
 * Simulateur de Carrière + Gap Analysis
 */

import { createClient } from '@/lib/supabase/client';
import type {
  PisteMetier,
  EcartCompetence,
  Formation,
  Inserts,
  Updates,
  PisteMetierStatut,
  FormationStatut,
} from '@/types/database.types';

// =====================================================
// PISTES METIERS
// =====================================================

/**
 * Récupère toutes les pistes métiers d'un bilan
 */
export async function getPistesMetiers(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('pistes_metiers')
    .select('*')
    .eq('bilan_id', bilanId)
    .order('score_adequation', { ascending: false });

  if (error) throw error;
  return data as PisteMetier[];
}

/**
 * Récupère une piste métier avec ses détails complets
 */
export async function getPisteMetierWithDetails(pisteMetierId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('pistes_metiers')
    .select(`
      *,
      ecarts_competences (*),
      formations (*)
    `)
    .eq('id', pisteMetierId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Récupère les pistes métiers par statut
 */
export async function getPistesMetiersByStatut(
  bilanId: string,
  statut: PisteMetierStatut
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('pistes_metiers')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('statut', statut)
    .order('priorite', { ascending: true });

  if (error) throw error;
  return data as PisteMetier[];
}

/**
 * Récupère les pistes métiers favorites
 */
export async function getPistesMetiersFavorites(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('pistes_metiers')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('favoris', true)
    .order('score_adequation', { ascending: false });

  if (error) throw error;
  return data as PisteMetier[];
}

/**
 * Crée une nouvelle piste métier
 */
export async function createPisteMetier(pisteMetier: Inserts<'pistes_metiers'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('pistes_metiers')
    .insert(pisteMetier)
    .select()
    .single();

  if (error) throw error;
  return data as PisteMetier;
}

/**
 * Met à jour une piste métier
 */
export async function updatePisteMetier(
  pisteMetierId: string,
  updates: Updates<'pistes_metiers'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('pistes_metiers')
    .update(updates)
    .eq('id', pisteMetierId)
    .select()
    .single();

  if (error) throw error;
  return data as PisteMetier;
}

/**
 * Change le statut d'une piste métier
 */
export async function changePisteMetierStatut(
  pisteMetierId: string,
  statut: PisteMetierStatut
) {
  return updatePisteMetier(pisteMetierId, { statut });
}

/**
 * Toggle le favori d'une piste métier
 */
export async function togglePisteMetierFavori(pisteMetierId: string) {
  const supabase = createClient();
  
  // Récupère l'état actuel
  const { data: piste } = await supabase
    .from('pistes_metiers')
    .select('favoris')
    .eq('id', pisteMetierId)
    .single();

  if (!piste) throw new Error('Piste métier introuvable');

  return updatePisteMetier(pisteMetierId, { favoris: !piste.favoris });
}

/**
 * Supprime une piste métier
 */
export async function deletePisteMetier(pisteMetierId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('pistes_metiers')
    .delete()
    .eq('id', pisteMetierId);

  if (error) throw error;
}

// =====================================================
// GAP ANALYSIS (ECARTS DE COMPETENCES)
// =====================================================

/**
 * Récupère les écarts de compétences pour une piste métier
 */
export async function getEcartsCompetences(pisteMetierId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('ecarts_competences')
    .select('*')
    .eq('piste_metier_id', pisteMetierId)
    .order('importance', { ascending: true });

  if (error) throw error;
  return data as EcartCompetence[];
}

/**
 * Crée un écart de compétence
 */
export async function createEcartCompetence(ecart: Inserts<'ecarts_competences'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('ecarts_competences')
    .insert(ecart)
    .select()
    .single();

  if (error) throw error;
  return data as EcartCompetence;
}

/**
 * Génère l'analyse d'écart pour une piste métier via IA
 */
export async function generateGapAnalysis(pisteMetierId: string) {
  const response = await fetch('/api/pistes-metiers/gap-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pisteMetierId }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la génération de l\'analyse d\'écart');
  }

  return response.json();
}

// =====================================================
// FORMATIONS
// =====================================================

/**
 * Récupère toutes les formations d'un bilan
 */
export async function getFormations(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('formations')
    .select('*')
    .eq('bilan_id', bilanId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Formation[];
}

/**
 * Récupère les formations pour une piste métier
 */
export async function getFormationsForPisteMetier(pisteMetierId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('formations')
    .select('*')
    .eq('piste_metier_id', pisteMetierId)
    .order('eligible_cpf', { ascending: false });

  if (error) throw error;
  return data as Formation[];
}

/**
 * Récupère les formations par statut
 */
export async function getFormationsByStatut(
  bilanId: string,
  statut: FormationStatut
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('formations')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('statut', statut)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Formation[];
}

/**
 * Récupère les formations favorites
 */
export async function getFormationsFavorites(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('formations')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('favoris', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Formation[];
}

/**
 * Récupère les formations éligibles CPF
 */
export async function getFormationsEligiblesCPF(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('formations')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('eligible_cpf', true)
    .order('cout_euros', { ascending: true });

  if (error) throw error;
  return data as Formation[];
}

/**
 * Crée une nouvelle formation
 */
export async function createFormation(formation: Inserts<'formations'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('formations')
    .insert(formation)
    .select()
    .single();

  if (error) throw error;
  return data as Formation;
}

/**
 * Met à jour une formation
 */
export async function updateFormation(
  formationId: string,
  updates: Updates<'formations'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('formations')
    .update(updates)
    .eq('id', formationId)
    .select()
    .single();

  if (error) throw error;
  return data as Formation;
}

/**
 * Change le statut d'une formation
 */
export async function changeFormationStatut(
  formationId: string,
  statut: FormationStatut
) {
  return updateFormation(formationId, { statut });
}

/**
 * Toggle le favori d'une formation
 */
export async function toggleFormationFavori(formationId: string) {
  const supabase = createClient();
  
  const { data: formation } = await supabase
    .from('formations')
    .select('favoris')
    .eq('id', formationId)
    .single();

  if (!formation) throw new Error('Formation introuvable');

  return updateFormation(formationId, { favoris: !formation.favoris });
}

/**
 * Supprime une formation
 */
export async function deleteFormation(formationId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('formations')
    .delete()
    .eq('id', formationId);

  if (error) throw error;
}

// =====================================================
// SUGGESTIONS IA
// =====================================================

/**
 * Suggère des pistes métiers basées sur le profil du bénéficiaire
 */
export async function suggestPistesMetiers(bilanId: string) {
  const response = await fetch('/api/pistes-metiers/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bilanId }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la suggestion de pistes métiers');
  }

  return response.json();
}

/**
 * Suggère des formations pour combler les écarts de compétences
 */
export async function suggestFormations(pisteMetierId: string) {
  const response = await fetch('/api/formations/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pisteMetierId }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la suggestion de formations');
  }

  return response.json();
}

// =====================================================
// STATISTIQUES
// =====================================================

/**
 * Récupère les statistiques des pistes métiers
 */
export async function getPistesMetiersStats(bilanId: string) {
  const pistes = await getPistesMetiers(bilanId);

  const stats = {
    total: pistes.length,
    parStatut: {} as Record<PisteMetierStatut, number>,
    favorites: pistes.filter((p) => p.favoris).length,
    scoreAdequationMoyen:
      pistes.reduce((sum, p) => sum + (p.score_adequation || 0), 0) /
      pistes.length,
    enquetesRealisees: pistes.filter((p) => p.enquete_realisee).length,
  };

  pistes.forEach((piste) => {
    stats.parStatut[piste.statut] = (stats.parStatut[piste.statut] || 0) + 1;
  });

  return stats;
}

/**
 * Récupère les statistiques des formations
 */
export async function getFormationsStats(bilanId: string) {
  const formations = await getFormations(bilanId);

  const stats = {
    total: formations.length,
    parStatut: {} as Record<FormationStatut, number>,
    favorites: formations.filter((f) => f.favoris).length,
    eligiblesCPF: formations.filter((f) => f.eligible_cpf).length,
    coutTotal: formations.reduce((sum, f) => sum + (f.cout_euros || 0), 0),
    dureeTotal: formations.reduce((sum, f) => sum + (f.duree_heures || 0), 0),
  };

  formations.forEach((formation) => {
    stats.parStatut[formation.statut] =
      (stats.parStatut[formation.statut] || 0) + 1;
  });

  return stats;
}

