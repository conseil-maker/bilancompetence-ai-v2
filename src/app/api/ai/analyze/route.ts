import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analysisEngine, ProfilComplet } from '@/lib/ai/analysis-engine';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Récupérer le profil complet
    const { bilanId } = await request.json();

    if (!bilanId) {
      return NextResponse.json({ error: 'bilanId requis' }, { status: 400 });
    }

    // Récupérer tous les résultats de tests
    const { data: bilan } = await supabase
      .from('bilans')
      .select('*')
      .eq('id', bilanId)
      .single();

    if (!bilan) {
      return NextResponse.json({ error: 'Bilan non trouvé' }, { status: 404 });
    }

    // Récupérer les résultats des tests psychométriques
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

    // Analyser le profil
    const analyse = await analysisEngine.analyserProfilComplet(profil);

    // Sauvegarder l'analyse en base de données
    const { error: saveError } = await supabase
      .from('analyses')
      .upsert({
        bilan_id: bilanId,
        analyse_complete: analyse,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (saveError) {
      console.error('Erreur sauvegarde analyse:', saveError);
    }

    return NextResponse.json({ 
      success: true,
      analyse 
    });

  } catch (error) {
    console.error('Erreur analyse profil:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse du profil' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Récupérer l'ID du bilan depuis les query params
    const { searchParams } = new URL(request.url);
    const bilanId = searchParams.get('bilanId');

    if (!bilanId) {
      return NextResponse.json({ error: 'bilanId requis' }, { status: 400 });
    }

    // Récupérer l'analyse existante
    const { data: analyse, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('bilan_id', bilanId)
      .single();

    if (error || !analyse) {
      return NextResponse.json({ error: 'Analyse non trouvée' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      analyse: analyse.analyse_complete 
    });

  } catch (error) {
    console.error('Erreur récupération analyse:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'analyse' },
      { status: 500 }
    );
  }
}

