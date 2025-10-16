/**
 * Module de gestion des notifications
 * Système de notifications multi-canaux
 */

import { createClient } from '@/lib/supabase/client';
import type {
  Notification,
  Inserts,
  Updates,
  NotificationType,
  NotificationPriorite,
} from '@/types/database.types';

// =====================================================
// NOTIFICATIONS
// =====================================================

/**
 * Récupère toutes les notifications d'un utilisateur
 */
export async function getNotifications(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('archivee', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Notification[];
}

/**
 * Récupère les notifications non lues
 */
export async function getNotificationsNonLues(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('lue', false)
    .eq('archivee', false)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Notification[];
}

/**
 * Récupère les notifications par type
 */
export async function getNotificationsByType(
  userId: string,
  type: NotificationType
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .eq('archivee', false)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Notification[];
}

/**
 * Récupère les notifications par priorité
 */
export async function getNotificationsByPriorite(
  userId: string,
  priorite: NotificationPriorite
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('priorite', priorite)
    .eq('archivee', false)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Notification[];
}

/**
 * Crée une nouvelle notification
 */
export async function createNotification(notification: Inserts<'notifications'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('notifications')
    .insert(notification)
    .select()
    .single();

  if (error) throw error;
  return data as Notification;
}

/**
 * Met à jour une notification
 */
export async function updateNotification(
  notificationId: string,
  updates: Updates<'notifications'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('notifications')
    .update(updates)
    .eq('id', notificationId)
    .select()
    .single();

  if (error) throw error;
  return data as Notification;
}

/**
 * Marque une notification comme lue
 */
export async function marquerCommeLue(notificationId: string) {
  return updateNotification(notificationId, {
    lue: true,
    lue_at: new Date().toISOString(),
  });
}

/**
 * Marque toutes les notifications comme lues
 */
export async function marquerToutesCommeLues(userId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('notifications')
    .update({
      lue: true,
      lue_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('lue', false);

  if (error) throw error;
}

/**
 * Archive une notification
 */
export async function archiverNotification(notificationId: string) {
  return updateNotification(notificationId, { archivee: true });
}

/**
 * Archive toutes les notifications lues
 */
export async function archiverToutesLues(userId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('notifications')
    .update({ archivee: true })
    .eq('user_id', userId)
    .eq('lue', true);

  if (error) throw error;
}

/**
 * Supprime une notification
 */
export async function deleteNotification(notificationId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) throw error;
}

/**
 * Supprime toutes les notifications archivées
 */
export async function deleteNotificationsArchivees(userId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', userId)
    .eq('archivee', true);

  if (error) throw error;
}

// =====================================================
// NOTIFICATIONS SPÉCIFIQUES
// =====================================================

/**
 * Crée une notification de RDV
 */
export async function notifierRdv(
  userId: string,
  rdvId: string,
  titre: string,
  message: string,
  priorite: NotificationPriorite = 'normale'
) {
  return createNotification({
    user_id: userId,
    type: 'rdv',
    titre,
    message,
    lien: `/rdv/${rdvId}`,
    action_label: 'Voir le RDV',
    priorite,
    rdv_id: rdvId,
    lue: false,
    archivee: false,
    envoye_email: false,
    envoye_sms: false,
    envoye_push: false,
  });
}

/**
 * Crée une notification de message
 */
export async function notifierMessage(
  userId: string,
  bilanId: string,
  titre: string,
  message: string
) {
  return createNotification({
    user_id: userId,
    type: 'message',
    titre,
    message,
    lien: `/bilans/${bilanId}/messages`,
    action_label: 'Lire le message',
    priorite: 'normale',
    bilan_id: bilanId,
    lue: false,
    archivee: false,
    envoye_email: false,
    envoye_sms: false,
    envoye_push: false,
  });
}

/**
 * Crée une notification d'action à échéance
 */
export async function notifierActionEcheance(
  userId: string,
  actionId: string,
  bilanId: string,
  titre: string,
  message: string
) {
  return createNotification({
    user_id: userId,
    type: 'action_echeance',
    titre,
    message,
    lien: `/bilans/${bilanId}/plan-action`,
    action_label: 'Voir l\'action',
    priorite: 'haute',
    bilan_id: bilanId,
    action_id: actionId,
    lue: false,
    archivee: false,
    envoye_email: false,
    envoye_sms: false,
    envoye_push: false,
  });
}

/**
 * Crée une notification de phase complétée
 */
export async function notifierPhaseComplete(
  userId: string,
  bilanId: string,
  phase: string,
  titre: string,
  message: string
) {
  return createNotification({
    user_id: userId,
    type: 'phase_complete',
    titre,
    message,
    lien: `/bilans/${bilanId}`,
    action_label: 'Voir le bilan',
    priorite: 'haute',
    bilan_id: bilanId,
    lue: false,
    archivee: false,
    envoye_email: false,
    envoye_sms: false,
    envoye_push: false,
  });
}

/**
 * Crée une notification de test disponible
 */
export async function notifierTestDisponible(
  userId: string,
  bilanId: string,
  titre: string,
  message: string
) {
  return createNotification({
    user_id: userId,
    type: 'test_disponible',
    titre,
    message,
    lien: `/bilans/${bilanId}/tests`,
    action_label: 'Passer le test',
    priorite: 'normale',
    bilan_id: bilanId,
    lue: false,
    archivee: false,
    envoye_email: false,
    envoye_sms: false,
    envoye_push: false,
  });
}

/**
 * Crée une notification d'alerte
 */
export async function notifierAlerte(
  userId: string,
  bilanId: string,
  titre: string,
  message: string,
  priorite: NotificationPriorite = 'urgente'
) {
  return createNotification({
    user_id: userId,
    type: 'alerte',
    titre,
    message,
    lien: `/bilans/${bilanId}`,
    action_label: 'Voir les détails',
    priorite,
    bilan_id: bilanId,
    lue: false,
    archivee: false,
    envoye_email: false,
    envoye_sms: false,
    envoye_push: false,
  });
}

// =====================================================
// ENVOI MULTI-CANAUX
// =====================================================

/**
 * Envoie une notification par email
 */
export async function envoyerParEmail(notificationId: string) {
  // TODO: Implémenter l'envoi d'email via Resend ou autre service
  return updateNotification(notificationId, { envoye_email: true });
}

/**
 * Envoie une notification par SMS
 */
export async function envoyerParSMS(notificationId: string) {
  // TODO: Implémenter l'envoi de SMS via Twilio ou autre service
  return updateNotification(notificationId, { envoye_sms: true });
}

/**
 * Envoie une notification push
 */
export async function envoyerPush(notificationId: string) {
  // TODO: Implémenter l'envoi de push via Firebase ou autre service
  return updateNotification(notificationId, { envoye_push: true });
}

// =====================================================
// STATISTIQUES
// =====================================================

/**
 * Récupère les statistiques des notifications
 */
export async function getNotificationsStats(userId: string) {
  const notifications = await getNotifications(userId);

  const stats = {
    total: notifications.length,
    nonLues: notifications.filter((n) => !n.lue).length,
    lues: notifications.filter((n) => n.lue).length,
    parType: {} as Record<NotificationType, number>,
    parPriorite: {} as Record<NotificationPriorite, number>,
    envoyeesEmail: notifications.filter((n) => n.envoye_email).length,
    envoyeesSMS: notifications.filter((n) => n.envoye_sms).length,
    envoyeesPush: notifications.filter((n) => n.envoye_push).length,
  };

  notifications.forEach((notification) => {
    stats.parType[notification.type] =
      (stats.parType[notification.type] || 0) + 1;
    stats.parPriorite[notification.priorite] =
      (stats.parPriorite[notification.priorite] || 0) + 1;
  });

  return stats;
}

/**
 * Compte les notifications non lues
 */
export async function compterNotificationsNonLues(userId: string) {
  const supabase = createClient();
  
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('lue', false)
    .eq('archivee', false);

  if (error) throw error;
  return count || 0;
}

// =====================================================
// NETTOYAGE
// =====================================================

/**
 * Supprime les notifications expirées
 */
export async function nettoyerNotificationsExpirees() {
  const supabase = createClient();
  
  const now = new Date().toISOString();

  const { error } = await supabase
    .from('notifications')
    .delete()
    .lt('expires_at', now);

  if (error) throw error;
}

/**
 * Archive les anciennes notifications (30 jours)
 */
export async function archiverAnciennesNotifications(userId: string) {
  const supabase = createClient();
  
  const date30JoursAvant = new Date();
  date30JoursAvant.setDate(date30JoursAvant.getDate() - 30);

  const { error } = await supabase
    .from('notifications')
    .update({ archivee: true })
    .eq('user_id', userId)
    .eq('lue', true)
    .lt('created_at', date30JoursAvant.toISOString());

  if (error) throw error;
}

