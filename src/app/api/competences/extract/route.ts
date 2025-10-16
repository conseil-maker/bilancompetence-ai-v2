/**
 * API Route: Extraction de compétences depuis un CV
 * POST /api/competences/extract
 * 
 * Utilise Gemini pour extraire les compétences d'un CV
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ExtractRequest {
  bilanId: string;
  cvText: string;
}

interface CompetenceExtracted {
  nom: string;
  categorie: 'technique' | 'transversale' | 'comportementale' | 'linguistique';
  sous_categorie?: string;
  niveau?: number;
  niveau_label?: string;
  code_rome?: string;
  code_esco?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ExtractRequest = await request.json();
    const { bilanId, cvText } = body;

    if (!bilanId || !cvText) {
      return NextResponse.json(
        { error: 'bilanId et cvText sont requis' },
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

    // Vérifier que l'utilisateur a accès au bilan
    const { data: bilan, error: bilanError } = await supabase
      .from('bilans')
      .select('*')
      .eq('id', bilanId)
      .single();

    if (bilanError || !bilan) {
      return NextResponse.json(
        { error: 'Bilan introuvable' },
        { status: 404 }
      );
    }

    // Vérifier les permissions (bénéficiaire ou consultant)
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
    const prompt = `Tu es un expert en analyse de CV et en extraction de compétences pour des bilans de compétences.

Analyse le CV suivant et extrais TOUTES les compétences identifiables, en les classant par catégorie.

**Catégories de compétences :**
- **technique** : Compétences techniques spécifiques (langages de programmation, logiciels, outils, machines, etc.)
- **transversale** : Compétences transférables entre différents métiers (gestion de projet, communication, organisation, etc.)
- **comportementale** : Soft skills et qualités personnelles (leadership, travail d'équipe, adaptabilité, etc.)
- **linguistique** : Langues parlées et écrites

**Niveau de compétence (1-5) :**
1 = Débutant / Notions
2 = Intermédiaire
3 = Confirmé
4 = Expert
5 = Maître / Référent

**Instructions :**
1. Extrais TOUTES les compétences mentionnées explicitement ou implicitement
2. Déduis le niveau de compétence basé sur :
   - Les années d'expérience
   - Le contexte d'utilisation
   - Les réalisations mentionnées
3. Ajoute une sous-catégorie pertinente si possible
4. Si tu identifies un code ROME ou ESCO, ajoute-le

**Format de sortie (JSON uniquement, pas de texte avant ou après) :**
{
  "competences": [
    {
      "nom": "Nom de la compétence",
      "categorie": "technique|transversale|comportementale|linguistique",
      "sous_categorie": "Sous-catégorie (optionnel)",
      "niveau": 1-5,
      "niveau_label": "Débutant|Intermédiaire|Confirmé|Expert|Maître",
      "code_rome": "Code ROME si identifiable",
      "code_esco": "Code ESCO si identifiable"
    }
  ]
}

**CV à analyser :**
${cvText}

Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`;

    // Appeler Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parser la réponse JSON
    let competencesData: { competences: CompetenceExtracted[] };
    try {
      // Nettoyer le texte (enlever les backticks markdown si présents)
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      competencesData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      console.error('Texte reçu:', text);
      return NextResponse.json(
        { error: 'Erreur lors du parsing de la réponse IA' },
        { status: 500 }
      );
    }

    // Insérer les compétences dans la base de données
    const competencesToInsert = competencesData.competences.map((comp) => ({
      bilan_id: bilanId,
      nom: comp.nom,
      categorie: comp.categorie,
      sous_categorie: comp.sous_categorie || null,
      niveau: comp.niveau || null,
      niveau_label: comp.niveau_label || null,
      source: 'ia_extraction' as const,
      validee_par_consultant: false,
      code_rome: comp.code_rome || null,
      code_esco: comp.code_esco || null,
    }));

    const { data: insertedCompetences, error: insertError } = await supabase
      .from('competences')
      .insert(competencesToInsert)
      .select();

    if (insertError) {
      console.error('Erreur d\'insertion:', insertError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement des compétences' },
        { status: 500 }
      );
    }

    // Enregistrer l'activité
    await supabase.from('activites').insert({
      bilan_id: bilanId,
      user_id: user.id,
      type: 'extraction_competences',
      description: `Extraction de ${insertedCompetences.length} compétences depuis le CV`,
      metadata: {
        nombre_competences: insertedCompetences.length,
      },
    });

    return NextResponse.json({
      success: true,
      competences: insertedCompetences,
      count: insertedCompetences.length,
    });
  } catch (error) {
    console.error('Erreur dans /api/competences/extract:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

