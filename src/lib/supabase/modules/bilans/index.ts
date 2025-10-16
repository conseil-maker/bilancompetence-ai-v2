/**
 * Module de gestion des bilans
 * Gestion des dossiers de bilans de compétences
 */

import { createClient } from '@/lib/supabase/client';
import type {
  Bilan,
  Inserts,
  Updates,
  BilanStatus,
  BilanPhase,
  BilanFinanceur,
} from '@/types/database.types';

// =====================================================
// BILANS
// =====================================================

/**
 * Récupère tous les bilans
 */
export async function getBilans() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('bilans')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Bilan[];
}

/**
 * Récupère un bilan par ID
 */
export async function getBilan(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('bilans')
    .select('*')
    .eq('id', bilanId)
    .single();

  if (error) throw error;
  return data as Bilan;
}

/**
 * Récupère un bilan avec toutes ses relations
 */
export async function getBilanWithDetails(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('bilans')
    .select(`
      *,
      beneficiaire:profiles!bilans_beneficiaire_id_fkey(*),
      consultant:profiles!bilans_consultant_id_fkey(*),
      experiences(*),
      competences(*),
      pistes_metiers(*),
      plan_action(*),
      rdv(*),
      tests(*),
      documents(*),
      messages(*)
    `)
    .eq('id', bilanId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Récupère les bilans par statut
 */
export async function getBilansByStatut(statut: BilanStatus) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('bilans')
    .select('*')
    .eq('statut', statut)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Bilan[];
}

/**
 * Récupère les bilans par phase
 */
export async function getBilansByPhase(phase: BilanPhase) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('bilans')
    .select('*')
    .eq('phase_actuelle', phase)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Bilan[];
}

/**
 * Récupère les bilans par financeur
 */
export async function getBilansByFinanceur(financeur: BilanFinanceur) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('bilans')
    .select('*')
    .eq('financeur', financeur)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Bilan[];
}

/**
 * Récupère les bilans d'un bénéficiaire
 */
export async function getBilansByBeneficiaire(beneficiaireId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('bilans')
    .select('*')
    .eq('beneficiaire_id', beneficiaireId)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Bilan[];
}

/**
 * Récupère les bilans d'un consultant
 */
export async function getBilansByConsultant(consultantId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('bilans')
    .select('*')
    .eq('consultant_id', consultantId)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Bilan[];
}

/**
 * Récupère les bilans en cours
 */
export async function getBilansEnCours() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('bilans')
    .select('*')
    .eq('statut', 'en_cours')
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Bilan[];
}

/**
 * Crée un nouveau bilan
 */
export async function createBilan(bilan: Inserts<'bilans'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('bilans')
    .insert(bilan)
    .select()
    .single();

  if (error) throw error;
  return data as Bilan;
}

/**
 * Met à jour un bilan
 */
export async function updateBilan(
  bilanId: string,
  updates: Updates<'bilans'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('bilans')
    .update(updates)
    .eq('id', bilanId)
    .select()
    .single();

  if (error) throw error;
  return data as Bilan;
}

/**
 * Change le statut d'un bilan
 */
export async function changeBilanStatut(
  bilanId: string,
  statut: BilanStatus
) {
  const updates: Updates<'bilans'> = { statut };

  // Mettre à jour les dates selon le statut
  if (statut === 'en_cours') {
    updates.date_debut_reelle = new Date().toISOString();
  } else if (statut === 'termine') {
    updates.date_fin_reelle = new Date().toISOString();
  } else if (statut === 'abandonne') {
    updates.date_fin_reelle = new Date().toISOString();
  }

  return updateBilan(bilanId, updates);
}

/**
 * Change la phase d'un bilan
 */
export async function changeBilanPhase(
  bilanId: string,
  phase: BilanPhase
) {
  const supabase = createClient();

  // Récupérer le bilan actuel
  const { data: bilan } = await supabase
    .from('bilans')
    .select('phases_completees')
    .eq('id', bilanId)
    .single();

  if (!bilan) throw new Error('Bilan introuvable');

  // Ajouter la phase actuelle aux phases complétées si elle n'y est pas déjà
  const phasesCompletees = bilan.phases_completees || [];
  
  return updateBilan(bilanId, {
    phase_actuelle: phase,
    phases_completees: phasesCompletees,
  });
}

/**
 * Marque une phase comme complétée
 */
export async function completerPhase(
  bilanId: string,
  phase: BilanPhase
) {
  const supabase = createClient();

  // Récupérer le bilan actuel
  const { data: bilan } = await supabase
    .from('bilans')
    .select('phases_completees')
    .eq('id', bilanId)
    .single();

  if (!bilan) throw new Error('Bilan introuvable');

  // Ajouter la phase aux phases complétées
  const phasesCompletees = bilan.phases_completees || [];
  if (!phasesCompletees.includes(phase)) {
    phasesCompletees.push(phase);
  }

  return updateBilan(bilanId, { phases_completees: phasesCompletees });
}

/**
 * Assigne un consultant à un bilan
 */
export async function assignerConsultant(
  bilanId: string,
  consultantId: string
) {
  return updateBilan(bilanId, { consultant_id: consultantId });
}

/**
 * Met à jour le score d'engagement
 */
export async function updateEngagementScore(
  bilanId: string,
  score: number
) {
  return updateBilan(bilanId, { engagement_score: score });
}

/**
 * Active une alerte de décrochage
 */
export async function activerAlerteDecrochage(
  bilanId: string,
  raison: string
) {
  return updateBilan(bilanId, {
    alerte_decrochage: true,
    sante_bilan: 'risque',
  });
}

/**
 * Signe la convention
 */
export async function signerConvention(
  bilanId: string,
  signatureUrl: string
) {
  return updateBilan(bilanId, {
    convention_signee: true,
    convention_signed_at: new Date().toISOString(),
    convention_signature_url: signatureUrl,
  });
}

/**
 * Signe la synthèse
 */
export async function signerSynthese(
  bilanId: string,
  signatureUrl: string
) {
  return updateBilan(bilanId, {
    synthese_signee: true,
    synthese_signed_at: new Date().toISOString(),
    synthese_signature_url: signatureUrl,
  });
}

/**
 * Supprime un bilan
 */
export async function deleteBilan(bilanId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('bilans')
    .delete()
    .eq('id', bilanId);

  if (error) throw error;
}

// =====================================================
// STATISTIQUES
// =====================================================

/**
 * Récupère les statistiques des bilans
 */
export async function getBilansStats() {
  const bilans = await getBilans();

  const stats = {
    total: bilans.length,
    parStatut: {} as Record<BilanStatus, number>,
    parPhase: {} as Record<BilanPhase, number>,
    parFinanceur: {} as Record<BilanFinanceur, number>,
    conventionSignees: bilans.filter((b) => b.convention_signee).length,
    syntheseSignees: bilans.filter((b) => b.synthese_signee).length,
    alertesDecrochage: bilans.filter((b) => b.alerte_decrochage).length,
    engagementMoyen:
      bilans.reduce((sum, b) => sum + (b.engagement_score || 0), 0) /
        bilans.length || 0,
  };

  bilans.forEach((bilan) => {
    stats.parStatut[bilan.statut] = (stats.parStatut[bilan.statut] || 0) + 1;
    stats.parPhase[bilan.phase_actuelle] =
      (stats.parPhase[bilan.phase_actuelle] || 0) + 1;
    if (bilan.financeur) {
      stats.parFinanceur[bilan.financeur] =
        (stats.parFinanceur[bilan.financeur] || 0) + 1;
    }
  });

  return stats;
}

/**
 * Récupère le taux de complétion d'un bilan
 */
export async function getTauxCompletion(bilanId: string) {
  const bilan = await getBilan(bilanId);

  const phasesTotales = 3; // Phase 1, 2, 3
  const phasesCompletees = bilan.phases_completees?.length || 0;

  return Math.round((phasesCompletees / phasesTotales) * 100);
}

/**
 * Calcule la santé d'un bilan
 */
export async function calculerSanteBilan(bilanId: string) {
  const supabase = createClient();

  // Récupérer le bilan
  const bilan = await getBilan(bilanId);

  // Récupérer les données associées
  const { count: rdvCount } = await supabase
    .from('rdv')
    .select('*', { count: 'exact', head: true })
    .eq('bilan_id', bilanId)
    .eq('statut', 'termine');

  const { count: actionsCount } = await supabase
    .from('plan_action')
    .select('*', { count: 'exact', head: true })
    .eq('bilan_id', bilanId);

  const { count: actionsTermineesCount } = await supabase
    .from('plan_action')
    .select('*', { count: 'exact', head: true })
    .eq('bilan_id', bilanId)
    .eq('statut', 'termine');

  // Calculer le score d'engagement (0-100)
  let score = 50; // Base

  // RDV réalisés (+10 par RDV, max 30)
  score += Math.min((rdvCount || 0) * 10, 30);

  // Actions complétées (+20 si >50%, +10 si >25%)
  if (actionsCount && actionsCount > 0) {
    const tauxCompletion = (actionsTermineesCount || 0) / actionsCount;
    if (tauxCompletion > 0.5) score += 20;
    else if (tauxCompletion > 0.25) score += 10;
  }

  // Déterminer la santé
  let sante: 'bon' | 'moyen' | 'risque';
  if (score >= 70) sante = 'bon';
  else if (score >= 40) sante = 'moyen';
  else sante = 'risque';

  // Mettre à jour le bilan
  await updateBilan(bilanId, {
    engagement_score: score,
    sante_bilan: sante,
    alerte_decrochage: sante === 'risque',
  });

  return { score, sante };
}

