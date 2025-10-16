import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
nexport const runtime = 'nodejs';
import { ConventionBilan } from '@/types/documents';
import { generatePDF } from '@/lib/documents/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { bilanId, ...conventionData } = body;

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

    // Créer la convention
    const convention: ConventionBilan = {
      id: crypto.randomUUID(),
      type: 'CONVENTION_BILAN',
      statut: 'BROUILLON',
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
      versionNumber: 1,
      
      beneficiaire: {
        id: bilan.beneficiaire.id,
        nom: bilan.beneficiaire.nom,
        prenom: bilan.beneficiaire.prenom,
        email: bilan.beneficiaire.email,
        telephone: bilan.beneficiaire.telephone,
        dateNaissance: bilan.beneficiaire.date_naissance,
        adresse: {
          rue: bilan.beneficiaire.adresse_rue,
          codePostal: bilan.beneficiaire.adresse_code_postal,
          ville: bilan.beneficiaire.adresse_ville,
          pays: 'France',
        },
      },
      
      consultant: {
        id: bilan.consultant.id,
        nom: bilan.consultant.nom,
        prenom: bilan.consultant.prenom,
        email: bilan.consultant.email,
        telephone: bilan.consultant.telephone,
        qualifications: bilan.consultant.qualifications || [],
      },
      
      organisme: {
        id: bilan.organisme.id,
        nom: bilan.organisme.nom,
        siret: bilan.organisme.siret,
        numeroDeclarationActivite: bilan.organisme.numero_declaration_activite,
        numeroQualiopi: bilan.organisme.numero_qualiopi,
        dateValiditeQualiopi: bilan.organisme.date_validite_qualiopi,
        adresse: {
          rue: bilan.organisme.adresse_rue,
          codePostal: bilan.organisme.adresse_code_postal,
          ville: bilan.organisme.adresse_ville,
          pays: 'France',
        },
        contact: {
          nom: bilan.organisme.contact_nom,
          prenom: bilan.organisme.contact_prenom,
          email: bilan.organisme.contact_email,
          telephone: bilan.organisme.contact_telephone,
        },
      },
      
      periode: {
        dateDebut: conventionData.periode.dateDebut,
        dateFin: conventionData.periode.dateFin,
        dureeHeures: conventionData.periode.dureeHeures,
        modalites: conventionData.periode.modalites,
      },
      
      objectifs: conventionData.objectifs,
      
      phases: [
        {
          nom: 'Phase Préliminaire',
          description: 'Analyse de la demande et définition des objectifs',
          dureeHeures: 2,
          activites: [
            'Entretien individuel',
            'Analyse du parcours professionnel',
            'Définition des objectifs du bilan',
          ],
        },
        {
          nom: 'Phase d\'Investigation',
          description: 'Exploration des compétences et des pistes professionnelles',
          dureeHeures: conventionData.periode.dureeHeures - 5,
          activites: [
            'Tests psychométriques (MBTI, DISC, Big Five, RIASEC)',
            'Évaluation des compétences',
            'Exploration des pistes professionnelles',
            'Recherche documentaire',
          ],
        },
        {
          nom: 'Phase de Conclusion',
          description: 'Synthèse et élaboration du projet professionnel',
          dureeHeures: 3,
          activites: [
            'Synthèse des résultats',
            'Élaboration du projet professionnel',
            'Construction du plan d\'action',
            'Remise du document de synthèse',
          ],
        },
      ],
      
      financeur: conventionData.financeur,
      
      conditionsParticulieres: conventionData.conditionsParticulieres || [],
      
      signatures: {
        beneficiaire: null,
        consultant: null,
        organisme: null,
      },
      
      mentionsLegales: {
        confidentialite: true,
        droitRetractation: true,
        protectionDonnees: true,
      },
    };

    // Enregistrer dans la base de données
    const { data: savedConvention, error: saveError } = await supabase
      .from('documents')
      .insert({
        id: convention.id,
        type: convention.type,
        bilan_id: bilanId,
        statut: convention.statut,
        contenu: convention,
        created_at: convention.dateCreation,
        updated_at: convention.dateModification,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Erreur lors de l\'enregistrement:', saveError);
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement' }, { status: 500 });
    }

    return NextResponse.json({ convention }, { status: 201 });
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

    if (!bilanId) {
      return NextResponse.json({ error: 'bilanId requis' }, { status: 400 });
    }

    // Récupérer la convention
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('bilan_id', bilanId)
      .eq('type', 'CONVENTION_BILAN')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !document) {
      return NextResponse.json({ error: 'Convention non trouvée' }, { status: 404 });
    }

    return NextResponse.json({ convention: document.contenu });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

