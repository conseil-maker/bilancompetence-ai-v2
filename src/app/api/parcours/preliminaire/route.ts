import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PhasePreliminaire, EntretienPreliminaire, StatutPhase } from '@/types/parcours';

/**
 * GET /api/parcours/preliminaire
 * Récupère les données de la phase préliminaire
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer le bilanId depuis les query params
    const searchParams = request.nextUrl.searchParams;
    const bilanId = searchParams.get('bilanId');

    if (!bilanId) {
      return NextResponse.json(
        { error: 'bilanId manquant' },
        { status: 400 }
      );
    }

    // Récupérer la phase préliminaire
    const { data: phase, error } = await supabase
      .from('phases_preliminaires')
      .select(`
        *,
        entretien_preliminaire:entretiens_preliminaires(*)
      `)
      .eq('bilan_id', bilanId)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des données' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: phase });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/parcours/preliminaire
 * Crée ou met à jour la phase préliminaire
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer les données du body
    const body = await request.json();
    const { bilanId, entretien } = body;

    if (!bilanId) {
      return NextResponse.json(
        { error: 'bilanId manquant' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur a accès à ce bilan
    const { data: bilan, error: bilanError } = await supabase
      .from('bilans')
      .select('*')
      .eq('id', bilanId)
      .eq('beneficiaire_id', user.id)
      .single();

    if (bilanError || !bilan) {
      return NextResponse.json(
        { error: 'Bilan non trouvé ou accès refusé' },
        { status: 404 }
      );
    }

    // Créer ou mettre à jour la phase préliminaire
    const { data: existingPhase } = await supabase
      .from('phases_preliminaires')
      .select('id')
      .eq('bilan_id', bilanId)
      .single();

    let phaseId: string;

    if (existingPhase) {
      // Mettre à jour
      const { data: updatedPhase, error: updateError } = await supabase
        .from('phases_preliminaires')
        .update({
          statut: StatutPhase.EN_COURS,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingPhase.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      phaseId = updatedPhase.id;
    } else {
      // Créer
      const { data: newPhase, error: createError } = await supabase
        .from('phases_preliminaires')
        .insert({
          bilan_id: bilanId,
          statut: StatutPhase.EN_COURS,
          date_debut: new Date().toISOString(),
          duree: 0,
          objectifs_valides: false,
          convention_signee: false,
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      phaseId = newPhase.id;
    }

    // Créer ou mettre à jour l'entretien préliminaire
    const { data: existingEntretien } = await supabase
      .from('entretiens_preliminaires')
      .select('id')
      .eq('phase_preliminaire_id', phaseId)
      .single();

    if (existingEntretien) {
      // Mettre à jour
      const { error: updateError } = await supabase
        .from('entretiens_preliminaires')
        .update({
          motivations: entretien.motivations,
          attentes: entretien.attentes,
          contexte: entretien.contexte,
          objectifs: entretien.objectifs,
          contraintes: entretien.contraintes,
          notes: entretien.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingEntretien.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      // Créer
      const { error: createError } = await supabase
        .from('entretiens_preliminaires')
        .insert({
          phase_preliminaire_id: phaseId,
          date: new Date().toISOString(),
          duree: 0,
          modalite: 'DISTANCIEL',
          motivations: entretien.motivations,
          attentes: entretien.attentes,
          contexte: entretien.contexte,
          objectifs: entretien.objectifs,
          contraintes: entretien.contraintes,
          notes: entretien.notes,
          informations_methodologie: false,
          informations_duree: false,
          informations_modalites: false,
          informations_confidentialite: false,
          beneficiaire_accepte: false,
          consultant_accepte: false,
        });

      if (createError) {
        throw createError;
      }
    }

    // Récupérer les données mises à jour
    const { data: updatedData } = await supabase
      .from('phases_preliminaires')
      .select(`
        *,
        entretien_preliminaire:entretiens_preliminaires(*)
      `)
      .eq('id', phaseId)
      .single();

    return NextResponse.json({ 
      data: updatedData,
      message: 'Phase préliminaire enregistrée avec succès' 
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/parcours/preliminaire
 * Valide la phase préliminaire
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer les données du body
    const body = await request.json();
    const { bilanId } = body;

    if (!bilanId) {
      return NextResponse.json(
        { error: 'bilanId manquant' },
        { status: 400 }
      );
    }

    // Récupérer la phase
    const { data: phase, error: phaseError } = await supabase
      .from('phases_preliminaires')
      .select('id')
      .eq('bilan_id', bilanId)
      .single();

    if (phaseError || !phase) {
      return NextResponse.json(
        { error: 'Phase non trouvée' },
        { status: 404 }
      );
    }

    // Valider la phase
    const { error: updateError } = await supabase
      .from('phases_preliminaires')
      .update({
        statut: StatutPhase.VALIDE,
        date_fin: new Date().toISOString(),
        objectifs_valides: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', phase.id);

    if (updateError) {
      throw updateError;
    }

    // Mettre à jour le bilan pour passer à la phase suivante
    const { error: bilanUpdateError } = await supabase
      .from('bilans')
      .update({
        phase_actuelle: 'INVESTIGATION',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bilanId);

    if (bilanUpdateError) {
      throw bilanUpdateError;
    }

    return NextResponse.json({ 
      message: 'Phase préliminaire validée avec succès',
      nextPhase: 'INVESTIGATION'
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la validation' },
      { status: 500 }
    );
  }
}

