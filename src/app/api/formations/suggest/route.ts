/**
 * API Route: Suggestion de formations
 * POST /api/formations/suggest
 * 
 * Utilise Gemini pour suggérer des formations adaptées aux écarts de compétences
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface SuggestFormationsRequest {
  pisteMetierId: string;
}

interface FormationSuggested {
  titre: string;
  organisme?: string;
  type: 'diplome' | 'certification' | 'formation_courte' | 'mooc' | 'vae';
  niveau?: string;
  description: string;
  objectifs: string[];
  competences_visees: string[];
  duree_heures?: number;
  duree_mois?: number;
  modalite?: 'presentiel' | 'distanciel' | 'hybride';
  cout_euros?: number;
  eligible_cpf: boolean;
  url_formation?: string;
  url_organisme?: string;
  ecarts_combles: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: SuggestFormationsRequest = await request.json();
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

    // Récupérer la piste métier avec les écarts de compétences
    const { data: piste, error: pisteError } = await supabase
      .from('pistes_metiers')
      .select(`
        *,
        bilans!inner(
          id,
          beneficiaire_id,
          consultant_id
        ),
        ecarts_competences(*)
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

    // Vérifier qu'il y a des écarts de compétences
    if (!piste.ecarts_competences || piste.ecarts_competences.length === 0) {
      return NextResponse.json(
        {
          error:
            'Aucun écart de compétence trouvé. Générez d\'abord une gap analysis.',
        },
        { status: 400 }
      );
    }

    // Préparer le prompt pour Gemini
    const prompt = `Tu es un expert en formation professionnelle et en orientation.

Analyse les écarts de compétences suivants et suggère des formations pertinentes pour les combler.

**Piste métier visée :**
- Titre : ${piste.titre}
- Description : ${piste.description}
- Secteur : ${piste.secteur_activite || 'N/A'}

**Écarts de compétences identifiés (${piste.ecarts_competences.length}) :**
${piste.ecarts_competences
  .map(
    (ecart: any) =>
      `- ${ecart.competence_requise} (Niveau requis: ${ecart.niveau_requis}/5, Actuel: ${ecart.niveau_actuel || 0}/5) - ${ecart.importance}`
  )
  .join('\n')}

**Instructions :**
1. Suggère 5-8 formations variées et complémentaires
2. Priorise les formations éligibles au CPF
3. Varie les types : diplômes, certifications, formations courtes, MOOCs, VAE
4. Indique clairement quels écarts chaque formation permet de combler
5. Fournis des informations réalistes sur la durée et le coût
6. Si possible, suggère des organismes de formation réputés

**Types de formations :**
- **diplome** : Diplôme d'État (Bac+2, Bac+3, etc.)
- **certification** : Certification professionnelle reconnue
- **formation_courte** : Formation de quelques jours à quelques semaines
- **mooc** : Formation en ligne ouverte à tous
- **vae** : Validation des Acquis de l'Expérience

**Format de sortie (JSON uniquement) :**
{
  "formations": [
    {
      "titre": "Titre de la formation",
      "organisme": "Nom de l'organisme",
      "type": "diplome|certification|formation_courte|mooc|vae",
      "niveau": "Niveau (ex: Bac+2, Bac+3)",
      "description": "Description détaillée",
      "objectifs": ["Objectif 1", "Objectif 2"],
      "competences_visees": ["Compétence 1", "Compétence 2"],
      "duree_heures": 350,
      "duree_mois": 6,
      "modalite": "presentiel|distanciel|hybride",
      "cout_euros": 3500,
      "eligible_cpf": true,
      "url_formation": "URL si connue",
      "url_organisme": "URL de l'organisme",
      "ecarts_combles": ["Nom de l'écart 1", "Nom de l'écart 2"]
    }
  ],
  "parcours_recommande": "Description d'un parcours de formation optimal",
  "cout_total_estime": 15000,
  "duree_totale_mois": 12
}

Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`;

    // Appeler Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parser la réponse JSON
    let formationsData: {
      formations: FormationSuggested[];
      parcours_recommande: string;
      cout_total_estime: number;
      duree_totale_mois: number;
    };
    try {
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      formationsData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      console.error('Texte reçu:', text);
      return NextResponse.json(
        { error: 'Erreur lors du parsing de la réponse IA' },
        { status: 500 }
      );
    }

    // Insérer les formations dans la base de données
    const formationsToInsert = formationsData.formations.map((formation) => ({
      bilan_id: bilan.id,
      piste_metier_id: pisteMetierId,
      titre: formation.titre,
      organisme: formation.organisme || null,
      type: formation.type,
      niveau: formation.niveau || null,
      description: formation.description,
      objectifs: formation.objectifs,
      competences_visees: formation.competences_visees,
      duree_heures: formation.duree_heures || null,
      duree_mois: formation.duree_mois || null,
      modalite: formation.modalite || null,
      cout_euros: formation.cout_euros || null,
      eligible_cpf: formation.eligible_cpf,
      url_formation: formation.url_formation || null,
      url_organisme: formation.url_organisme || null,
      statut: 'suggeree' as const,
      date_debut_prevue: null,
      date_fin_prevue: null,
      source: 'ia_suggestion',
      favoris: false,
    }));

    const { data: insertedFormations, error: insertError } = await supabase
      .from('formations')
      .insert(formationsToInsert)
      .select();

    if (insertError) {
      console.error('Erreur d\'insertion:', insertError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement des formations' },
        { status: 500 }
      );
    }

    // Créer les liaisons formations ↔ écarts
    const liaisonsToInsert: any[] = [];
    insertedFormations.forEach((formation: any, index: number) => {
      const formationSuggested = formationsData.formations[index];
      
      // Trouver les écarts correspondants
      formationSuggested.ecarts_combles.forEach((ecartNom: string) => {
        const ecartMatch = piste.ecarts_competences.find(
          (e: any) =>
            e.competence_requise.toLowerCase().includes(ecartNom.toLowerCase()) ||
            ecartNom.toLowerCase().includes(e.competence_requise.toLowerCase())
        );

        if (ecartMatch) {
          liaisonsToInsert.push({
            formation_id: formation.id,
            ecart_competence_id: ecartMatch.id,
          });
        }
      });
    });

    if (liaisonsToInsert.length > 0) {
      await supabase.from('formations_ecarts').insert(liaisonsToInsert);
    }

    // Enregistrer l'activité
    await supabase.from('activites').insert({
      bilan_id: bilan.id,
      user_id: user.id,
      type: 'suggestion_formations',
      description: `Suggestion de ${insertedFormations.length} formations pour "${piste.titre}"`,
      metadata: {
        piste_metier_id: pisteMetierId,
        nombre_formations: insertedFormations.length,
        parcours_recommande: formationsData.parcours_recommande,
        cout_total_estime: formationsData.cout_total_estime,
        duree_totale_mois: formationsData.duree_totale_mois,
      },
    });

    return NextResponse.json({
      success: true,
      formations: insertedFormations,
      parcours_recommande: formationsData.parcours_recommande,
      cout_total_estime: formationsData.cout_total_estime,
      duree_totale_mois: formationsData.duree_totale_mois,
      count: insertedFormations.length,
    });
  } catch (error) {
    console.error('Erreur dans /api/formations/suggest:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

