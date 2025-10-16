import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { createClient } from '@/lib/supabase/server';
import { questionGenerator, QuestionContext } from '@/lib/ai/question-generator';
import { z } from 'zod';

// Schéma de validation Zod
const QuestionContextSchema = z.object({
  phase: z.string().min(1),
  categorie: z.string().min(1),
  bilanId: z.string().uuid().optional(),
  objectif: z.string().optional(),
});

const GenerateQuestionsSchema = z.object({
  context: QuestionContextSchema,
  nombreQuestions: z.number().int().min(1).max(20).optional(),
  type: z.enum(['adaptive', 'standard']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Vérifier l'authentification
    const { data: { session } } = await supabase.auth.getSession();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validation avec Zod
    const validationResult = GenerateQuestionsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const { context, nombreQuestions, type } = validationResult.data;

    // Générer les questions en parallèle pour améliorer les performances
    const nbQuestions = nombreQuestions || (type === 'adaptive' ? 5 : 10);
    
    const questionPromises = Array.from({ length: nbQuestions }, () =>
      questionGenerator.generateQuestion(context as QuestionContext)
    );
    
    const questionsArray = await Promise.all(questionPromises);
    
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

