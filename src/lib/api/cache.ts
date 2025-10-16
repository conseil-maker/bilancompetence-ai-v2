import { unstable_cache } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/**
 * Cache pour les profils utilisateurs
 * Revalidation : 5 minutes (les profils changent rarement)
 */
export const getCachedProfile = unstable_cache(
  async (userId: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role, first_name, last_name, email, avatar_url, created_at')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },
  ['profile'],
  {
    revalidate: 300, // 5 minutes
    tags: ['profile'],
  }
);

/**
 * Cache pour les bilans
 * Revalidation : 2 minutes (les bilans changent occasionnellement)
 */
export const getCachedBilan = unstable_cache(
  async (bilanId: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('bilans')
      .select(`
        id,
        beneficiaire_id,
        consultant_id,
        objectifs,
        date_debut,
        date_fin,
        type,
        statut,
        created_at,
        updated_at,
        beneficiaire:profiles!beneficiaire_id(id, first_name, last_name, email, role),
        consultant:profiles!consultant_id(id, first_name, last_name, email, role)
      `)
      .eq('id', bilanId)
      .single();

    if (error) throw error;
    return data;
  },
  ['bilan'],
  {
    revalidate: 120, // 2 minutes
    tags: ['bilan'],
  }
);

/**
 * Cache pour les tests complétés
 * Revalidation : 10 minutes (les tests complétés sont immuables)
 */
export const getCachedTestResults = unstable_cache(
  async (bilanId: string, testType?: string) => {
    const supabase = await createClient();
    
    let query = supabase
      .from('tests')
      .select('id, type, statut, resultats, created_at')
      .eq('bilan_id', bilanId)
      .eq('statut', 'complete')
      .order('created_at', { ascending: false });

    if (testType) {
      query = query.eq('type', testType.toUpperCase());
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },
  ['test-results'],
  {
    revalidate: 600, // 10 minutes
    tags: ['test-results'],
  }
);

/**
 * Cache pour les documents générés
 * Revalidation : 10 minutes (les documents générés sont immuables)
 */
export const getCachedDocuments = unstable_cache(
  async (bilanId: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('documents')
      .select('id, type, statut, created_at')
      .eq('bilan_id', bilanId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
  ['documents'],
  {
    revalidate: 600, // 10 minutes
    tags: ['documents'],
  }
);

/**
 * Cache pour les statistiques d'un bilan
 * Revalidation : 1 minute (les stats changent fréquemment)
 */
export const getCachedBilanStats = unstable_cache(
  async (bilanId: string) => {
    const supabase = await createClient();

    // Requêtes parallèles optimisées
    const [testsResult, documentsResult, activitesResult] = await Promise.all([
      supabase
        .from('tests')
        .select('id, type, statut', { count: 'exact' })
        .eq('bilan_id', bilanId),
      
      supabase
        .from('documents')
        .select('id, type', { count: 'exact' })
        .eq('bilan_id', bilanId),
      
      supabase
        .from('activites')
        .select('duree_minutes')
        .eq('bilan_id', bilanId),
    ]);

    const tests = testsResult.data || [];
    const documents = documentsResult.data || [];
    const activites = activitesResult.data || [];

    // Calculer les stats
    const testsCompletes = tests.filter(t => t.statut === 'complete').length;
    const heuresRealisees = activites.reduce((total, a) => total + ((a.duree_minutes || 0) / 60), 0);

    return {
      tests: {
        total: tests.length,
        completes: testsCompletes,
        pourcentage: tests.length > 0 ? Math.round((testsCompletes / tests.length) * 100) : 0,
      },
      documents: {
        total: documents.length,
      },
      heures: {
        realisees: Math.round(heuresRealisees * 10) / 10,
      },
    };
  },
  ['bilan-stats'],
  {
    revalidate: 60, // 1 minute
    tags: ['bilan-stats'],
  }
);

/**
 * Invalide le cache d'un profil
 */
export function revalidateProfile(userId: string) {
  // Next.js revalidateTag
  // revalidateTag(`profile-${userId}`);
}

/**
 * Invalide le cache d'un bilan
 */
export function revalidateBilan(bilanId: string) {
  // Next.js revalidateTag
  // revalidateTag(`bilan-${bilanId}`);
}

/**
 * Invalide tous les caches liés à un bilan
 */
export function revalidateAllBilanData(bilanId: string) {
  // revalidateTag(`bilan-${bilanId}`);
  // revalidateTag(`bilan-stats-${bilanId}`);
  // revalidateTag(`test-results-${bilanId}`);
  // revalidateTag(`documents-${bilanId}`);
}

