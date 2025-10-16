/**
 * API Route: Génération de la synthèse de bilan avec IA
 * POST /api/bilans/generate-synthese
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

    // Récupérer les données de la requête
    const { bilanId } = await request.json();

    if (!bilanId) {
      return NextResponse.json(
        { error: 'bilanId requis' },
        { status: 400 }
      );
    }

    // Vérifier les permissions (consultant ou admin)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['consultant', 'admin'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Permission refusée' },
        { status: 403 }
      );
    }

    // Récupérer toutes les données du bilan
    const { data: bilan, error: bilanError } = await supabase
      .from('bilans')
      .select(`
        *,
        beneficiaire:profiles!bilans_beneficiaire_id_fkey(*),
        consultant:profiles!bilans_consultant_id_fkey(*),
        experiences(*),
        competences(*),
        pistes_metiers(*),
        plan_action(*),
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

    // Préparer le prompt pour Gemini
    const prompt = `
Tu es un consultant expert en bilans de compétences. Tu dois générer un document de synthèse professionnel et structuré pour le bénéficiaire suivant.

# INFORMATIONS DU BÉNÉFICIAIRE
- Nom: ${bilan.beneficiaire.last_name} ${bilan.beneficiaire.first_name}
- Email: ${bilan.beneficiaire.email}

# OBJECTIFS DU BILAN
${JSON.stringify(bilan.objectifs, null, 2)}

# EXPÉRIENCES PROFESSIONNELLES
${bilan.experiences.map((exp: any) => `
- ${exp.titre} chez ${exp.entreprise || 'N/A'} (${exp.date_debut} - ${exp.date_fin || 'En cours'})
  ${exp.description || ''}
`).join('\n')}

# COMPÉTENCES IDENTIFIÉES
${bilan.competences.map((comp: any) => `
- ${comp.nom} (${comp.categorie}) - Niveau: ${comp.niveau}/5
`).join('\n')}

# PISTES MÉTIERS EXPLORÉES
${bilan.pistes_metiers.map((piste: any) => `
- ${piste.titre} (${piste.statut})
  Score d'adéquation: ${piste.score_adequation || 'N/A'}
  ${piste.description || ''}
`).join('\n')}

# PLAN D'ACTION
${bilan.plan_action.map((action: any) => `
- ${action.titre} (${action.type}) - ${action.statut}
  Échéance: ${action.date_echeance || 'Non définie'}
`).join('\n')}

# RÉSULTATS DES TESTS
${bilan.tests.map((test: any) => `
- ${test.nom} (${test.type})
  Score: ${test.score || 'N/A'}
  ${test.interpretation || ''}
`).join('\n')}

---

Génère un document de synthèse structuré en Markdown avec les sections suivantes:

1. **Introduction** : Présentation du bénéficiaire et contexte du bilan
2. **Analyse du Parcours** : Synthèse des expériences et compétences
3. **Résultats des Tests** : Interprétation des tests psychométriques
4. **Projet Professionnel** : Pistes métiers retenues et justification
5. **Plan d'Action** : Étapes concrètes pour la mise en œuvre du projet
6. **Conclusion** : Synthèse et perspectives

Le document doit être:
- Professionnel et bienveillant
- Structuré et facile à lire
- Personnalisé pour le bénéficiaire
- Conforme aux exigences Qualiopi
- Entre 3000 et 5000 mots
`;

    // Générer la synthèse avec Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(prompt);
    const syntheseContent = result.response.text();

    // Enregistrer l'activité
    await supabase.from('activites').insert({
      bilan_id: bilanId,
      user_id: user.id,
      type: 'synthese_generee',
      description: 'Génération de la synthèse avec IA',
      metadata: {
        model: 'gemini-2.0-flash-exp',
        length: syntheseContent.length,
      },
    });

    return NextResponse.json({
      success: true,
      synthese: syntheseContent,
      metadata: {
        generated_at: new Date().toISOString(),
        model: 'gemini-2.0-flash-exp',
        length: syntheseContent.length,
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de la génération de la synthèse:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

