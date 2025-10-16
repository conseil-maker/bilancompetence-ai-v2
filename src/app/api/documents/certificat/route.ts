import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
nexport const runtime = 'nodejs';
import { CertificatRealisation } from '@/types/documents';
import crypto from 'crypto';

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

    // Générer un numéro de certificat unique
    const numeroCertificat = `CERT-${bilan.organisme.siret}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    // Générer une signature numérique
    const dataToSign = `${numeroCertificat}-${bilanId}-${bilan.beneficiaire.id}-${new Date().toISOString()}`;
    const signatureNumerique = crypto
      .createHash('sha256')
      .update(dataToSign)
      .digest('hex');

    // Créer le certificat
    const certificat: CertificatRealisation = {
      id: crypto.randomUUID(),
      type: 'CERTIFICAT_REALISATION',
      statut: 'VALIDE',
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
      versionNumber: 1,
      
      numeroCertificat,
      
      beneficiaire: {
        id: bilan.beneficiaire.id,
        nom: bilan.beneficiaire.nom,
        prenom: bilan.beneficiaire.prenom,
        dateNaissance: bilan.beneficiaire.date_naissance,
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
      },
      
      action: {
        intitule: 'Bilan de Compétences',
        codeCPF: '202',
        categorie: 'Action de développement des compétences',
        dateDebut: bilan.date_debut,
        dateFin: bilan.date_fin,
        dureeHeures: bilan.duree_heures,
        modalites: ['Présentiel', 'Distanciel'],
      },
      
      realisation: {
        dateDebut: bilan.date_debut,
        dateFin: bilan.date_fin,
        dureeRealisee: bilan.duree_heures,
        tauxRealisation: 100,
        assiduite: 'Assiduité complète',
      },
      
      financeur: {
        type: bilan.financeur_type || 'CPF',
        nom: bilan.financeur_nom || 'Compte Personnel de Formation',
        montantPrisEnCharge: bilan.montant_total || 0,
      },
      
      referencesLegales: {
        articleCodeTravail: 'L6353-1',
        certificationQualiopi: bilan.organisme.numero_qualiopi,
        numeroDeclarationActivite: bilan.organisme.numero_declaration_activite,
      },
      
      dateEmission: new Date().toISOString(),
      
      signature: {
        nom: bilan.organisme.contact_nom,
        prenom: bilan.organisme.contact_prenom,
        fonction: 'Responsable Pédagogique',
        date: new Date().toISOString(),
      },
      
      signatureNumerique,
    };

    // Enregistrer dans la base de données
    const { data: savedCertificat, error: saveError } = await supabase
      .from('documents')
      .insert({
        id: certificat.id,
        type: certificat.type,
        bilan_id: bilanId,
        statut: certificat.statut,
        contenu: certificat,
        created_at: certificat.dateCreation,
        updated_at: certificat.dateModification,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Erreur lors de l\'enregistrement:', saveError);
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement' }, { status: 500 });
    }

    // Marquer le bilan comme terminé
    await supabase
      .from('bilans')
      .update({ statut: 'TERMINE' })
      .eq('id', bilanId);

    return NextResponse.json({ certificat }, { status: 201 });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

