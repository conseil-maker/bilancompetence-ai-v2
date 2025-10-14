'use client'

import { CheckCircle, Circle, Clock, Calendar, User, FileText } from 'lucide-react'

export default function ParcoursPage() {
  const phases = [
    {
      id: 1,
      nom: 'Phase Préliminaire',
      statut: 'termine',
      dateDebut: '1 Oct 2025',
      dateFin: '8 Oct 2025',
      description: 'Analyse de votre parcours et définition de vos objectifs',
      seances: [
        {
          id: 1,
          titre: 'Entretien préliminaire',
          date: '1 Oct 2025',
          duree: '2h',
          consultant: 'Marie Dupont',
          statut: 'termine',
          notes: 'Excellent premier contact. Objectifs bien définis.',
        },
        {
          id: 2,
          titre: 'Analyse du parcours professionnel',
          date: '5 Oct 2025',
          duree: '2h',
          consultant: 'Marie Dupont',
          statut: 'termine',
          notes: 'Identification des compétences clés et des aspirations.',
        },
      ],
      documents: [
        { nom: 'Synthèse Phase Préliminaire', url: '#' },
      ],
    },
    {
      id: 2,
      nom: 'Phase d\'Investigation',
      statut: 'en_cours',
      dateDebut: '10 Oct 2025',
      dateFin: '15 Nov 2025',
      description: 'Exploration approfondie de vos compétences et des pistes professionnelles',
      seances: [
        {
          id: 3,
          titre: 'Tests psychométriques',
          date: '12 Oct 2025',
          duree: '3h',
          consultant: 'Marie Dupont',
          statut: 'termine',
          notes: 'Tests MBTI et RIASEC complétés avec succès.',
        },
        {
          id: 4,
          titre: 'Exploration des pistes professionnelles',
          date: '20 Oct 2025',
          duree: '2h',
          consultant: 'Marie Dupont',
          statut: 'termine',
          notes: '3 pistes identifiées : Chef de projet digital, Product Owner, Consultant.',
        },
        {
          id: 5,
          titre: 'Entretien d\'investigation',
          date: '25 Oct 2025',
          duree: '2h',
          consultant: 'Marie Dupont',
          statut: 'planifie',
        },
        {
          id: 6,
          titre: 'Validation du projet professionnel',
          date: '5 Nov 2025',
          duree: '2h',
          consultant: 'Marie Dupont',
          statut: 'planifie',
        },
      ],
      documents: [],
    },
    {
      id: 3,
      nom: 'Phase de Conclusion',
      statut: 'a_venir',
      dateDebut: '20 Nov 2025',
      dateFin: '10 Déc 2025',
      description: 'Élaboration de votre plan d\'action et synthèse finale',
      seances: [
        {
          id: 7,
          titre: 'Élaboration du plan d\'action',
          date: 'À planifier',
          duree: '2h',
          consultant: 'Marie Dupont',
          statut: 'a_venir',
        },
        {
          id: 8,
          titre: 'Restitution finale',
          date: 'À planifier',
          duree: '2h',
          consultant: 'Marie Dupont',
          statut: 'a_venir',
        },
      ],
      documents: [],
    },
  ]

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'termine':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'en_cours':
        return <Clock className="h-5 w-5 text-blue-600" />
      case 'planifie':
        return <Calendar className="h-5 w-5 text-orange-600" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'termine':
        return <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">Terminée</span>
      case 'en_cours':
        return <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">En cours</span>
      case 'planifie':
        return <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">Planifiée</span>
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">À venir</span>
    }
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mon Parcours</h1>
        <p className="mt-2 text-gray-600">
          Suivez votre progression à travers les 3 phases de votre bilan de compétences
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {phases.map((phase, phaseIdx) => (
          <div key={phase.id} className="relative">
            {/* Ligne de connexion */}
            {phaseIdx !== phases.length - 1 && (
              <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200" />
            )}

            {/* Phase Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {/* Phase Header */}
              <div className={`px-6 py-4 ${
                phase.statut === 'termine' ? 'bg-green-50' :
                phase.statut === 'en_cours' ? 'bg-blue-50' :
                'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      phase.statut === 'termine' ? 'bg-green-100' :
                      phase.statut === 'en_cours' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      {getStatutIcon(phase.statut)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{phase.nom}</h2>
                      <p className="text-sm text-gray-600 mt-1">{phase.description}</p>
                    </div>
                  </div>
                  {getStatutBadge(phase.statut)}
                </div>
                <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
                  <span>Début : {phase.dateDebut}</span>
                  <span>•</span>
                  <span>Fin : {phase.dateFin}</span>
                </div>
              </div>

              {/* Séances */}
              <div className="px-6 py-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Séances</h3>
                <div className="space-y-3">
                  {phase.seances.map((seance) => (
                    <div
                      key={seance.id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getStatutIcon(seance.statut)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{seance.titre}</h4>
                            <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {seance.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {seance.duree}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {seance.consultant}
                              </span>
                            </div>
                            {seance.notes && (
                              <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded p-2">
                                {seance.notes}
                              </p>
                            )}
                          </div>
                          {getStatutBadge(seance.statut)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Documents */}
                {phase.documents.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Documents</h3>
                    <div className="space-y-2">
                      {phase.documents.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                          <FileText className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium text-gray-900">{doc.nom}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

