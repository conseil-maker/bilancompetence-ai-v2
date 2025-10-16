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
    const { questionOriginale, reponse, context } = body;

    // Validation
    if (!questionOriginale || !reponse || !context) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    // Générer la question de suivi
    const followUpQuestion = await questionGenerator.generateFollowUpQuestion(
      context as QuestionContext,
      questionOriginale,
      reponse
    );

    // Enregistrer la question de suivi
    const { data: questionData, error: insertError } = await supabase
      .from('questions_suivi')
      .insert({
        user_id: session.user.id,
        question_originale: questionOriginale,
        reponse_originale: reponse,
        question_suivi: followUpQuestion,
        context: context,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erreur lors de l\'enregistrement de la question de suivi:', insertError);
    }

    return NextResponse.json({
      success: true,
      question: followUpQuestion,
      id: questionData?.id,
    });

  } catch (error) {
    console.error('Erreur lors de la génération de question de suivi:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération de question de suivi' },
      { status: 500 }
    );
  }
}

