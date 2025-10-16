/**
 * Module de gestion des ressources pédagogiques
 * Bibliothèque de ressources pour les bénéficiaires
 */

import { createClient } from '@/lib/supabase/client';
import type {
  Resource,
  Inserts,
  Updates,
  ResourceType,
} from '@/types/database.types';

// =====================================================
// RESSOURCES
// =====================================================

/**
 * Récupère toutes les ressources
 */
export async function getResources() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('publiee', true)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Resource[];
}

/**
 * Récupère une ressource par ID
 */
export async function getResource(resourceId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', resourceId)
    .single();

  if (error) throw error;
  return data as Resource;
}

/**
 * Récupère les ressources par type
 */
export async function getResourcesByType(type: ResourceType) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('type', type)
    .eq('publiee', true)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Resource[];
}

/**
 * Récupère les ressources par catégorie
 */
export async function getResourcesByCategorie(categorie: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('categorie', categorie)
    .eq('publiee', true)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Resource[];
}

/**
 * Récupère les ressources par tags
 */
export async function getResourcesByTags(tags: string[]) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .overlaps('tags', tags)
    .eq('publiee', true)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Resource[];
}

/**
 * Recherche des ressources
 */
export async function searchResources(query: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .or(`titre.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('publiee', true)
    .order('created_at', { ascending: false})
    .limit(20);

  if (error) throw error;
  return data as Resource[];
}

/**
 * Récupère les ressources populaires
 */
export async function getResourcesPopulaires(limit: number = 10) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('publiee', true)
    .order('vues', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Resource[];
}

/**
 * Crée une nouvelle ressource
 */
export async function createResource(resource: Inserts<'resources'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('resources')
    .insert(resource)
    .select()
    .single();

  if (error) throw error;
  return data as Resource;
}

/**
 * Met à jour une ressource
 */
export async function updateResource(
  resourceId: string,
  updates: Updates<'resources'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('resources')
    .update(updates)
    .eq('id', resourceId)
    .select()
    .single();

  if (error) throw error;
  return data as Resource;
}

/**
 * Publie une ressource
 */
export async function publierResource(resourceId: string) {
  return updateResource(resourceId, { publiee: true });
}

/**
 * Dépublie une ressource
 */
export async function depublierResource(resourceId: string) {
  return updateResource(resourceId, { publiee: false });
}

/**
 * Incrémente le compteur de vues
 */
export async function incrementerVues(resourceId: string) {
  const supabase = createClient();

  // Récupérer le nombre de vues actuel
  const { data: resource } = await supabase
    .from('resources')
    .select('vues')
    .eq('id', resourceId)
    .single();

  if (!resource) throw new Error('Ressource introuvable');

  return updateResource(resourceId, { vues: resource.vues + 1 });
}

/**
 * Supprime une ressource
 */
export async function deleteResource(resourceId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', resourceId);

  if (error) throw error;
}

// =====================================================
// STATISTIQUES
// =====================================================

/**
 * Récupère les statistiques des ressources
 */
export async function getResourcesStats() {
  const resources = await getResources();

  const stats = {
    total: resources.length,
    parType: {} as Record<ResourceType, number>,
    parCategorie: {} as Record<string, number>,
    vuesTotal: resources.reduce((sum, r) => sum + r.vues, 0),
    vuesMoyenne: resources.reduce((sum, r) => sum + r.vues, 0) / resources.length || 0,
  };

  resources.forEach((resource) => {
    stats.parType[resource.type] = (stats.parType[resource.type] || 0) + 1;
    stats.parCategorie[resource.categorie] =
      (stats.parCategorie[resource.categorie] || 0) + 1;
  });

  return stats;
}

/**
 * Récupère les tags les plus utilisés
 */
export async function getTagsPopulaires(limit: number = 20) {
  const resources = await getResources();

  const tagsCount: Record<string, number> = {};

  resources.forEach((resource) => {
    resource.tags.forEach((tag) => {
      tagsCount[tag] = (tagsCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}

