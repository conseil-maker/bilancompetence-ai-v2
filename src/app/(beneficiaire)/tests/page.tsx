'use client'

import { CheckCircle, Clock, Play, FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function TestsPage() {
  const tests = [
    {
      id: 1,
      nom: 'Test MBTI',
      description: 'Myers-Briggs Type Indicator - Évaluation de votre personnalité',
      duree: '20 min',
      statut: 'termine',
      dateCompletion: '12 Oct 2025',
      resultat: {
        type: 'INTJ',
        description: 'Architecte stratégique, analytique et indépendant',
      },
    },
    {
      id: 2,
      nom: 'Test RIASEC',
      description: 'Test d\'intérêts professionnels de Holland',
      duree: '15 min',
      statut: 'termine',
      dateCompletion: '12 Oct 2025',
      resultat: {
        codes: ['I', 'A', 'S'],
        description: 'Profil IAS - Intérêts pour les activités investigatrices, artistiques et sociales',
      },
    },
    {
      id: 3,
      nom: 'Évaluation des Compétences',
      description: 'Auto-évaluation de vos compétences professionnelles',
      duree: '30 min',
      statut: 'en_cours',
      progression: 60,
    },
    {
      id: 4,
      nom: 'Test des Valeurs Professionnelles',
      description: 'Identification de vos valeurs et motivations au travail',
      duree: '15 min',
      statut: 'disponible',
    },
    {
      id: 5,
      nom: 'Questionnaire de Motivation',
      description: 'Analyse de vos sources de motivation professionnelle',
      duree: '20 min',
      statut: 'disponible',
    },
  ]

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'termine':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
            <CheckCircle className="h-3 w-3" />
            Terminé
          </span>
        )
      case 'en_cours':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
            <Clock className="h-3 w-3" />
            En cours
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
            <Play className="h-3 w-3" />
            Disponible
          </span>
        )
    }
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tests & Évaluations</h1>
        <p className="mt-2 text-gray-600">
          Complétez vos tests pour mieux vous connaître et affiner votre projet professionnel
        </p>
      </div>

      {/* Progression globale */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Progression Globale</h2>
            <p className="text-sm text-gray-600 mt-1">3 tests sur 5 complétés</p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">60%</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-primary h-3 rounded-full transition-all" style={{ width: '60%' }} />
        </div>
      </div>

      {/* Liste des tests */}
      <div className="space-y-4">
        {tests.map((test) => (
          <div
            key={test.id}
            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{test.nom}</h3>
                    {getStatutBadge(test.statut)}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {test.duree}
                    </span>
                    {test.dateCompletion && (
                      <span>Complété le {test.dateCompletion}</span>
                    )}
                  </div>

                  {/* Progression pour tests en cours */}
                  {test.statut === 'en_cours' && test.progression && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progression</span>
                        <span className="text-sm font-medium text-gray-900">{test.progression}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all" 
                          style={{ width: `${test.progression}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Résultats pour tests terminés */}
                  {test.statut === 'termine' && test.resultat && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-900">
                            {test.resultat.type || test.resultat.codes?.join('-')}
                          </p>
                          <p className="text-sm text-green-700 mt-1">
                            {test.resultat.description}
                          </p>
                          <Link
                            href="#"
                            className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-green-900 hover:text-green-800"
                          >
                            <FileText className="h-4 w-4" />
                            Voir le rapport détaillé
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="ml-6 flex-shrink-0">
                  {test.statut === 'disponible' && (
                    <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                      <Play className="h-4 w-4" />
                      Commencer
                    </button>
                  )}
                  {test.statut === 'en_cours' && (
                    <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                      Continuer
                    </button>
                  )}
                  {test.statut === 'termine' && (
                    <button className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                      <FileText className="h-4 w-4" />
                      Résultats
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          Pourquoi ces tests sont importants ?
        </h3>
        <p className="text-sm text-blue-700">
          Les tests psychométriques nous permettent de mieux comprendre votre personnalité,
          vos intérêts et vos compétences. Ces informations sont essentielles pour identifier
          les métiers et les environnements professionnels qui vous correspondent le mieux.
          Prenez le temps de répondre honnêtement à chaque question pour obtenir des résultats
          pertinents.
        </p>
      </div>
    </div>
  )
}

