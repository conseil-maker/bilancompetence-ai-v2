/**
 * Module de gestion des compétences et expériences
 * Profil de Talents Dynamique
 */

import { createClient } from '@/lib/supabase/client';
import type {
  Experience,
  Competence,
  CompetenceExperience,
  Inserts,
  Updates,
  ExperienceType,
  CompetenceCategorie,
  CompetenceSource,
} from '@/types/database.types';

// =====================================================
// EXPERIENCES
// =====================================================

/**
 * Récupère toutes les expériences d'un bilan
 */
export async function getExperiences(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('bilan_id', bilanId)
    .order('date_debut', { ascending: false });

  if (error) throw error;
  return data as Experience[];
}

/**
 * Récupère une expérience avec ses compétences associées
 */
export async function getExperienceWithCompetences(experienceId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('experiences')
    .select(`
      *,
      competences_experiences (
        id,
        contexte,
        niveau_utilisation,
        competences (*)
      )
    `)
    .eq('id', experienceId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Crée une nouvelle expérience
 */
export async function createExperience(experience: Inserts<'experiences'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('experiences')
    .insert(experience)
    .select()
    .single();

  if (error) throw error;
  return data as Experience;
}

/**
 * Met à jour une expérience
 */
export async function updateExperience(
  experienceId: string,
  updates: Updates<'experiences'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('experiences')
    .update(updates)
    .eq('id', experienceId)
    .select()
    .single();

  if (error) throw error;
  return data as Experience;
}

/**
 * Supprime une expérience
 */
export async function deleteExperience(experienceId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', experienceId);

  if (error) throw error;
}

// =====================================================
// COMPETENCES
// =====================================================

/**
 * Récupère toutes les compétences d'un bilan
 */
export async function getCompetences(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('competences')
    .select('*')
    .eq('bilan_id', bilanId)
    .order('categorie', { ascending: true })
    .order('nom', { ascending: true });

  if (error) throw error;
  return data as Competence[];
}

/**
 * Récupère les compétences par catégorie
 */
export async function getCompetencesByCategorie(
  bilanId: string,
  categorie: CompetenceCategorie
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('competences')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('categorie', categorie)
    .order('nom', { ascending: true });

  if (error) throw error;
  return data as Competence[];
}

/**
 * Crée une nouvelle compétence
 */
export async function createCompetence(competence: Inserts<'competences'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('competences')
    .insert(competence)
    .select()
    .single();

  if (error) throw error;
  return data as Competence;
}

/**
 * Met à jour une compétence
 */
export async function updateCompetence(
  competenceId: string,
  updates: Updates<'competences'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('competences')
    .update(updates)
    .eq('id', competenceId)
    .select()
    .single();

  if (error) throw error;
  return data as Competence;
}

/**
 * Valide une compétence (consultant)
 */
export async function validerCompetence(competenceId: string) {
  return updateCompetence(competenceId, { validee_par_consultant: true });
}

/**
 * Supprime une compétence
 */
export async function deleteCompetence(competenceId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('competences')
    .delete()
    .eq('id', competenceId);

  if (error) throw error;
}

// =====================================================
// LIAISON COMPETENCES ↔ EXPERIENCES
// =====================================================

/**
 * Lie une compétence à une expérience
 */
export async function linkCompetenceToExperience(
  competenceId: string,
  experienceId: string,
  contexte?: string,
  niveauUtilisation?: number
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('competences_experiences')
    .insert({
      competence_id: competenceId,
      experience_id: experienceId,
      contexte,
      niveau_utilisation: niveauUtilisation,
    })
    .select()
    .single();

  if (error) throw error;
  return data as CompetenceExperience;
}

/**
 * Délie une compétence d'une expérience
 */
export async function unlinkCompetenceFromExperience(
  competenceId: string,
  experienceId: string
) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('competences_experiences')
    .delete()
    .eq('competence_id', competenceId)
    .eq('experience_id', experienceId);

  if (error) throw error;
}

/**
 * Récupère toutes les compétences d'une expérience
 */
export async function getCompetencesForExperience(experienceId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('competences_experiences')
    .select(`
      id,
      contexte,
      niveau_utilisation,
      competences (*)
    `)
    .eq('experience_id', experienceId);

  if (error) throw error;
  return data;
}

// =====================================================
// EXTRACTION IA
// =====================================================

/**
 * Extrait les compétences d'un CV via IA
 * Cette fonction appelle l'API route qui utilise Gemini
 */
export async function extractCompetencesFromCV(
  bilanId: string,
  cvText: string
) {
  const response = await fetch('/api/competences/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bilanId, cvText }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de l\'extraction des compétences');
  }

  return response.json();
}

/**
 * Suggère des compétences basées sur les expériences
 */
export async function suggestCompetences(bilanId: string) {
  const response = await fetch('/api/competences/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bilanId }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la suggestion de compétences');
  }

  return response.json();
}

// =====================================================
// STATISTIQUES
// =====================================================

/**
 * Récupère les statistiques des compétences d'un bilan
 */
export async function getCompetencesStats(bilanId: string) {
  const competences = await getCompetences(bilanId);

  const stats = {
    total: competences.length,
    parCategorie: {} as Record<CompetenceCategorie, number>,
    parSource: {} as Record<CompetenceSource, number>,
    parNiveau: {} as Record<number, number>,
    validees: competences.filter((c) => c.validee_par_consultant).length,
    nonValidees: competences.filter((c) => !c.validee_par_consultant).length,
  };

  competences.forEach((competence) => {
    // Par catégorie
    stats.parCategorie[competence.categorie] =
      (stats.parCategorie[competence.categorie] || 0) + 1;

    // Par source
    stats.parSource[competence.source] =
      (stats.parSource[competence.source] || 0) + 1;

    // Par niveau
    if (competence.niveau) {
      stats.parNiveau[competence.niveau] =
        (stats.parNiveau[competence.niveau] || 0) + 1;
    }
  });

  return stats;
}

/**
 * Récupère la timeline des expériences
 */
export async function getExperiencesTimeline(bilanId: string) {
  const experiences = await getExperiences(bilanId);

  return experiences.map((exp) => ({
    id: exp.id,
    titre: exp.titre,
    entreprise: exp.entreprise,
    type: exp.type,
    dateDebut: exp.date_debut,
    dateFin: exp.date_fin,
    dureeMois: exp.duree_mois,
    enCours: !exp.date_fin,
  }));
}

