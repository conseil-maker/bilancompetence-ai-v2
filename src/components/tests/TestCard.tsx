'use client';

import React from 'react';
import { Loader2, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';

// --- Interfaces TypeScript (simulées à partir de @/types/database.types) ---

// Interface pour l'interprétation d'un résultat de test
interface TestInterpretation {
  id: string;
  title: string;
  summary: string;
  details: string; // Peut être du Markdown ou du HTML
  recommendations: string[];
}

// Interface pour un résultat de test spécifique
interface TestResult {
  id: string;
  score: number;
  max_score: number;
  percentile: number; // Pourcentage par rapport à la population de référence
  interpretation_id: string;
  interpretation: TestInterpretation;
}

// Interface pour le test psychométrique lui-même
interface PsychometricTest {
  id: string;
  name: string;
  description: string;
  date_taken: string; // Format ISO 8601
  results: TestResult[];
}

// Interface pour les Props du composant TestCard
interface TestCardProps {
  testData: PsychometricTest | null;
  isLoading: boolean;
  error: string | null;
}

// --- Fonctions utilitaires ---

/**
 * Détermine la couleur Tailwind en fonction du percentile.
 * @param percentile Le percentile du résultat (0-100).
 * @returns Une chaîne de caractères Tailwind pour la couleur.
 */
const getScoreColor = (percentile: number): string => {
  if (percentile >= 80) return 'text-green-600 bg-green-50 border-green-200';
  if (percentile >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  if (percentile >= 20) return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-red-600 bg-red-50 border-red-200';
};

/**
 * Affiche le niveau de performance en fonction du percentile.
 * @param percentile Le percentile du résultat (0-100).
 * @returns Le niveau de performance.
 */
const getPerformanceLevel = (percentile: number): string => {
  if (percentile >= 90) return 'Exceptionnel';
  if (percentile >= 75) return 'Supérieur à la moyenne';
  if (percentile >= 50) return 'Dans la moyenne';
  if (percentile >= 25) return 'Inférieur à la moyenne';
  return 'Nécessite une attention';
};

// --- Composant TestCard ---

const TestCard: React.FC<TestCardProps> = ({ testData, isLoading, error }) => {
  // 1. État de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-white border border-gray-200 rounded-lg shadow-md">
        <Loader2 className="w-6 h-6 mr-2 animate-spin text-blue-500" />
        <p className="text-gray-600">Chargement des résultats du test...</p>
      </div>
    );
  }

  // 2. État d'erreur
  if (error) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md flex items-start">
        <AlertTriangle className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">Erreur de chargement</h3>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2">Veuillez réessayer ou contacter le support.</p>
        </div>
      </div>
    );
  }

  // 3. État de données manquantes
  if (!testData) {
    return (
      <div className="p-6 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg shadow-md flex items-start">
        <Info className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">Aucun résultat de test disponible</h3>
          <p className="text-sm">Les données pour ce test n'ont pas pu être trouvées.</p>
        </div>
      </div>
    );
  }

  // 4. Affichage des données
  const { name, description, date_taken, results } = testData;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden max-w-4xl mx-auto my-8 transition-all duration-300 hover:shadow-3xl">
      {/* En-tête du test */}
      <div className="p-6 bg-blue-600 text-white">
        <h1 className="text-3xl font-extrabold mb-1">{name}</h1>
        <p className="text-blue-200 text-sm italic">{description}</p>
        <p className="text-blue-300 text-xs mt-2">
          Passé le: {new Date(date_taken).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Section des résultats */}
      <div className="p-6 space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Résultats Détaillés</h2>

        {results.length === 0 ? (
          <p className="text-gray-500 italic">Aucun résultat spécifique n'est disponible pour ce test.</p>
        ) : (
          <div className="grid gap-6">
            {results.map((result) => {
              const scoreColor = getScoreColor(result.percentile);
              const performanceLevel = getPerformanceLevel(result.percentile);
              const InterpretationIcon = result.percentile >= 50 ? TrendingUp : TrendingDown;

              return (
                <div key={result.id} className="border border-gray-100 rounded-lg p-5 shadow-lg bg-gray-50 transition-all duration-200 hover:shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-700 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
                      {result.interpretation.title}
                    </h3>
                    <div className={`px-3 py-1 text-sm font-bold rounded-full border ${scoreColor}`}>
                      {performanceLevel}
                    </div>
                  </div>

                  {/* Indicateurs de score */}
                  <div className="grid grid-cols-3 gap-4 text-center border-t border-b py-3 mb-4">
                    <div>
                      <p className="text-2xl font-extrabold text-gray-800">{result.score}</p>
                      <p className="text-xs text-gray-500">Score Obtenu</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-gray-800">{result.max_score}</p>
                      <p className="text-xs text-gray-500">Score Maximum</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-gray-800 flex items-center justify-center">
                        {result.percentile}%
                        <InterpretationIcon className={`w-4 h-4 ml-1 ${result.percentile >= 50 ? 'text-green-500' : 'text-red-500'}`} />
                      </p>
                      <p className="text-xs text-gray-500">Percentile</p>
                    </div>
                  </div>

                  {/* Interprétation */}
                  <div className="mt-4">
                    <h4 className="text-lg font-bold text-gray-700 mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-2 text-blue-500" />
                      Interprétation
                    </h4>
                    <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-600 bg-blue-50 p-3 rounded-r-lg">
                      {result.interpretation.summary}
                    </blockquote>
                    <p className="text-sm text-gray-700 mt-3">{result.interpretation.details}</p>

                    {/* Recommandations */}
                    {result.interpretation.recommendations.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-base font-bold text-gray-700 mb-2">Pistes de Développement</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                          {result.interpretation.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCard;
