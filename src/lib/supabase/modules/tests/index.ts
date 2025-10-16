/**
 * Module de gestion des tests psychométriques
 * Gestion des tests et de leurs résultats
 */

import { createClient } from '@/lib/supabase/client';
import type {
  Test,
  Inserts,
  Updates,
  TestType,
  TestStatut,
} from '@/types/database.types';

// =====================================================
// TESTS
// =====================================================

/**
 * Récupère tous les tests d'un bilan
 */
export async function getTests(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .eq('bilan_id', bilanId)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Test[];
}

/**
 * Récupère un test par ID
 */
export async function getTest(testId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .eq('id', testId)
    .single();

  if (error) throw error;
  return data as Test;
}

/**
 * Récupère les tests par type
 */
export async function getTestsByType(bilanId: string, type: TestType) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('type', type)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Test[];
}

/**
 * Récupère les tests par statut
 */
export async function getTestsByStatut(bilanId: string, statut: TestStatut) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('statut', statut)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Test[];
}

/**
 * Récupère les tests complétés
 */
export async function getTestsCompletes(bilanId: string) {
  return getTestsByStatut(bilanId, 'complete');
}

/**
 * Récupère les tests en attente
 */
export async function getTestsEnAttente(bilanId: string) {
  return getTestsByStatut(bilanId, 'en_attente');
}

/**
 * Crée un nouveau test
 */
export async function createTest(test: Inserts<'tests'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('tests')
    .insert(test)
    .select()
    .single();

  if (error) throw error;
  return data as Test;
}

/**
 * Met à jour un test
 */
export async function updateTest(
  testId: string,
  updates: Updates<'tests'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('tests')
    .update(updates)
    .eq('id', testId)
    .select()
    .single();

  if (error) throw error;
  return data as Test;
}

/**
 * Enregistre les réponses d'un test
 */
export async function enregistrerReponses(
  testId: string,
  reponses: Record<string, any>
) {
  return updateTest(testId, {
    reponses,
    statut: 'en_cours',
  });
}

/**
 * Complète un test avec les résultats
 */
export async function completerTest(
  testId: string,
  reponses: Record<string, any>,
  resultats: Record<string, any>,
  score?: number
) {
  return updateTest(testId, {
    reponses,
    resultats,
    score,
    statut: 'complete',
    date_completion: new Date().toISOString(),
  });
}

/**
 * Analyse les résultats d'un test avec l'IA
 */
export async function analyserResultats(testId: string) {
  const response = await fetch('/api/tests/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ testId }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de l\'analyse des résultats');
  }

  return response.json();
}

/**
 * Supprime un test
 */
export async function deleteTest(testId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('tests')
    .delete()
    .eq('id', testId);

  if (error) throw error;
}

// =====================================================
// STATISTIQUES
// =====================================================

/**
 * Récupère les statistiques des tests
 */
export async function getTestsStats(bilanId: string) {
  const tests = await getTests(bilanId);

  const stats = {
    total: tests.length,
    parType: {} as Record<TestType, number>,
    parStatut: {} as Record<TestStatut, number>,
    completes: tests.filter((t) => t.statut === 'complete').length,
    enAttente: tests.filter((t) => t.statut === 'en_attente').length,
    scoreMoyen:
      tests.reduce((sum, t) => sum + (t.score || 0), 0) /
        tests.filter((t) => t.score).length || 0,
  };

  tests.forEach((test) => {
    stats.parType[test.type] = (stats.parType[test.type] || 0) + 1;
    stats.parStatut[test.statut] = (stats.parStatut[test.statut] || 0) + 1;
  });

  return stats;
}

