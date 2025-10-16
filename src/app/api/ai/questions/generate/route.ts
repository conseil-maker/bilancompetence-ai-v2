import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { questionGenerator, QuestionContext } from '@/lib/ai/question-generator';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Vérifier l'authentification
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { context, nombreQuestions, type } = body;

    // Validation
    if (!context || !context.phase || !context.categorie) {
      return NextResponse.json(
        { error: 'Contexte invalide' },
        { status: 400 }
      );
    }

    // Générer les questions selon le type
    const questionsArray = [];
    const nbQuestions = nombreQuestions || (type === 'adaptive' ? 5 : 10);
    
    for (let i = 0; i < nbQuestions; i++) {
      const question = await questionGenerator.generateQuestion(context as QuestionContext);
      questionsArray.push(question);
    }
    
    // Créer le questionSet avec les questions générées
    const questionSet = {
      questions: questionsArray,
      ordre: questionsArray.map((_, index) => index + 1),
      dureeEstimee: nbQuestions * 3, // 3 minutes par question en moyenne
      objectif: `Générer ${nbQuestions} questions pour la phase ${context.phase}`,
    };

    // Enregistrer les questions générées dans la base de données
    const { data: questionsData, error: insertError } = await supabase
      .from('questions_generees')
      .insert({
        user_id: session.user.id,
        phase: context.phase,
        categorie: context.categorie,
        questions: questionSet.questions,
        ordre: questionSet.ordre,
        duree_estimee: questionSet.dureeEstimee,
        objectif: questionSet.objectif,
        context: context,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erreur lors de l\'enregistrement des questions:', insertError);
      // On continue même si l'enregistrement échoue
    }

    return NextResponse.json({
      success: true,
      questionSet,
      id: questionsData?.id,
    });

  } catch (error) {
    console.error('Erreur lors de la génération de questions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération de questions' },
      { status: 500 }
    );
  }
}

