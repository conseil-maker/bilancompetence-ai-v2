/**
 * API Route: Suggestion de pistes métiers
 * POST /api/pistes-metiers/suggest
 * 
 * Utilise Gemini pour suggérer des pistes métiers basées sur le profil
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface SuggestRequest {
  bilanId: string;
}

interface PisteMetierSuggested {
  titre: string;
  code_rome?: string;
  code_esco?: string;
  famille_metier?: string;
  secteur_activite?: string;
  description: string;
  missions_principales: string[];
  environnement_travail?: string;
  score_adequation: number;
  salaire_min?: number;
  salaire_max?: number;
  tendance_recrutement?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SuggestRequest = await request.json();
    const { bilanId } = body;

    if (!bilanId) {
      return NextResponse.json(
        { error: 'bilanId est requis' },
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

    // Récupérer le bilan avec toutes les données nécessaires
    const { data: bilan, error: bilanError } = await supabase
      .from('bilans')
      .select(`
        *,
        beneficiaire:profiles!bilans_beneficiaire_id_fkey(*),
        experiences(*),
        competences(*),
        tests(*)
      `)
      .eq('id', bilanId)
      .single();

    if (bilanError || !bilan) {
      return NextResponse.json(
        { error: 'Bilan introuvable' },
        { status: 404 }
      );
    }

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

    // Préparer les données du profil pour l'IA
    const profilData = {
      objectifs: bilan.objectifs,
      experiences: bilan.experiences || [],
      competences: bilan.competences || [],
      tests: bilan.tests || [],
    };

    // Préparer le prompt pour Gemini
    const prompt = `Tu es un conseiller en orientation professionnelle expert, spécialisé dans les bilans de compétences.

Analyse le profil suivant et suggère 10 pistes métiers pertinentes et réalistes.

**Profil du bénéficiaire :**

**Objectifs :**
${JSON.stringify(profilData.objectifs, null, 2)}

**Expériences (${profilData.experiences.length}) :**
${profilData.experiences
  .map(
    (exp: any) =>
      `- ${exp.titre} chez ${exp.entreprise || 'N/A'} (${exp.type}) - ${exp.duree_mois || 0} mois`
  )
  .join('\n')}

**Compétences (${profilData.competences.length}) :**
${profilData.competences
  .map(
    (comp: any) =>
      `- ${comp.nom} (${comp.categorie}) - Niveau ${comp.niveau || 'N/A'}`
  )
  .join('\n')}

**Tests passés :**
${profilData.tests.map((test: any) => `- ${test.nom} (${test.type})`).join('\n')}

**Instructions :**
1. Analyse en profondeur le profil pour identifier les forces, intérêts et potentiels
2. Suggère 10 pistes métiers variées mais cohérentes avec le profil
3. Pour chaque piste, calcule un score d'adéquation (0-100) basé sur :
   - Correspondance avec les compétences actuelles (40%)
   - Alignement avec les objectifs (30%)
   - Faisabilité de la transition (20%)
   - Tendance du marché (10%)
4. Inclus des informations sur le marché du travail si possible
5. Varie les niveaux de responsabilité et les secteurs

**Format de sortie (JSON uniquement) :**
{
  "pistes_metiers": [
    {
      "titre": "Titre du métier",
      "code_rome": "Code ROME si connu",
      "code_esco": "Code ESCO si connu",
      "famille_metier": "Famille de métier",
      "secteur_activite": "Secteur d'activité",
      "description": "Description détaillée du métier",
      "missions_principales": ["Mission 1", "Mission 2", "Mission 3"],
      "environnement_travail": "Description de l'environnement",
      "score_adequation": 85,
      "salaire_min": 30000,
      "salaire_max": 45000,
      "tendance_recrutement": "forte_demande|demande_moderee|faible_demande"
    }
  ],
  "analyse": "Analyse synthétique du profil et justification des suggestions"
}

Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`;

    // Appeler Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parser la réponse JSON
    let pistesData: {
      pistes_metiers: PisteMetierSuggested[];
      analyse: string;
    };
    try {
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      pistesData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      console.error('Texte reçu:', text);
      return NextResponse.json(
        { error: 'Erreur lors du parsing de la réponse IA' },
        { status: 500 }
      );
    }

    // Insérer les pistes métiers dans la base de données
    const pistesToInsert = pistesData.pistes_metiers.map((piste) => ({
      bilan_id: bilanId,
      titre: piste.titre,
      code_rome: piste.code_rome || null,
      code_esco: piste.code_esco || null,
      famille_metier: piste.famille_metier || null,
      secteur_activite: piste.secteur_activite || null,
      description: piste.description,
      missions_principales: piste.missions_principales,
      environnement_travail: piste.environnement_travail || null,
      score_adequation: piste.score_adequation,
      source: 'ia_suggestion' as const,
      statut: 'a_explorer' as const,
      priorite: null,
      salaire_min: piste.salaire_min || null,
      salaire_max: piste.salaire_max || null,
      tendance_recrutement: piste.tendance_recrutement || null,
      regions_recrutement: null,
      enquete_realisee: false,
      enquete_notes: null,
      contacts_professionnels: null,
      favoris: false,
    }));

    const { data: insertedPistes, error: insertError } = await supabase
      .from('pistes_metiers')
      .insert(pistesToInsert)
      .select();

    if (insertError) {
      console.error('Erreur d\'insertion:', insertError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement des pistes métiers' },
        { status: 500 }
      );
    }

    // Enregistrer l'activité
    await supabase.from('activites').insert({
      bilan_id: bilanId,
      user_id: user.id,
      type: 'suggestion_pistes_metiers',
      description: `Suggestion de ${insertedPistes.length} pistes métiers par l'IA`,
      metadata: {
        nombre_pistes: insertedPistes.length,
        analyse: pistesData.analyse,
      },
    });

    return NextResponse.json({
      success: true,
      pistes_metiers: insertedPistes,
      analyse: pistesData.analyse,
      count: insertedPistes.length,
    });
  } catch (error) {
    console.error('Erreur dans /api/pistes-metiers/suggest:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

