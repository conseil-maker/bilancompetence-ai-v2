/**
 * Module de gestion du plan d'action
 * Plan d'Action Interactif Kanban
 */

import { createClient } from '@/lib/supabase/client';
import type {
  PlanAction,
  Inserts,
  Updates,
  ActionStatut,
  ActionType,
} from '@/types/database.types';

// =====================================================
// ACTIONS
// =====================================================

/**
 * Récupère toutes les actions d'un bilan
 */
export async function getActions(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('plan_action')
    .select('*')
    .eq('bilan_id', bilanId)
    .order('ordre', { ascending: true });

  if (error) throw error;
  return data as PlanAction[];
}

/**
 * Récupère les actions par statut (pour Kanban)
 */
export async function getActionsByStatut(
  bilanId: string,
  statut: ActionStatut
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('plan_action')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('statut', statut)
    .order('ordre', { ascending: true });

  if (error) throw error;
  return data as PlanAction[];
}

/**
 * Récupère les actions par type
 */
export async function getActionsByType(bilanId: string, type: ActionType) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('plan_action')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('type', type)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as PlanAction[];
}

/**
 * Récupère les actions par catégorie temporelle
 */
export async function getActionsByCategorie(
  bilanId: string,
  categorie: 'court_terme' | 'moyen_terme' | 'long_terme'
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('plan_action')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('categorie', categorie)
    .order('priorite', { ascending: true });

  if (error) throw error;
  return data as PlanAction[];
}

/**
 * Récupère les actions à échéance proche (7 jours)
 */
export async function getActionsEcheanceProche(bilanId: string) {
  const supabase = createClient();
  
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() + 7);

  const { data, error } = await supabase
    .from('plan_action')
    .select('*')
    .eq('bilan_id', bilanId)
    .neq('statut', 'termine')
    .neq('statut', 'abandonne')
    .lte('date_echeance', dateLimit.toISOString())
    .order('date_echeance', { ascending: true });

  if (error) throw error;
  return data as PlanAction[];
}

/**
 * Récupère les actions validées par le consultant
 */
export async function getActionsValidees(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('plan_action')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('validee_par_consultant', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as PlanAction[];
}

/**
 * Crée une nouvelle action
 */
export async function createAction(action: Inserts<'plan_action'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('plan_action')
    .insert(action)
    .select()
    .single();

  if (error) throw error;
  return data as PlanAction;
}

/**
 * Met à jour une action
 */
export async function updateAction(
  actionId: string,
  updates: Updates<'plan_action'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('plan_action')
    .update(updates)
    .eq('id', actionId)
    .select()
    .single();

  if (error) throw error;
  return data as PlanAction;
}

/**
 * Change le statut d'une action (Kanban)
 */
export async function changeActionStatut(
  actionId: string,
  statut: ActionStatut,
  ordre?: number
) {
  const updates: Updates<'plan_action'> = { statut };
  
  if (ordre !== undefined) {
    updates.ordre = ordre;
  }

  // Si terminé, mettre la date de fin réelle
  if (statut === 'termine') {
    updates.date_fin_reelle = new Date().toISOString();
    updates.progression = 100;
  }

  // Si en cours et pas de date de début, la mettre
  if (statut === 'en_cours') {
    const supabase = createClient();
    const { data: action } = await supabase
      .from('plan_action')
      .select('date_debut_reelle')
      .eq('id', actionId)
      .single();

    if (action && !action.date_debut_reelle) {
      updates.date_debut_reelle = new Date().toISOString();
    }
  }

  return updateAction(actionId, updates);
}

/**
 * Met à jour la progression d'une action
 */
export async function updateActionProgression(
  actionId: string,
  progression: number
) {
  const updates: Updates<'plan_action'> = { progression };

  // Si progression = 100%, passer en terminé
  if (progression >= 100) {
    updates.statut = 'termine';
    updates.date_fin_reelle = new Date().toISOString();
  }

  return updateAction(actionId, updates);
}

/**
 * Valide une action (consultant)
 */
export async function validerAction(
  actionId: string,
  commentaire?: string
) {
  return updateAction(actionId, {
    validee_par_consultant: true,
    commentaire_consultant: commentaire,
  });
}

/**
 * Réordonne les actions dans une colonne Kanban
 */
export async function reorderActions(
  bilanId: string,
  statut: ActionStatut,
  actionIds: string[]
) {
  const supabase = createClient();

  // Mettre à jour l'ordre de chaque action
  const updates = actionIds.map((id, index) =>
    supabase
      .from('plan_action')
      .update({ ordre: index })
      .eq('id', id)
      .eq('bilan_id', bilanId)
      .eq('statut', statut)
  );

  const results = await Promise.all(updates);
  
  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    throw new Error('Erreur lors du réordonnancement des actions');
  }
}

/**
 * Supprime une action
 */
export async function deleteAction(actionId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('plan_action')
    .delete()
    .eq('id', actionId);

  if (error) throw error;
}

// =====================================================
// RAPPELS
// =====================================================

/**
 * Active un rappel pour une action
 */
export async function activerRappel(
  actionId: string,
  dateRappel: string
) {
  return updateAction(actionId, {
    rappel_active: true,
    date_rappel: dateRappel,
    rappel_envoye: false,
  });
}

/**
 * Désactive un rappel
 */
export async function desactiverRappel(actionId: string) {
  return updateAction(actionId, {
    rappel_active: false,
    date_rappel: null,
  });
}

// =====================================================
// STATISTIQUES
// =====================================================

/**
 * Récupère les statistiques du plan d'action
 */
export async function getPlanActionStats(bilanId: string) {
  const actions = await getActions(bilanId);

  const stats = {
    total: actions.length,
    parStatut: {} as Record<ActionStatut, number>,
    parType: {} as Record<ActionType, number>,
    validees: actions.filter((a) => a.validee_par_consultant).length,
    nonValidees: actions.filter((a) => !a.validee_par_consultant).length,
    progressionMoyenne:
      actions.reduce((sum, a) => sum + a.progression, 0) / actions.length || 0,
    echeanceProche: 0,
    enRetard: 0,
  };

  const now = new Date();

  actions.forEach((action) => {
    // Par statut
    stats.parStatut[action.statut] = (stats.parStatut[action.statut] || 0) + 1;

    // Par type
    stats.parType[action.type] = (stats.parType[action.type] || 0) + 1;

    // Échéance proche (7 jours)
    if (action.date_echeance) {
      const echeance = new Date(action.date_echeance);
      const diffJours =
        (echeance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

      if (
        diffJours >= 0 &&
        diffJours <= 7 &&
        action.statut !== 'termine' &&
        action.statut !== 'abandonne'
      ) {
        stats.echeanceProche++;
      }

      // En retard
      if (
        diffJours < 0 &&
        action.statut !== 'termine' &&
        action.statut !== 'abandonne'
      ) {
        stats.enRetard++;
      }
    }
  });

  return stats;
}

/**
 * Récupère le board Kanban complet
 */
export async function getKanbanBoard(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('plan_action')
    .select('*')
    .eq('bilan_id', bilanId)
    .order('ordre', { ascending: true });

  if (error) throw error;

  // Organiser par colonnes
  const board = {
    a_faire: [] as PlanAction[],
    en_cours: [] as PlanAction[],
    en_attente: [] as PlanAction[],
    termine: [] as PlanAction[],
    abandonne: [] as PlanAction[],
  };

  data.forEach((action) => {
    board[action.statut].push(action);
  });

  return board;
}

