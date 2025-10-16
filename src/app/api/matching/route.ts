import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { jobMatcher } from '@/lib/matching/job-matcher';
import { formationMatcher } from '@/lib/matching/formation-matcher';
import { ProfilComplet } from '@/lib/ai/analysis-engine';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Vérifier l'authentification
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();
    const { bilanId, type, params } = body;

    if (!bilanId || !type) {
      return NextResponse.json({ 
        error: 'bilanId et type requis' 
      }, { status: 400 });
    }

    // Récupérer le bilan et l'analyse
    const { data: bilan } = await supabase
      .from('bilans')
      .select('*')
      .eq('id', bilanId)
      .single();

    if (!bilan) {
      return NextResponse.json({ error: 'Bilan non trouvé' }, { status: 404 });
    }

    const { data: analyse } = await supabase
      .from('analyses')
      .select('*')
      .eq('bilan_id', bilanId)
      .single();

    if (!analyse) {
      return NextResponse.json({ 
        error: 'Analyse non trouvée. Veuillez d\'abord analyser le profil.' 
      }, { status: 404 });
    }

    // Récupérer les résultats des tests
    const { data: tests } = await supabase
      .from('test_results')
      .select('*')
      .eq('bilan_id', bilanId);

    // Construire le profil complet
    const profil: ProfilComplet = {
      mbti: tests?.find(t => t.test_type === 'mbti')?.resultat,
      disc: tests?.find(t => t.test_type === 'disc')?.resultat,
      bigFive: tests?.find(t => t.test_type === 'bigfive')?.resultat,
      riasec: tests?.find(t => t.test_type === 'riasec')?.resultat,
      competences: bilan.competences_evaluees,
      experience: bilan.experiences_professionnelles
    };

    const metiersRecommandes = analyse.analyse_complete.recommandations_metiers;

    let resultats;

    if (type === 'emplois') {
      // Matching avec offres d'emploi
      resultats = await jobMatcher.matcherOffres(profil, metiersRecommandes, params);
      
      // Sauvegarder les résultats
      await supabase
        .from('matching_results')
        .upsert({
          bilan_id: bilanId,
          type: 'emplois',
          resultats,
          params,
          created_at: new Date().toISOString()
        });

    } else if (type === 'formations') {
      // Matching avec formations
      resultats = await formationMatcher.matcherFormations(profil, metiersRecommandes, params);
      
      // Sauvegarder les résultats
      await supabase
        .from('matching_results')
        .upsert({
          bilan_id: bilanId,
          type: 'formations',
          resultats,
          params,
          created_at: new Date().toISOString()
        });

    } else {
      return NextResponse.json({ 
        error: 'Type invalide. Utilisez "emplois" ou "formations"' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true,
      resultats 
    });

  } catch (error) {
    console.error('Erreur matching:', error);
    return NextResponse.json(
      { error: 'Erreur lors du matching' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Vérifier l'authentification
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bilanId = searchParams.get('bilanId');
    const type = searchParams.get('type');

    if (!bilanId || !type) {
      return NextResponse.json({ 
        error: 'bilanId et type requis' 
      }, { status: 400 });
    }

    // Récupérer les résultats de matching existants
    const { data: matching, error } = await supabase
      .from('matching_results')
      .select('*')
      .eq('bilan_id', bilanId)
      .eq('type', type)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !matching) {
      return NextResponse.json({ 
        error: 'Aucun résultat de matching trouvé' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      resultats: matching.resultats,
      params: matching.params,
      date: matching.created_at
    });

  } catch (error) {
    console.error('Erreur récupération matching:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du matching' },
      { status: 500 }
    );
  }
}

