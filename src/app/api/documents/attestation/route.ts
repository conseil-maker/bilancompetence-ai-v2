import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AttestationFinFormation } from '@/types/documents';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { bilanId } = body;

    // Récupérer les données du bilan
    const { data: bilan, error: bilanError } = await supabase
      .from('bilans')
      .select(`
        *,
        beneficiaire:beneficiaire_id(*),
        consultant:consultant_id(*),
        organisme:organisme_id(*)
      `)
      .eq('id', bilanId)
      .single();

    if (bilanError || !bilan) {
      return NextResponse.json({ error: 'Bilan non trouvé' }, { status: 404 });
    }

    // Générer un numéro d'attestation unique
    const numeroAttestation = `ATT-${bilan.organisme.siret}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    // Créer l'attestation
    const attestation: AttestationFinFormation = {
      id: crypto.randomUUID(),
      type: 'ATTESTATION_FIN_FORMATION',
      statut: 'VALIDE',
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
      versionNumber: 1,
      
      numeroAttestation,
      
      beneficiaire: {
        id: bilan.beneficiaire.id,
        nom: bilan.beneficiaire.nom,
        prenom: bilan.beneficiaire.prenom,
        dateNaissance: bilan.beneficiaire.date_naissance,
        email: bilan.beneficiaire.email,
      },
      
      consultant: {
        id: bilan.consultant.id,
        nom: bilan.consultant.nom,
        prenom: bilan.consultant.prenom,
      },
      
      organisme: {
        id: bilan.organisme.id,
        nom: bilan.organisme.nom,
        siret: bilan.organisme.siret,
        numeroDeclarationActivite: bilan.organisme.numero_declaration_activite,
        numeroQualiopi: bilan.organisme.numero_qualiopi,
        adresse: {
          rue: bilan.organisme.adresse_rue,
          codePostal: bilan.organisme.adresse_code_postal,
          ville: bilan.organisme.adresse_ville,
          pays: 'France',
        },
      },
      
      formation: {
        intitule: 'Bilan de Compétences',
        codeCPF: '202',
        dateDebut: bilan.date_debut,
        dateFin: bilan.date_fin,
        dureeHeures: bilan.duree_heures,
        modalites: ['Présentiel', 'Distanciel'],
      },
      
      phases: [
        {
          nom: 'Phase Préliminaire',
          dureeHeures: 2,
          objectifs: ['Analyser la demande', 'Définir les objectifs', 'Informer sur les conditions'],
          realise: true,
        },
        {
          nom: 'Phase d\'Investigation',
          dureeHeures: bilan.duree_heures - 5,
          objectifs: ['Analyser les compétences', 'Explorer les pistes', 'Construire le projet'],
          realise: true,
        },
        {
          nom: 'Phase de Conclusion',
          dureeHeures: 3,
          objectifs: ['Synthétiser les résultats', 'Valider le projet', 'Élaborer le plan d\'action'],
          realise: true,
        },
      ],
      
      assiduite: {
        tauxPresence: 100,
        nombreSeancesPrevu: bilan.nombre_seances || 8,
        nombreSeancesRealise: bilan.nombre_seances || 8,
        observations: 'Assiduité exemplaire tout au long du parcours',
      },
      
      dateEmission: new Date().toISOString(),
      
      signature: {
        nom: bilan.organisme.contact_nom,
        prenom: bilan.organisme.contact_prenom,
        fonction: 'Responsable Pédagogique',
        date: new Date().toISOString(),
      },
    };

    // Enregistrer dans la base de données
    const { data: savedAttestation, error: saveError } = await supabase
      .from('documents')
      .insert({
        id: attestation.id,
        type: attestation.type,
        bilan_id: bilanId,
        statut: attestation.statut,
        contenu: attestation,
        created_at: attestation.dateCreation,
        updated_at: attestation.dateModification,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Erreur lors de l\'enregistrement:', saveError);
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement' }, { status: 500 });
    }

    return NextResponse.json({ attestation }, { status: 201 });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

