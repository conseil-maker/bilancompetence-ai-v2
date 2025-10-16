import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const supabase = await createClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { role, type } = body; // role: 'beneficiaire' | 'consultant', type: 'arrivee' | 'depart'

    // Récupérer le document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', params.id)
      .eq('type', 'FEUILLE_EMARGEMENT')
      .single();

    if (docError || !document) {
      return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 });
    }

    const emargement = document.contenu;
    const now = new Date().toISOString();

    // Mettre à jour la signature
    if (type === 'arrivee') {
      emargement[role].signatureArrivee = `Signé électroniquement le ${new Date().toLocaleString('fr-FR')}`;
      emargement[role].heureArrivee = now;
    } else if (type === 'depart') {
      emargement[role].signatureDepart = `Signé électroniquement le ${new Date().toLocaleString('fr-FR')}`;
      emargement[role].heureDepart = now;
    }

    // Vérifier si toutes les signatures sont complètes
    const toutesSignaturesCompletes = 
      emargement.beneficiaire.signatureArrivee &&
      emargement.beneficiaire.signatureDepart &&
      emargement.consultant.signatureArrivee &&
      emargement.consultant.signatureDepart;

    if (toutesSignaturesCompletes) {
      emargement.statut = 'VALIDE';
    }

    emargement.dateModification = now;

    // Mettre à jour dans la base de données
    const { data: updatedDocument, error: updateError } = await supabase
      .from('documents')
      .update({
        contenu: emargement,
        statut: emargement.statut,
        updated_at: now,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Erreur lors de la mise à jour:', updateError);
      return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
    }

    return NextResponse.json({ emargement });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

