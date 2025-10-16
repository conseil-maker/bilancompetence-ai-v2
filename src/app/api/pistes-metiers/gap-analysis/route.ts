/**
 * API Route: Génération de Gap Analysis
 * POST /api/pistes-metiers/gap-analysis
 * 
 * Utilise Gemini pour générer l'analyse d'écart entre compétences actuelles et requises
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface GapAnalysisRequest {
  pisteMetierId: string;
}

interface EcartCompetenceSuggested {
  competence_requise: string;
  niveau_requis: number;
  importance: 'essentielle' | 'importante' | 'souhaitable';
  competence_actuelle_id?: string;
  niveau_actuel?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: GapAnalysisRequest = await request.json();
    const { pisteMetierId } = body;

    if (!pisteMetierId) {
      return NextResponse.json(
        { error: 'pisteMetierId est requis' },
        { status: 400 }
      );
    }

    // Vérifier l'authentification
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer la piste métier avec le bilan et les compétences
    const { data: piste, error: pisteError } = await supabase
      .from('pistes_metiers')
      .select(`
        *,
        bilans!inner(
          id,
          beneficiaire_id,
          consultant_id,
          competences(*)
        )
      `)
      .eq('id', pisteMetierId)
      .single();

    if (pisteError || !piste) {
      return NextResponse.json(
        { error: 'Piste métier introuvable' },
        { status: 404 }
      );
    }

    const bilan = piste.bilans as any;

    // Vérifier les permissions
    if (
      bilan.beneficiaire_id !== user.id &&
      bilan.consultant_id !== user.id
    ) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Préparer le prompt pour Gemini
    const prompt = `Tu es un expert en analyse de compétences et en gestion de carrière.

Analyse la piste métier suivante et les compétences actuelles du bénéficiaire, puis génère une analyse d'écart (Gap Analysis) détaillée.

**Piste métier visée :**
- Titre : ${piste.titre}
- Description : ${piste.description}
- Missions principales : ${piste.missions_principales?.join(', ') || 'N/A'}
- Code ROME : ${piste.code_rome || 'N/A'}
- Secteur : ${piste.secteur_activite || 'N/A'}

**Compétences actuelles du bénéficiaire (${bilan.competences?.length || 0}) :**
${
  bilan.competences
    ?.map(
      (comp: any) =>
        `- ${comp.nom} (${comp.categorie}) - Niveau ${comp.niveau || 'N/A'}/5`
    )
    .join('\n') || 'Aucune compétence enregistrée'
}

**Instructions :**
1. Identifie TOUTES les compétences requises pour ce métier
2. Classe-les par importance :
   - **essentielle** : Indispensable pour exercer le métier
   - **importante** : Nécessaire pour être performant
   - **souhaitable** : Un plus appréciable
3. Pour chaque compétence requise :
   - Détermine le niveau requis (1-5)
   - Cherche si le bénéficiaire possède déjà cette compétence
   - Si oui, indique le niveau actuel et l'écart
   - Si non, indique qu'elle est à acquérir
4. Sois exhaustif et précis

**Format de sortie (JSON uniquement) :**
{
  "ecarts": [
    {
      "competence_requise": "Nom de la compétence",
      "niveau_requis": 3,
      "importance": "essentielle|importante|souhaitable",
      "competence_actuelle_nom": "Nom de la compétence actuelle si trouvée",
      "niveau_actuel": 2,
      "statut": "acquise|a_developper|a_acquerir"
    }
  ],
  "synthese": {
    "points_forts": ["Point fort 1", "Point fort 2"],
    "competences_a_developper": ["Compétence 1", "Compétence 2"],
    "competences_a_acquerir": ["Compétence 1", "Compétence 2"],
    "faisabilite": "Évaluation de la faisabilité de la transition",
    "recommandations": "Recommandations pour combler les écarts"
  }
}

Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`;

    // Appeler Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parser la réponse JSON
    let gapData: {
      ecarts: any[];
      synthese: any;
    };
    try {
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      gapData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      console.error('Texte reçu:', text);
      return NextResponse.json(
        { error: 'Erreur lors du parsing de la réponse IA' },
        { status: 500 }
      );
    }

    // Trouver les correspondances avec les compétences existantes
    const ecartsToInsert = await Promise.all(
      gapData.ecarts.map(async (ecart: any) => {
        let competence_actuelle_id = null;

        // Chercher une compétence correspondante
        if (ecart.competence_actuelle_nom) {
          const { data: competenceMatch } = await supabase
            .from('competences')
            .select('id, niveau')
            .eq('bilan_id', bilan.id)
            .ilike('nom', `%${ecart.competence_actuelle_nom}%`)
            .limit(1)
            .single();

          if (competenceMatch) {
            competence_actuelle_id = competenceMatch.id;
            ecart.niveau_actuel = competenceMatch.niveau;
          }
        }

        return {
          piste_metier_id: pisteMetierId,
          competence_requise: ecart.competence_requise,
          niveau_requis: ecart.niveau_requis,
          importance: ecart.importance,
          competence_actuelle_id,
          niveau_actuel: ecart.niveau_actuel || null,
        };
      })
    );

    // Insérer les écarts dans la base de données
    const { data: insertedEcarts, error: insertError } = await supabase
      .from('ecarts_competences')
      .insert(ecartsToInsert)
      .select();

    if (insertError) {
      console.error('Erreur d\'insertion:', insertError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement des écarts de compétences' },
        { status: 500 }
      );
    }

    // Enregistrer l'activité
    await supabase.from('activites').insert({
      bilan_id: bilan.id,
      user_id: user.id,
      type: 'gap_analysis',
      description: `Analyse d'écart générée pour "${piste.titre}"`,
      metadata: {
        piste_metier_id: pisteMetierId,
        nombre_ecarts: insertedEcarts.length,
        synthese: gapData.synthese,
      },
    });

    return NextResponse.json({
      success: true,
      ecarts: insertedEcarts,
      synthese: gapData.synthese,
      count: insertedEcarts.length,
    });
  } catch (error) {
    console.error('Erreur dans /api/pistes-metiers/gap-analysis:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

