'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PhaseInvestigation,
  TestPsychometrique,
  TypeTest,
  StatutTest,
  PisteProfessionnelle 
} from '@/types/parcours';

/**
 * Page de la phase d'investigation du bilan de compétences
 * Tests, analyses et exploration professionnelle
 */
export default function PhaseInvestigationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tests' | 'competences' | 'pistes'>('tests');
  const [tests, setTests] = useState<TestPsychometrique[]>([]);
  const [pistes, setPistes] = useState<PisteProfessionnelle[]>([]);

  useEffect(() => {
    loadInvestigationData();
  }, []);

  const loadInvestigationData = async () => {
    try {
      // TODO: Appel API
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const startTest = async (typeTest: TypeTest) => {
    try {
      // TODO: Lancer le test
      router.push(`/parcours/investigation/test/${typeTest.toLowerCase()}`);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Phase d'Investigation
        </h1>
        <p className="text-gray-600">
          Analysons vos compétences, aptitudes et motivations pour identifier vos possibilités d'évolution
        </p>
      </div>

      {/* Progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progression</span>
          <span className="text-sm font-medium text-gray-700">50%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: '50%' }}
          ></div>
        </div>
      </div>

      {/* Onglets */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('tests')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'tests'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Tests Psychométriques
            </button>
            <button
              onClick={() => setActiveTab('competences')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'competences'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Évaluation des Compétences
            </button>
            <button
              onClick={() => setActiveTab('pistes')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'pistes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Pistes Professionnelles
            </button>
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'tests' && (
        <div className="space-y-6">
          {/* Tests disponibles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MBTI */}
            <TestCard
              title="MBTI"
              description="Identifiez votre type de personnalité parmi 16 profils"
              duration="15-20 min"
              status="NON_COMMENCE"
              onStart={() => startTest(TypeTest.MBTI)}
            />

            {/* DISC */}
            <TestCard
              title="DISC"
              description="Analysez votre style comportemental (Dominance, Influence, Stabilité, Conformité)"
              duration="10-15 min"
              status="NON_COMMENCE"
              onStart={() => startTest(TypeTest.DISC)}
            />

            {/* Big Five */}
            <TestCard
              title="Big Five"
              description="Évaluez vos 5 grands traits de personnalité"
              duration="20-25 min"
              status="NON_COMMENCE"
              onStart={() => startTest(TypeTest.BIG_FIVE)}
            />

            {/* RIASEC */}
            <TestCard
              title="RIASEC (Holland)"
              description="Découvrez vos intérêts professionnels dominants"
              duration="15-20 min"
              status="NON_COMMENCE"
              onStart={() => startTest(TypeTest.RIASEC)}
            />

            {/* Motivations */}
            <TestCard
              title="Test de Motivations"
              description="Identifiez vos principaux leviers de motivation"
              duration="10-15 min"
              status="NON_COMMENCE"
              onStart={() => startTest(TypeTest.MOTIVATIONS)}
            />

            {/* Valeurs */}
            <TestCard
              title="Test de Valeurs"
              description="Clarifiez vos valeurs professionnelles et personnelles"
              duration="10-15 min"
              status="NON_COMMENCE"
              onStart={() => startTest(TypeTest.VALEURS)}
            />
          </div>

          {/* Informations */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Conseil :</strong> Répondez spontanément aux questions, sans trop réfléchir. Il n'y a pas de bonnes ou de mauvaises réponses. Ces tests vous aideront à mieux vous connaître et à identifier les métiers qui vous correspondent.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'competences' && (
        <div className="space-y-6">
          {/* Auto-évaluation */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Auto-évaluation de vos Compétences
            </h2>
            <p className="text-gray-600 mb-6">
              Évaluez vos compétences sur une échelle de 1 à 5. Votre consultant vous aidera à affiner cette évaluation lors des entretiens.
            </p>
            
            <div className="space-y-4">
              {/* Compétences techniques */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Compétences Techniques</h3>
                <button className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors">
                  + Ajouter une compétence technique
                </button>
              </div>

              {/* Compétences transversales */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Compétences Transversales</h3>
                <button className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors">
                  + Ajouter une compétence transversale
                </button>
              </div>

              {/* Soft skills */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Soft Skills</h3>
                <button className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors">
                  + Ajouter un soft skill
                </button>
              </div>
            </div>
          </section>

          {/* Analyse IA */}
          <section className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Analyse IA de vos Compétences
                </h3>
                <p className="text-gray-600 mb-4">
                  Notre intelligence artificielle peut analyser votre CV et vos expériences pour identifier automatiquement vos compétences et suggérer des compétences transférables.
                </p>
                <button className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium">
                  Lancer l'analyse IA
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'pistes' && (
        <div className="space-y-6">
          {/* Pistes identifiées */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pistes Professionnelles Identifiées
            </h2>
            
            {pistes.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune piste identifiée</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Commencez par compléter les tests et l'évaluation de compétences. Votre consultant vous aidera ensuite à identifier des pistes professionnelles adaptées.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Liste des pistes */}
              </div>
            )}
          </section>

          {/* Exploration métiers */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Explorer des Métiers
            </h2>
            <p className="text-gray-600 mb-6">
              Recherchez des métiers qui vous intéressent et explorez leurs caractéristiques, compétences requises et perspectives.
            </p>
            
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Rechercher un métier (ex: Développeur web, Chef de projet...)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                Rechercher
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => router.push('/parcours/preliminaire')}
          className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
        >
          ← Phase précédente
        </button>
        <button
          onClick={() => router.push('/parcours/conclusion')}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          Phase suivante →
        </button>
      </div>
    </div>
  );
}

/**
 * Composant carte de test
 */
interface TestCardProps {
  title: string;
  description: string;
  duration: string;
  status: string;
  onStart: () => void;
}

function TestCard({ title, description, duration, status, onStart }: TestCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'TERMINE':
        return 'bg-green-100 text-green-800';
      case 'EN_COURS':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'TERMINE':
        return 'Terminé';
      case 'EN_COURS':
        return 'En cours';
      default:
        return 'Non commencé';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          {duration}
        </div>
        
        <button
          onClick={onStart}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 font-medium"
        >
          {status === 'TERMINE' ? 'Voir les résultats' : status === 'EN_COURS' ? 'Continuer' : 'Commencer'}
        </button>
      </div>
    </div>
  );
}

