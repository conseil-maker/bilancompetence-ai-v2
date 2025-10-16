import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

export const runtime = 'nodejs';

// Schéma de validation pour la soumission d'un test
const SubmitTestSchema = z.object({
  bilan_id: z.string().uuid(),
  reponses: z.record(z.any()),
  duree_minutes: z.number().int().positive().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const supabase = await createClient();
    const { type: testType } = await params;
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validation avec Zod
    const validationResult = SubmitTestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { bilan_id, reponses, duree_minutes } = validationResult.data;

    // Vérifier que le bilan existe et appartient à l'utilisateur
    const { data: bilan, error: bilanError } = await supabase
      .from('bilans')
      .select('*')
      .eq('id', bilan_id)
      .single();

    if (bilanError || !bilan) {
      return NextResponse.json({ error: 'Bilan non trouvé' }, { status: 404 });
    }

    if (bilan.beneficiaire_id !== user.id && bilan.consultant_id !== user.id) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Calculer les résultats selon le type de test
    const resultats = calculateTestResults(testType, reponses);

    // Enregistrer le test
    const { data: test, error: insertError } = await supabase
      .from('tests')
      .insert({
        bilan_id,
        type: testType.toUpperCase(),
        reponses,
        resultats,
        statut: 'complete',
        duree_minutes: duree_minutes || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erreur lors de l\'enregistrement du test:', insertError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement du test' },
        { status: 500 }
      );
    }

    // Enregistrer dans test_results pour l'historique
    const { error: resultsError } = await supabase
      .from('test_results')
      .insert({
        test_id: test.id,
        bilan_id,
        user_id: user.id,
        test_type: testType.toUpperCase(),
        scores: resultats,
        interpretation: generateInterpretation(testType, resultats),
      });

    if (resultsError) {
      console.error('Erreur lors de l\'enregistrement des résultats:', resultsError);
      // On continue même si l'enregistrement échoue
    }

    return NextResponse.json({
      success: true,
      test,
      resultats,
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la soumission du test:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la soumission du test' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const supabase = await createClient();
    const { type: testType } = await params;
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer le bilan_id depuis les query params
    const { searchParams } = new URL(request.url);
    const bilanId = searchParams.get('bilan_id');

    if (!bilanId) {
      return NextResponse.json(
        { error: 'bilan_id requis' },
        { status: 400 }
      );
    }

    // Vérifier que le bilan appartient à l'utilisateur
    const { data: bilan, error: bilanError } = await supabase
      .from('bilans')
      .select('*')
      .eq('id', bilanId)
      .single();

    if (bilanError || !bilan) {
      return NextResponse.json({ error: 'Bilan non trouvé' }, { status: 404 });
    }

    if (bilan.beneficiaire_id !== user.id && bilan.consultant_id !== user.id) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Récupérer les tests du type demandé
    const { data: tests, error: selectError } = await supabase
      .from('tests')
      .select('*')
      .eq('bilan_id', bilanId)
      .eq('type', testType.toUpperCase())
      .order('created_at', { ascending: false });

    if (selectError) {
      console.error('Erreur lors de la récupération des tests:', selectError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des tests' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tests: tests || [],
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des tests:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des tests' },
      { status: 500 }
    );
  }
}

// Fonction pour calculer les résultats selon le type de test
function calculateTestResults(testType: string, reponses: Record<string, any>): Record<string, any> {
  const type = testType.toUpperCase();

  switch (type) {
    case 'MBTI':
      return calculateMBTI(reponses);
    case 'DISC':
      return calculateDISC(reponses);
    case 'RIASEC':
      return calculateRIASEC(reponses);
    case 'VALEURS':
      return calculateValeurs(reponses);
    default:
      return { raw: reponses };
  }
}

function calculateMBTI(reponses: Record<string, any>): Record<string, any> {
  // Calcul simplifié du MBTI
  // Dans une vraie implémentation, utiliser un algorithme validé
  const dimensions = {
    E_I: 0, // Extraversion vs Introversion
    S_N: 0, // Sensation vs Intuition
    T_F: 0, // Thinking vs Feeling
    J_P: 0, // Judging vs Perceiving
  };

  // Compter les réponses (exemple simplifié)
  Object.entries(reponses).forEach(([key, value]) => {
    if (typeof value === 'number') {
      if (key.startsWith('E_I')) dimensions.E_I += value;
      if (key.startsWith('S_N')) dimensions.S_N += value;
      if (key.startsWith('T_F')) dimensions.T_F += value;
      if (key.startsWith('J_P')) dimensions.J_P += value;
    }
  });

  const type = 
    (dimensions.E_I > 0 ? 'E' : 'I') +
    (dimensions.S_N > 0 ? 'S' : 'N') +
    (dimensions.T_F > 0 ? 'T' : 'F') +
    (dimensions.J_P > 0 ? 'J' : 'P');

  return {
    type,
    dimensions,
    description: getMBTIDescription(type),
  };
}

function calculateDISC(reponses: Record<string, any>): Record<string, any> {
  // Calcul simplifié du DISC
  const scores = {
    D: 0, // Dominance
    I: 0, // Influence
    S: 0, // Stabilité
    C: 0, // Conformité
  };

  Object.entries(reponses).forEach(([key, value]) => {
    if (typeof value === 'number') {
      if (key.startsWith('D')) scores.D += value;
      if (key.startsWith('I')) scores.I += value;
      if (key.startsWith('S')) scores.S += value;
      if (key.startsWith('C')) scores.C += value;
    }
  });

  const total = scores.D + scores.I + scores.S + scores.C;
  const percentages = {
    D: Math.round((scores.D / total) * 100),
    I: Math.round((scores.I / total) * 100),
    S: Math.round((scores.S / total) * 100),
    C: Math.round((scores.C / total) * 100),
  };

  return {
    scores,
    percentages,
    profil: getDISCProfile(percentages),
  };
}

function calculateRIASEC(reponses: Record<string, any>): Record<string, any> {
  // Calcul simplifié du RIASEC
  const scores = {
    R: 0, // Réaliste
    I: 0, // Investigateur
    A: 0, // Artistique
    S: 0, // Social
    E: 0, // Entreprenant
    C: 0, // Conventionnel
  };

  Object.entries(reponses).forEach(([key, value]) => {
    if (typeof value === 'number') {
      if (key.startsWith('R')) scores.R += value;
      if (key.startsWith('I')) scores.I += value;
      if (key.startsWith('A')) scores.A += value;
      if (key.startsWith('S')) scores.S += value;
      if (key.startsWith('E')) scores.E += value;
      if (key.startsWith('C')) scores.C += value;
    }
  });

  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key);

  return {
    scores,
    code: sorted.slice(0, 3).join(''),
    top3: sorted.slice(0, 3),
  };
}

function calculateValeurs(reponses: Record<string, any>): Record<string, any> {
  // Calcul simplifié des valeurs professionnelles
  const valeurs = Object.entries(reponses)
    .map(([key, value]) => ({ valeur: key, score: value as number }))
    .sort((a, b) => b.score - a.score);

  return {
    top5: valeurs.slice(0, 5),
    all: valeurs,
  };
}

function getMBTIDescription(type: string): string {
  const descriptions: Record<string, string> = {
    INTJ: 'L\'Architecte - Penseur stratégique avec un plan pour tout',
    INTP: 'Le Logicien - Innovateur avec une soif de connaissance',
    ENTJ: 'Le Commandant - Leader audacieux, imaginatif et volontaire',
    ENTP: 'Le Débatteur - Penseur intelligent et curieux',
    INFJ: 'L\'Avocat - Idéaliste calme et mystique',
    INFP: 'Le Médiateur - Poétique, gentil et altruiste',
    ENFJ: 'Le Protagoniste - Leader charismatique et inspirant',
    ENFP: 'Le Campagneur - Esprit libre enthousiaste et créatif',
    ISTJ: 'Le Logisticien - Pratique et factuel',
    ISFJ: 'Le Défenseur - Protecteur dévoué et chaleureux',
    ESTJ: 'L\'Exécutif - Excellent administrateur',
    ESFJ: 'Le Consul - Extraverti attentionné et populaire',
    ISTP: 'Le Virtuose - Expérimentateur audacieux et pratique',
    ISFP: 'L\'Aventurier - Artiste flexible et charmant',
    ESTP: 'L\'Entrepreneur - Perceptif, énergique et pragmatique',
    ESFP: 'L\'Amuseur - Spontané, énergique et enthousiaste',
  };

  return descriptions[type] || 'Type MBTI';
}

function getDISCProfile(percentages: Record<string, number>): string {
  const max = Math.max(...Object.values(percentages));
  const dominant = Object.entries(percentages).find(([, v]) => v === max)?.[0] || 'D';

  const profiles: Record<string, string> = {
    D: 'Dominant - Direct, résolu, orienté résultats',
    I: 'Influent - Sociable, enthousiaste, optimiste',
    S: 'Stable - Patient, fiable, bon auditeur',
    C: 'Consciencieux - Analytique, précis, systématique',
  };

  return profiles[dominant] || 'Profil DISC';
}

function generateInterpretation(testType: string, resultats: Record<string, any>): string {
  const type = testType.toUpperCase();

  switch (type) {
    case 'MBTI':
      return `Votre type MBTI est ${resultats.type}. ${resultats.description}`;
    case 'DISC':
      return `Votre profil DISC est ${resultats.profil}`;
    case 'RIASEC':
      return `Votre code Holland est ${resultats.code}. Vos 3 dominantes sont : ${resultats.top3.join(', ')}`;
    case 'VALEURS':
      return `Vos 5 valeurs principales sont : ${resultats.top5.map((v: any) => v.valeur).join(', ')}`;
    default:
      return 'Test complété avec succès';
  }
}

