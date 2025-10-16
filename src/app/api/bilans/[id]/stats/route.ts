import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: bilanId } = await params;
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer le bilan
    const { data: bilan, error: bilanError } = await supabase
      .from('bilans')
      .select('*')
      .eq('id', bilanId)
      .single();

    if (bilanError || !bilan) {
      return NextResponse.json({ error: 'Bilan non trouvé' }, { status: 404 });
    }

    // Vérifier que l'utilisateur a accès à ce bilan
    if (bilan.beneficiaire_id !== user.id && bilan.consultant_id !== user.id) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Calculer les statistiques

    // 1. Progression globale
    const dateDebut = new Date(bilan.date_debut);
    const dateFin = bilan.date_fin ? new Date(bilan.date_fin) : new Date(dateDebut.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 jours par défaut
    const maintenant = new Date();
    const dureeTotal = dateFin.getTime() - dateDebut.getTime();
    const dureeEcoulee = maintenant.getTime() - dateDebut.getTime();
    const progressionTemps = Math.min(Math.max((dureeEcoulee / dureeTotal) * 100, 0), 100);

    // 2. Tests complétés
    const { data: tests, error: testsError } = await supabase
      .from('tests')
      .select('*')
      .eq('bilan_id', bilanId);

    const testsCompletes = tests?.filter(t => t.statut === 'complete').length || 0;
    const testsTotal = 5; // Nombre de tests prévus

    // 3. Documents générés
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('*')
      .eq('bilan_id', bilanId);

    const documentsGeneres = documents?.length || 0;

    // 4. Heures réalisées (calculées depuis les activités)
    const { data: activites, error: activitesError } = await supabase
      .from('activites')
      .select('*')
      .eq('bilan_id', bilanId);

    const heuresRealisees = activites?.reduce((total, activite) => {
      if (activite.duree_minutes) {
        return total + (activite.duree_minutes / 60);
      }
      return total;
    }, 0) || 0;

    const heuresTotal = 24; // Durée standard d'un bilan

    // 5. Progression par phase
    const progressionPhases = {
      preliminaire: 100, // Toujours complétée si le bilan est créé
      investigation: Math.min((testsCompletes / testsTotal) * 100, 100),
      conclusion: documentsGeneres > 0 ? 50 : 0,
    };

    const progressionGlobale = Math.round(
      (progressionPhases.preliminaire + progressionPhases.investigation + progressionPhases.conclusion) / 3
    );

    // Construire la réponse
    const stats = {
      progression: {
        pourcentage: progressionGlobale,
        label: `${progressionGlobale}%`,
      },
      heures: {
        realisees: Math.round(heuresRealisees * 10) / 10,
        total: heuresTotal,
        label: `${Math.round(heuresRealisees)}h / ${heuresTotal}h`,
      },
      tests: {
        completes: testsCompletes,
        total: testsTotal,
        label: `${testsCompletes} / ${testsTotal}`,
      },
      documents: {
        generes: documentsGeneres,
        label: `${documentsGeneres} document${documentsGeneres > 1 ? 's' : ''}`,
      },
      phases: progressionPhases,
      statut: bilan.statut,
      dateDebut: bilan.date_debut,
      dateFin: bilan.date_fin,
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}

