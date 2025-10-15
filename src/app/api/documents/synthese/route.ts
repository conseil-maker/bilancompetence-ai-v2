import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DocumentSynthese } from '@/types/documents';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { bilanId, avecIA } = body;

    // Récupérer toutes les données du bilan
    const { data: bilan, error: bilanError } = await supabase
      .from('bilans')
      .select(`
        *,
        beneficiaire:beneficiaire_id(*),
        consultant:consultant_id(*),
        organisme:organisme_id(*),
        parcours:parcours_bilan(*)
      `)
      .eq('id', bilanId)
      .single();

    if (bilanError || !bilan) {
      return NextResponse.json({ error: 'Bilan non trouvé' }, { status: 404 });
    }

    // Récupérer les données du parcours
    const parcours = bilan.parcours;

    let syntheseTexte = '';
    let pointsForts: string[] = [];
    let competencesCles: string[] = [];
    let recommandations: string[] = [];

    if (avecIA && parcours) {
      // Générer la synthèse avec l'IA
      const prompt = `Tu es un consultant en bilan de compétences. Génère une synthèse professionnelle et personnalisée basée sur les données suivantes :

Bénéficiaire : ${bilan.beneficiaire.prenom} ${bilan.beneficiaire.nom}
Parcours professionnel : ${parcours.phasePreliminaire?.contexte || 'Non renseigné'}
Motivations : ${parcours.phasePreliminaire?.motivations || 'Non renseignées'}
Objectifs : ${JSON.stringify(parcours.phasePreliminaire?.objectifs || [])}

Compétences identifiées : ${JSON.stringify(parcours.phaseInvestigation?.competencesIdentifiees || [])}
Tests réalisés : ${JSON.stringify(parcours.phaseInvestigation?.testsRealises || [])}
Pistes explorées : ${JSON.stringify(parcours.phaseInvestigation?.pistesExplorees || [])}

Projet professionnel : ${parcours.phaseConclusion?.projetProfessionnel?.description || 'Non défini'}
Type de projet : ${parcours.phaseConclusion?.projetProfessionnel?.type || 'Non défini'}

Génère une synthèse structurée en JSON avec :
- syntheseTexte : texte de synthèse (300-500 mots)
- pointsForts : liste de 5-7 points forts
- competencesCles : liste de 5-10 compétences clés
- recommandations : liste de 5-7 recommandations personnalisées`;

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'Tu es un consultant expert en bilan de compétences. Tu génères des synthèses professionnelles, personnalisées et constructives.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: { type: 'json_object' },
        });

        const result = JSON.parse(completion.choices[0].message.content || '{}');
        syntheseTexte = result.syntheseTexte || '';
        pointsForts = result.pointsForts || [];
        competencesCles = result.competencesCles || [];
        recommandations = result.recommandations || [];
      } catch (iaError) {
        console.error('Erreur IA:', iaError);
        // Fallback sur une synthèse basique
        syntheseTexte = 'Synthèse générée automatiquement à partir des données du bilan.';
      }
    }

    // Créer le document de synthèse
    const synthese: DocumentSynthese = {
      id: crypto.randomUUID(),
      type: 'DOCUMENT_SYNTHESE',
      statut: 'BROUILLON',
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
      versionNumber: 1,
      
      beneficiaire: {
        id: bilan.beneficiaire.id,
        nom: bilan.beneficiaire.nom,
        prenom: bilan.beneficiaire.prenom,
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
      },
      
      periode: {
        dateDebut: bilan.date_debut,
        dateFin: bilan.date_fin,
        dureeHeures: bilan.duree_heures,
      },
      
      contenu: {
        introduction: {
          contexte: parcours?.phasePreliminaire?.contexte || '',
          motivations: parcours?.phasePreliminaire?.motivations || '',
          objectifs: parcours?.phasePreliminaire?.objectifs || [],
        },
        
        parcours: {
          phasePreliminaire: {
            dureeHeures: 2,
            activitesRealisees: ['Entretien initial', 'Analyse du parcours', 'Définition des objectifs'],
            resultats: 'Objectifs définis et validés',
          },
          phaseInvestigation: {
            dureeHeures: bilan.duree_heures - 5,
            testsRealises: parcours?.phaseInvestigation?.testsRealises || [],
            competencesIdentifiees: parcours?.phaseInvestigation?.competencesIdentifiees || [],
            pistesExplorees: parcours?.phaseInvestigation?.pistesExplorees || [],
          },
          phaseConclusion: {
            dureeHeures: 3,
            syntheseRealisee: true,
            projetDefini: !!parcours?.phaseConclusion?.projetProfessionnel,
          },
        },
        
        synthese: {
          texte: syntheseTexte,
          pointsForts: pointsForts,
          competencesCles: competencesCles,
        },
        
        projetProfessionnel: parcours?.phaseConclusion?.projetProfessionnel || {
          type: 'NON_DEFINI',
          description: '',
          objectifs: [],
          echeance: '',
          moyensNecessaires: [],
        },
        
        planAction: parcours?.phaseConclusion?.planAction || {
          actions: [],
          priorites: [],
          ressources: [],
        },
        
        recommandations: recommandations,
        
        conclusion: 'Ce bilan de compétences a permis d\'identifier les compétences, les motivations et les pistes professionnelles du bénéficiaire. Le projet professionnel défini est réaliste et réalisable avec les moyens identifiés.',
      },
      
      confidentialite: {
        proprietaire: 'BENEFICIAIRE',
        diffusionAutorisee: false,
        archivageDuree: 3,
      },
    };

    // Enregistrer dans la base de données
    const { data: savedSynthese, error: saveError } = await supabase
      .from('documents')
      .insert({
        id: synthese.id,
        type: synthese.type,
        bilan_id: bilanId,
        statut: synthese.statut,
        contenu: synthese,
        created_at: synthese.dateCreation,
        updated_at: synthese.dateModification,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Erreur lors de l\'enregistrement:', saveError);
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement' }, { status: 500 });
    }

    return NextResponse.json({ synthese }, { status: 201 });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

