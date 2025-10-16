import { NextRequest, NextResponse } from 'next/server';
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
    let questionSet;
    
    if (type === 'adaptive' && context.reponsesPrecedentes) {
      questionSet = await questionGenerator.generateAdaptiveQuestions(
        context as QuestionContext,
        nombreQuestions || 5
      );
    } else {
      questionSet = await questionGenerator.generateQuestions(
        context as QuestionContext,
        nombreQuestions || 10
      );
    }

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

