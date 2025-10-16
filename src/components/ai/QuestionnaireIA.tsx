'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Question, QuestionSet } from '@/lib/ai/question-generator';

interface QuestionnaireIAProps {
  phase: 'PRELIMINAIRE' | 'INVESTIGATION' | 'CONCLUSION' | 'SUIVI';
  categorie: string;
  profil: any;
  objectifs: string[];
  onComplete: (reponses: any[]) => void;
}

export default function QuestionnaireIA({
  phase,
  categorie,
  profil,
  objectifs,
  onComplete,
}: QuestionnaireIAProps) {
  const [loading, setLoading] = useState(true);
  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reponses, setReponses] = useState<any[]>([]);
  const [reponseActuelle, setReponseActuelle] = useState<any>(null);
  const [generatingFollowUp, setGeneratingFollowUp] = useState(false);

  // Charger les questions initiales
  useEffect(() => {
    loadQuestions();
  }, [phase, categorie]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/questions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: {
            phase,
            categorie,
            profil,
            objectifs,
            reponsesPrecedentes: reponses.length > 0 ? reponses.slice(-3) : undefined,
          },
          nombreQuestions: 10,
          type: reponses.length > 0 ? 'adaptive' : 'initial',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setQuestionSet(data.questionSet);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReponse = (valeur: any) => {
    setReponseActuelle(valeur);
  };

  const handleNext = async () => {
    if (!questionSet || !reponseActuelle) return;

    const currentQuestion = questionSet.questions[currentIndex];
    const nouvelleReponse = {
      question: currentQuestion.texte,
      reponse: reponseActuelle,
      type: currentQuestion.type,
      categorie: currentQuestion.categorie,
      timestamp: new Date().toISOString(),
    };

    const nouvellesReponses = [...reponses, nouvelleReponse];
    setReponses(nouvellesReponses);
    setReponseActuelle(null);

    // Si c'est la dernière question
    if (currentIndex === questionSet.questions.length - 1) {
      onComplete(nouvellesReponses);
      return;
    }

    // Vérifier si on doit générer une question de suivi
    const shouldGenerateFollowUp = 
      currentQuestion.type === 'OUVERTE' && 
      reponseActuelle.length > 50 &&
      Math.random() > 0.7; // 30% de chance

    if (shouldGenerateFollowUp) {
      setGeneratingFollowUp(true);
      try {
        const response = await fetch('/api/ai/questions/followup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionOriginale: currentQuestion.texte,
            reponse: reponseActuelle,
            context: {
              phase,
              categorie,
              profil,
              objectifs,
            },
          }),
        });

        const data = await response.json();
        if (data.success) {
          // Insérer la question de suivi après la question actuelle
          const newQuestions = [...questionSet.questions];
          newQuestions.splice(currentIndex + 1, 0, data.question);
          setQuestionSet({
            ...questionSet,
            questions: newQuestions,
          });
        }
      } catch (error) {
        console.error('Erreur lors de la génération de question de suivi:', error);
      } finally {
        setGeneratingFollowUp(false);
      }
    }

    setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // Restaurer la réponse précédente
      setReponseActuelle(reponses[currentIndex - 1]?.reponse);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">
              Génération de questions personnalisées...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!questionSet || questionSet.questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            Aucune question disponible
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questionSet.questions[currentIndex];
  const progress = ((currentIndex + 1) / questionSet.questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* En-tête avec progression */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Questions Intelligentes</CardTitle>
            </div>
            <span className="text-sm text-muted-foreground">
              Question {currentIndex + 1} / {questionSet.questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <CardDescription className="mt-4">
            {questionSet.objectif}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Question actuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.texte}</CardTitle>
          {currentQuestion.guidanceReponse && (
            <CardDescription className="mt-2">
              💡 {currentQuestion.guidanceReponse}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {/* Question ouverte */}
          {currentQuestion.type === 'OUVERTE' && (
            <Textarea
              value={reponseActuelle || ''}
              onChange={(e) => handleReponse(e.target.value)}
              placeholder="Votre réponse..."
              className="min-h-[150px]"
            />
          )}

          {/* Question fermée ou choix multiple */}
          {(currentQuestion.type === 'FERMEE' || currentQuestion.type === 'CHOIX_MULTIPLE') && (
            <RadioGroup
              value={reponseActuelle}
              onValueChange={handleReponse}
            >
              {currentQuestion.optionsReponse?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* Question avec échelle */}
          {currentQuestion.type === 'ECHELLE' && currentQuestion.echelle && (
            <div className="space-y-4">
              <Slider
                value={[reponseActuelle || currentQuestion.echelle.min]}
                onValueChange={(value) => handleReponse(value[0])}
                min={currentQuestion.echelle.min}
                max={currentQuestion.echelle.max}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{currentQuestion.echelle.labelMin}</span>
                <span className="font-semibold text-primary">
                  {reponseActuelle || currentQuestion.echelle.min}
                </span>
                <span>{currentQuestion.echelle.labelMax}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Boutons de navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Précédent
        </Button>

        <Button
          onClick={handleNext}
          disabled={!reponseActuelle || generatingFollowUp}
        >
          {generatingFollowUp ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Génération...
            </>
          ) : currentIndex === questionSet.questions.length - 1 ? (
            'Terminer'
          ) : (
            <>
              Suivant
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Informations supplémentaires */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Durée estimée restante
            </span>
            <span className="font-semibold">
              {Math.ceil((questionSet.questions.length - currentIndex - 1) * 5)} min
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

