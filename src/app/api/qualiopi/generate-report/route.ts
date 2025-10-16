/**
 * API Route: Génération de rapports Qualiopi
 * POST /api/qualiopi/generate-report
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Vérifier l'authentification
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier les permissions (admin uniquement)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Permission refusée - Admin uniquement' },
        { status: 403 }
      );
    }

    // Récupérer les paramètres
    const { dateDebut, dateFin, type } = await request.json();

    if (!dateDebut || !dateFin) {
      return NextResponse.json(
        { error: 'dateDebut et dateFin requis' },
        { status: 400 }
      );
    }

    // Initialiser le rapport
    const rapport: any = {
      periode: {
        debut: dateDebut,
        fin: dateFin,
      },
      generated_at: new Date().toISOString(),
      generated_by: user.id,
    };

    // 1. BILANS
    const { data: bilans } = await supabase
      .from('bilans')
      .select('*')
      .gte('created_at', dateDebut)
      .lte('created_at', dateFin);

    rapport.bilans = {
      total: bilans?.length || 0,
      par_statut: {},
      par_financeur: {},
      taux_completion: 0,
    };

    bilans?.forEach((bilan) => {
      // Par statut
      rapport.bilans.par_statut[bilan.statut] =
        (rapport.bilans.par_statut[bilan.statut] || 0) + 1;

      // Par financeur
      if (bilan.financeur) {
        rapport.bilans.par_financeur[bilan.financeur] =
          (rapport.bilans.par_financeur[bilan.financeur] || 0) + 1;
      }
    });

    // Taux de complétion
    const bilansTermines = bilans?.filter((b) => b.statut === 'termine').length || 0;
    rapport.bilans.taux_completion =
      bilans && bilans.length > 0
        ? Math.round((bilansTermines / bilans.length) * 100)
        : 0;

    // 2. ENQUÊTES DE SATISFACTION
    const { data: enquetes } = await supabase
      .from('enquetes_satisfaction')
      .select('*')
      .gte('created_at', dateDebut)
      .lte('created_at', dateFin);

    rapport.satisfaction = {
      total_envoyees: enquetes?.length || 0,
      total_completees: enquetes?.filter((e) => e.statut === 'completee').length || 0,
      taux_reponse: 0,
      note_moyenne: 0,
      notes_par_critere: {},
    };

    if (enquetes && enquetes.length > 0) {
      const completees = enquetes.filter((e) => e.statut === 'completee');
      rapport.satisfaction.taux_reponse = Math.round(
        (completees.length / enquetes.length) * 100
      );

      // Calculer la note moyenne
      const notes = completees
        .map((e) => e.reponses?.note_globale)
        .filter((n) => n !== null && n !== undefined);
      
      if (notes.length > 0) {
        rapport.satisfaction.note_moyenne =
          notes.reduce((sum, n) => sum + n, 0) / notes.length;
      }
    }

    // 3. RÉCLAMATIONS
    const { data: reclamations } = await supabase
      .from('reclamations')
      .select('*')
      .gte('created_at', dateDebut)
      .lte('created_at', dateFin);

    rapport.reclamations = {
      total: reclamations?.length || 0,
      par_type: {},
      par_gravite: {},
      par_statut: {},
      delai_traitement_moyen: 0,
    };

    reclamations?.forEach((reclamation) => {
      // Par type
      rapport.reclamations.par_type[reclamation.type] =
        (rapport.reclamations.par_type[reclamation.type] || 0) + 1;

      // Par gravité
      rapport.reclamations.par_gravite[reclamation.gravite] =
        (rapport.reclamations.par_gravite[reclamation.gravite] || 0) + 1;

      // Par statut
      rapport.reclamations.par_statut[reclamation.statut] =
        (rapport.reclamations.par_statut[reclamation.statut] || 0) + 1;
    });

    // Calculer le délai moyen de traitement
    const reclamationsTraitees = reclamations?.filter(
      (r) => r.statut === 'traitee' && r.date_resolution
    );
    
    if (reclamationsTraitees && reclamationsTraitees.length > 0) {
      const delais = reclamationsTraitees.map((r) => {
        const debut = new Date(r.created_at).getTime();
        const fin = new Date(r.date_resolution!).getTime();
        return (fin - debut) / (1000 * 60 * 60 * 24); // En jours
      });
      
      rapport.reclamations.delai_traitement_moyen =
        delais.reduce((sum, d) => sum + d, 0) / delais.length;
    }

    // 4. FORMATIONS DES CONSULTANTS
    const { data: formations } = await supabase
      .from('formations_consultants')
      .select('*')
      .gte('date_debut', dateDebut)
      .lte('date_debut', dateFin);

    rapport.formations_consultants = {
      total: formations?.length || 0,
      heures_totales: formations?.reduce((sum, f) => sum + (f.duree_heures || 0), 0) || 0,
      par_consultant: {},
    };

    formations?.forEach((formation) => {
      rapport.formations_consultants.par_consultant[formation.consultant_id] =
        (rapport.formations_consultants.par_consultant[formation.consultant_id] || 0) + 1;
    });

    // 5. VEILLE
    const { data: veille } = await supabase
      .from('veille')
      .select('*')
      .gte('created_at', dateDebut)
      .lte('created_at', dateFin);

    rapport.veille = {
      total: veille?.length || 0,
      par_type: {},
    };

    veille?.forEach((item) => {
      rapport.veille.par_type[item.type] =
        (rapport.veille.par_type[item.type] || 0) + 1;
    });

    // 6. INDICATEURS QUALIOPI
    rapport.indicateurs_qualiopi = {
      taux_satisfaction: rapport.satisfaction.note_moyenne,
      taux_completion_bilans: rapport.bilans.taux_completion,
      nombre_reclamations: rapport.reclamations.total,
      heures_formation_consultants: rapport.formations_consultants.heures_totales,
      actions_veille: rapport.veille.total,
    };

    // Enregistrer l'activité
    await supabase.from('activites').insert({
      bilan_id: null,
      user_id: user.id,
      type: 'rapport_qualiopi_genere',
      description: `Génération du rapport Qualiopi pour la période ${dateDebut} - ${dateFin}`,
      metadata: rapport.indicateurs_qualiopi,
    });

    return NextResponse.json({
      success: true,
      rapport,
    });
  } catch (error: any) {
    console.error('Erreur lors de la génération du rapport Qualiopi:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

