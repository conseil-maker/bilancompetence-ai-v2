/**
 * Module de gestion des rendez-vous
 * Gestion des RDV et notes d'entretien
 */

import { createClient } from '@/lib/supabase/client';
import type {
  Rdv,
  NoteEntretien,
  Inserts,
  Updates,
  RdvStatut,
  RdvType,
} from '@/types/database.types';

// =====================================================
// RENDEZ-VOUS
// =====================================================

/**
 * Récupère tous les RDV d'un bilan
 */
export async function getRdvs(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('rdv')
    .select('*')
    .eq('bilan_id', bilanId)
    .order('date_rdv', { ascending: true });

  if (error) throw error;
  return data as Rdv[];
}

/**
 * Récupère un RDV avec ses détails complets
 */
export async function getRdvWithDetails(rdvId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('rdv')
    .select(`
      *,
      beneficiaire:profiles!rdv_beneficiaire_id_fkey (*),
      consultant:profiles!rdv_consultant_id_fkey (*),
      notes_entretien (*)
    `)
    .eq('id', rdvId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Récupère les RDV par statut
 */
export async function getRdvsByStatut(bilanId: string, statut: RdvStatut) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('rdv')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('statut', statut)
    .order('date_rdv', { ascending: true });

  if (error) throw error;
  return data as Rdv[];
}

/**
 * Récupère les RDV par type
 */
export async function getRdvsByType(bilanId: string, type: RdvType) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('rdv')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('type', type)
    .order('date_rdv', { ascending: true });

  if (error) throw error;
  return data as Rdv[];
}

/**
 * Récupère les prochains RDV (à venir)
 */
export async function getProchains Rdvs(bilanId: string) {
  const supabase = createClient();
  
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('rdv')
    .select('*')
    .eq('bilan_id', bilanId)
    .gte('date_rdv', now)
    .in('statut', ['planifie', 'confirme'])
    .order('date_rdv', { ascending: true })
    .limit(5);

  if (error) throw error;
  return data as Rdv[];
}

/**
 * Récupère les RDV d'un consultant
 */
export async function getRdvsConsultant(consultantId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('rdv')
    .select('*')
    .eq('consultant_id', consultantId)
    .order('date_rdv', { ascending: true });

  if (error) throw error;
  return data as Rdv[];
}

/**
 * Récupère les RDV d'un bénéficiaire
 */
export async function getRdvsBeneficiaire(beneficiaireId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('rdv')
    .select('*')
    .eq('beneficiaire_id', beneficiaireId)
    .order('date_rdv', { ascending: true});

  if (error) throw error;
  return data as Rdv[];
}

/**
 * Crée un nouveau RDV
 */
export async function createRdv(rdv: Inserts<'rdv'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('rdv')
    .insert(rdv)
    .select()
    .single();

  if (error) throw error;
  return data as Rdv;
}

/**
 * Met à jour un RDV
 */
export async function updateRdv(rdvId: string, updates: Updates<'rdv'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('rdv')
    .update(updates)
    .eq('id', rdvId)
    .select()
    .single();

  if (error) throw error;
  return data as Rdv;
}

/**
 * Change le statut d'un RDV
 */
export async function changeRdvStatut(rdvId: string, statut: RdvStatut) {
  return updateRdv(rdvId, { statut });
}

/**
 * Confirme un RDV (bénéficiaire)
 */
export async function confirmerRdvBeneficiaire(rdvId: string) {
  return updateRdv(rdvId, {
    confirme_beneficiaire: true,
    statut: 'confirme',
  });
}

/**
 * Confirme un RDV (consultant)
 */
export async function confirmerRdvConsultant(rdvId: string) {
  return updateRdv(rdvId, {
    confirme_consultant: true,
  });
}

/**
 * Annule un RDV
 */
export async function annulerRdv(rdvId: string, raison: string) {
  return updateRdv(rdvId, {
    statut: 'annule',
    raison_annulation: raison,
  });
}

/**
 * Reporte un RDV
 */
export async function reporterRdv(
  rdvId: string,
  nouvelleDate: string,
  raison: string
) {
  const supabase = createClient();

  // Créer un nouveau RDV avec la nouvelle date
  const { data: ancienRdv } = await supabase
    .from('rdv')
    .select('*')
    .eq('id', rdvId)
    .single();

  if (!ancienRdv) throw new Error('RDV introuvable');

  // Marquer l'ancien comme reporté
  await updateRdv(rdvId, {
    statut: 'reporte',
    raison_report: raison,
  });

  // Créer le nouveau
  return createRdv({
    ...ancienRdv,
    id: undefined,
    date_rdv: nouvelleDate,
    statut: 'planifie',
    confirme_beneficiaire: false,
    confirme_consultant: false,
    rdv_precedent_id: rdvId,
  } as Inserts<'rdv'>);
}

/**
 * Supprime un RDV
 */
export async function deleteRdv(rdvId: string) {
  const supabase = createClient();
  
  const { error } = await supabase.from('rdv').delete().eq('id', rdvId);

  if (error) throw error;
}

// =====================================================
// NOTES D'ENTRETIEN
// =====================================================

/**
 * Récupère les notes d'un RDV
 */
export async function getNotesEntretien(rdvId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('notes_entretien')
    .select('*')
    .eq('rdv_id', rdvId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as NoteEntretien | null;
}

/**
 * Récupère toutes les notes d'un bilan
 */
export async function getNotesEntretienBilan(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('notes_entretien')
    .select(`
      *,
      rdv (*)
    `)
    .eq('bilan_id', bilanId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Crée des notes d'entretien
 */
export async function createNotesEntretien(notes: Inserts<'notes_entretien'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('notes_entretien')
    .insert(notes)
    .select()
    .single();

  if (error) throw error;
  return data as NoteEntretien;
}

/**
 * Met à jour des notes d'entretien
 */
export async function updateNotesEntretien(
  noteId: string,
  updates: Updates<'notes_entretien'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('notes_entretien')
    .update(updates)
    .eq('id', noteId)
    .select()
    .single();

  if (error) throw error;
  return data as NoteEntretien;
}

/**
 * Partage les notes avec le bénéficiaire
 */
export async function partagerNotesAvecBeneficiaire(noteId: string) {
  return updateNotesEntretien(noteId, {
    partage_avec_beneficiaire: true,
    confidentiel: false,
  });
}

/**
 * Supprime des notes d'entretien
 */
export async function deleteNotesEntretien(noteId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('notes_entretien')
    .delete()
    .eq('id', noteId);

  if (error) throw error;
}

// =====================================================
// RAPPELS
// =====================================================

/**
 * Récupère les RDV nécessitant un rappel 24h
 */
export async function getRdvsRappel24h() {
  const supabase = createClient();
  
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from('rdv')
    .select('*')
    .in('statut', ['planifie', 'confirme'])
    .eq('rappel_24h_envoye', false)
    .gte('date_rdv', now.toISOString())
    .lte('date_rdv', in24h.toISOString());

  if (error) throw error;
  return data as Rdv[];
}

/**
 * Récupère les RDV nécessitant un rappel 1h
 */
export async function getRdvsRappel1h() {
  const supabase = createClient();
  
  const now = new Date();
  const in1h = new Date(now.getTime() + 60 * 60 * 1000);

  const { data, error } = await supabase
    .from('rdv')
    .select('*')
    .in('statut', ['planifie', 'confirme'])
    .eq('rappel_1h_envoye', false)
    .gte('date_rdv', now.toISOString())
    .lte('date_rdv', in1h.toISOString());

  if (error) throw error;
  return data as Rdv[];
}

/**
 * Marque le rappel 24h comme envoyé
 */
export async function marquerRappel24hEnvoye(rdvId: string) {
  return updateRdv(rdvId, { rappel_24h_envoye: true });
}

/**
 * Marque le rappel 1h comme envoyé
 */
export async function marquerRappel1hEnvoye(rdvId: string) {
  return updateRdv(rdvId, { rappel_1h_envoye: true });
}

// =====================================================
// STATISTIQUES
// =====================================================

/**
 * Récupère les statistiques des RDV
 */
export async function getRdvsStats(bilanId: string) {
  const rdvs = await getRdvs(bilanId);

  const stats = {
    total: rdvs.length,
    parStatut: {} as Record<RdvStatut, number>,
    parType: {} as Record<RdvType, number>,
    confirmes: rdvs.filter(
      (r) => r.confirme_beneficiaire && r.confirme_consultant
    ).length,
    aVenir: rdvs.filter(
      (r) =>
        new Date(r.date_rdv) > new Date() &&
        ['planifie', 'confirme'].includes(r.statut)
    ).length,
    passes: rdvs.filter((r) => r.statut === 'termine').length,
    annules: rdvs.filter((r) => r.statut === 'annule').length,
    dureeTotal: rdvs.reduce((sum, r) => sum + r.duree_minutes, 0),
  };

  rdvs.forEach((rdv) => {
    stats.parStatut[rdv.statut] = (stats.parStatut[rdv.statut] || 0) + 1;
    stats.parType[rdv.type] = (stats.parType[rdv.type] || 0) + 1;
  });

  return stats;
}

/**
 * Récupère le calendrier des RDV
 */
export async function getCalendrierRdvs(
  consultantId: string,
  dateDebut: string,
  dateFin: string
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('rdv')
    .select('*')
    .eq('consultant_id', consultantId)
    .gte('date_rdv', dateDebut)
    .lte('date_rdv', dateFin)
    .order('date_rdv', { ascending: true });

  if (error) throw error;
  return data as Rdv[];
}

