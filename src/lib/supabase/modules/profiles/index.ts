/**
 * Module de gestion des profils utilisateurs
 * Gestion des utilisateurs (bénéficiaires, consultants, administrateurs)
 */

import { createClient } from '@/lib/supabase/client';
import type {
  Profile,
  Inserts,
  Updates,
  UserRole,
} from '@/types/database.types';

// =====================================================
// PROFILS
// =====================================================

/**
 * Récupère le profil de l'utilisateur connecté
 */
export async function getCurrentProfile() {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Non authentifié');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Récupère un profil par ID
 */
export async function getProfile(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Récupère tous les profils (admin uniquement)
 */
export async function getAllProfiles() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Profile[];
}

/**
 * Récupère les profils par rôle
 */
export async function getProfilesByRole(role: UserRole) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', role)
    .order('last_name', { ascending: true });

  if (error) throw error;
  return data as Profile[];
}

/**
 * Récupère tous les consultants actifs
 */
export async function getConsultantsActifs() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'consultant')
    .eq('is_active', true)
    .order('last_name', { ascending: true });

  if (error) throw error;
  return data as Profile[];
}

/**
 * Récupère tous les bénéficiaires
 */
export async function getBeneficiaires() {
  return getProfilesByRole('beneficiaire');
}

/**
 * Recherche des profils par nom ou email
 */
export async function searchProfiles(query: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`last_name.ilike.%${query}%,first_name.ilike.%${query}%,email.ilike.%${query}%`)
    .order('last_name', { ascending: true })
    .limit(20);

  if (error) throw error;
  return data as Profile[];
}

/**
 * Crée un nouveau profil
 */
export async function createProfile(profile: Inserts<'profiles'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Met à jour un profil
 */
export async function updateProfile(
  userId: string,
  updates: Updates<'profiles'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Met à jour le profil de l'utilisateur connecté
 */
export async function updateCurrentProfile(updates: Updates<'profiles'>) {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Non authentifié');

  return updateProfile(user.id, updates);
}

/**
 * Active un utilisateur
 */
export async function activerUtilisateur(userId: string) {
  return updateProfile(userId, { is_active: true });
}

/**
 * Désactive un utilisateur
 */
export async function desactiverUtilisateur(userId: string) {
  return updateProfile(userId, { is_active: false });
}

/**
 * Met à jour la dernière connexion
 */
export async function updateLastLogin(userId: string) {
  return updateProfile(userId, { last_login_at: new Date().toISOString() });
}

/**
 * Supprime un profil
 */
export async function deleteProfile(userId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) throw error;
}

// =====================================================
// RELATIONS
// =====================================================

/**
 * Récupère tous les bilans d'un bénéficiaire
 */
export async function getBilansBeneficiaire(beneficiaireId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('bilans')
    .select('*')
    .eq('beneficiaire_id', beneficiaireId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Récupère tous les bilans d'un consultant
 */
export async function getBilansConsultant(consultantId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('bilans')
    .select('*')
    .eq('consultant_id', consultantId)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data;
}

/**
 * Récupère tous les RDV d'un utilisateur
 */
export async function getRdvsUtilisateur(userId: string, role: UserRole) {
  const supabase = createClient();
  
  const column = role === 'beneficiaire' ? 'beneficiaire_id' : 'consultant_id';

  const { data, error } = await supabase
    .from('rdv')
    .select('*')
    .eq(column, userId)
    .order('date_rdv', { ascending: true });

  if (error) throw error;
  return data;
}

// =====================================================
// STATISTIQUES
// =====================================================

/**
 * Récupère les statistiques des utilisateurs
 */
export async function getProfilesStats() {
  const profiles = await getAllProfiles();

  const stats = {
    total: profiles.length,
    parRole: {} as Record<UserRole, number>,
    actifs: profiles.filter((p) => p.is_active).length,
    inactifs: profiles.filter((p) => !p.is_active).length,
  };

  profiles.forEach((profile) => {
    stats.parRole[profile.role] = (stats.parRole[profile.role] || 0) + 1;
  });

  return stats;
}

/**
 * Récupère les statistiques d'un consultant
 */
export async function getConsultantStats(consultantId: string) {
  const supabase = createClient();

  // Nombre de bilans
  const { count: bilansCount } = await supabase
    .from('bilans')
    .select('*', { count: 'exact', head: true })
    .eq('consultant_id', consultantId);

  // Nombre de RDV
  const { count: rdvCount } = await supabase
    .from('rdv')
    .select('*', { count: 'exact', head: true })
    .eq('consultant_id', consultantId);

  // Heures de formation
  const { data: formations } = await supabase
    .from('formations_consultants')
    .select('duree_heures')
    .eq('consultant_id', consultantId);

  const heuresFormation =
    formations?.reduce((sum, f) => sum + (f.duree_heures || 0), 0) || 0;

  return {
    bilans: bilansCount || 0,
    rdv: rdvCount || 0,
    heuresFormation,
  };
}

/**
 * Récupère les statistiques d'un bénéficiaire
 */
export async function getBeneficiaireStats(beneficiaireId: string) {
  const supabase = createClient();

  // Nombre de bilans
  const { count: bilansCount } = await supabase
    .from('bilans')
    .select('*', { count: 'exact', head: true })
    .eq('beneficiaire_id', beneficiaireId);

  // Nombre de RDV
  const { count: rdvCount } = await supabase
    .from('rdv')
    .select('*', { count: 'exact', head: true })
    .eq('beneficiaire_id', beneficiaireId);

  // Nombre de compétences
  const { data: bilans } = await supabase
    .from('bilans')
    .select('id')
    .eq('beneficiaire_id', beneficiaireId);

  let competencesCount = 0;
  if (bilans) {
    for (const bilan of bilans) {
      const { count } = await supabase
        .from('competences')
        .select('*', { count: 'exact', head: true })
        .eq('bilan_id', bilan.id);
      competencesCount += count || 0;
    }
  }

  return {
    bilans: bilansCount || 0,
    rdv: rdvCount || 0,
    competences: competencesCount,
  };
}

