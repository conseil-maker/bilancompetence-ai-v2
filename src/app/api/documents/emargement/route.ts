import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { createClient } from '@/lib/supabase/server';
import { FeuilleEmargement } from '@/types/documents';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { bilanId, seanceId, ...emargementData } = body;

    // Récupérer les données de la séance
    const { data: seance, error: seanceError } = await supabase
      .from('seances')
      .select(`
        *,
        bilan:bilan_id(
          beneficiaire:beneficiaire_id(*),
          consultant:consultant_id(*)
        )
      `)
      .eq('id', seanceId)
      .single();

    if (seanceError || !seance) {
      return NextResponse.json({ error: 'Séance non trouvée' }, { status: 404 });
    }

    // Créer la feuille d'émargement
    const emargement: FeuilleEmargement = {
      id: crypto.randomUUID(),
      type: 'FEUILLE_EMARGEMENT',
      statut: 'BROUILLON',
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
      versionNumber: 1,
      
      beneficiaire: {
        id: seance.bilan.beneficiaire.id,
        nom: seance.bilan.beneficiaire.nom,
        prenom: seance.bilan.beneficiaire.prenom,
        signatureArrivee: null,
        signatureDepart: null,
        heureArrivee: null,
        heureDepart: null,
      },
      
      consultant: {
        id: seance.bilan.consultant.id,
        nom: seance.bilan.consultant.nom,
        prenom: seance.bilan.consultant.prenom,
        signatureArrivee: null,
        signatureDepart: null,
        heureArrivee: null,
        heureDepart: null,
      },
      
      seance: {
        numero: emargementData.seance.numero,
        date: emargementData.seance.date,
        heureDebut: emargementData.seance.heureDebut,
        heureFin: emargementData.seance.heureFin,
        dureeMinutes: emargementData.seance.dureeMinutes,
        theme: emargementData.seance.theme,
        phase: emargementData.seance.phase,
        modalite: emargementData.seance.modalite,
        lieu: emargementData.seance.lieu,
      },
      
      contenu: emargementData.contenu,
    };

    // Enregistrer dans la base de données
    const { data: savedEmargement, error: saveError } = await supabase
      .from('documents')
      .insert({
        id: emargement.id,
        type: emargement.type,
        bilan_id: bilanId,
        seance_id: seanceId,
        statut: emargement.statut,
        contenu: emargement,
        created_at: emargement.dateCreation,
        updated_at: emargement.dateModification,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Erreur lors de l\'enregistrement:', saveError);
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement' }, { status: 500 });
    }

    return NextResponse.json({ emargement }, { status: 201 });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bilanId = searchParams.get('bilanId');
    const seanceId = searchParams.get('seanceId');

    let query = supabase
      .from('documents')
      .select('*')
      .eq('type', 'FEUILLE_EMARGEMENT');

    if (bilanId) {
      query = query.eq('bilan_id', bilanId);
    }

    if (seanceId) {
      query = query.eq('seance_id', seanceId);
    }

    const { data: documents, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération:', error);
      return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
    }

    const emargements = documents.map(doc => doc.contenu);
    return NextResponse.json({ emargements });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

