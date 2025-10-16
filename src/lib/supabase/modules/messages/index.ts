/**
 * Module de gestion de la messagerie
 * Messagerie interne entre bénéficiaire et consultant
 */

import { createClient } from '@/lib/supabase/client';
import type {
  Message,
  Inserts,
  Updates,
} from '@/types/database.types';

// =====================================================
// MESSAGES
// =====================================================

/**
 * Récupère tous les messages d'un bilan
 */
export async function getMessages(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('bilan_id', bilanId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Message[];
}

/**
 * Récupère un message par ID
 */
export async function getMessage(messageId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('id', messageId)
    .single();

  if (error) throw error;
  return data as Message;
}

/**
 * Récupère les messages envoyés par un utilisateur
 */
export async function getMessagesByAuteur(bilanId: string, auteurId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('auteur_id', auteurId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Message[];
}

/**
 * Récupère les messages non lus d'un bilan
 */
export async function getMessagesNonLus(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('lu', false)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Message[];
}

/**
 * Récupère les messages non lus pour un utilisateur spécifique
 */
export async function getMessagesNonLusForUser(
  bilanId: string,
  userId: string
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('lu', false)
    .neq('auteur_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Message[];
}

/**
 * Crée un nouveau message
 */
export async function createMessage(message: Inserts<'messages'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

/**
 * Envoie un message
 */
export async function envoyerMessage(
  bilanId: string,
  auteurId: string,
  contenu: string,
  pieceJointeUrl?: string
) {
  return createMessage({
    bilan_id: bilanId,
    auteur_id: auteurId,
    contenu,
    piece_jointe_url: pieceJointeUrl || null,
    lu: false,
  });
}

/**
 * Met à jour un message
 */
export async function updateMessage(
  messageId: string,
  updates: Updates<'messages'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('messages')
    .update(updates)
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

/**
 * Marque un message comme lu
 */
export async function marquerCommeLu(messageId: string) {
  return updateMessage(messageId, {
    lu: true,
    lu_at: new Date().toISOString(),
  });
}

/**
 * Marque tous les messages d'un bilan comme lus
 */
export async function marquerTousCommeLus(bilanId: string, userId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('messages')
    .update({
      lu: true,
      lu_at: new Date().toISOString(),
    })
    .eq('bilan_id', bilanId)
    .eq('lu', false)
    .neq('auteur_id', userId);

  if (error) throw error;
}

/**
 * Supprime un message
 */
export async function deleteMessage(messageId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId);

  if (error) throw error;
}

// =====================================================
// STATISTIQUES
// =====================================================

/**
 * Récupère les statistiques des messages
 */
export async function getMessagesStats(bilanId: string) {
  const messages = await getMessages(bilanId);

  const stats = {
    total: messages.length,
    lus: messages.filter((m) => m.lu).length,
    nonLus: messages.filter((m) => !m.lu).length,
    avecPieceJointe: messages.filter((m) => m.piece_jointe_url).length,
  };

  return stats;
}

/**
 * Compte les messages non lus pour un utilisateur
 */
export async function compterMessagesNonLus(
  bilanId: string,
  userId: string
) {
  const supabase = createClient();
  
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('bilan_id', bilanId)
    .eq('lu', false)
    .neq('auteur_id', userId);

  if (error) throw error;
  return count || 0;
}

// =====================================================
// TEMPS RÉEL
// =====================================================

/**
 * S'abonne aux nouveaux messages d'un bilan
 */
export function subscribeToMessages(
  bilanId: string,
  callback: (message: Message) => void
) {
  const supabase = createClient();
  
  const subscription = supabase
    .channel(`messages:${bilanId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `bilan_id=eq.${bilanId}`,
      },
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();

  return subscription;
}

/**
 * Se désabonne des messages
 */
export async function unsubscribeFromMessages(subscription: any) {
  await subscription.unsubscribe();
}

