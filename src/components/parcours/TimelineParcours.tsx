'use client';

import { useState } from 'react';
import { PhaseBilan, EvenementParcours, StatutPhase } from '@/types/parcours';

interface TimelineParcoursProps {
  bilanId: string;
  phaseActuelle: PhaseBilan;
  evenements?: EvenementParcours[];
}

/**
 * Composant Timeline interactive du parcours de bilan
 * Visualisation chronologique de toutes les étapes
 */
export default function TimelineParcours({ 
  bilanId, 
  phaseActuelle,
  evenements = [] 
}: TimelineParcoursProps) {
  const [selectedPhase, setSelectedPhase] = useState<PhaseBilan | null>(null);

  // Définition des phases
  const phases = [
    {
      id: PhaseBilan.PRELIMINAIRE,
      titre: 'Phase Préliminaire',
      description: 'Analyse de la demande et définition des modalités',
      duree: '2-3h',
      icone: '📋',
      couleur: 'blue',
    },
    {
      id: PhaseBilan.INVESTIGATION,
      titre: 'Phase d\'Investigation',
      description: 'Tests, analyses et exploration professionnelle',
      duree: '15-18h',
      icone: '🔍',
      couleur: 'purple',
    },
    {
      id: PhaseBilan.CONCLUSION,
      titre: 'Phase de Conclusion',
      description: 'Synthèse, projet professionnel et plan d\'action',
      duree: '4-6h',
      icone: '🎯',
      couleur: 'green',
    },
    {
      id: PhaseBilan.SUIVI,
      titre: 'Suivi Post-Bilan',
      description: 'Entretien et enquête à 6 mois',
      duree: '1-2h',
      icone: '📊',
      couleur: 'orange',
    },
  ];

  const getPhaseStatus = (phase: PhaseBilan): StatutPhase => {
    const phaseIndex = phases.findIndex(p => p.id === phase);
    const currentIndex = phases.findIndex(p => p.id === phaseActuelle);

    if (phaseIndex < currentIndex) return StatutPhase.VALIDE;
    if (phaseIndex === currentIndex) return StatutPhase.EN_COURS;
    return StatutPhase.NON_COMMENCE;
  };

  const getStatusColor = (status: StatutPhase) => {
    switch (status) {
      case StatutPhase.VALIDE:
        return 'bg-green-500';
      case StatutPhase.EN_COURS:
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getPhaseColor = (couleur: string, status: StatutPhase) => {
    if (status === StatutPhase.NON_COMMENCE) {
      return 'bg-gray-100 text-gray-400 border-gray-300';
    }
    
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-50 text-blue-700 border-blue-300',
      purple: 'bg-purple-50 text-purple-700 border-purple-300',
      green: 'bg-green-50 text-green-700 border-green-300',
      orange: 'bg-orange-50 text-orange-700 border-orange-300',
    };
    
    return colors[couleur] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="space-y-8">
      {/* Timeline horizontale */}
      <div className="relative">
        {/* Ligne de progression */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ 
              width: `${(phases.findIndex(p => p.id === phaseActuelle) / (phases.length - 1)) * 100}%` 
            }}
          ></div>
        </div>

        {/* Phases */}
        <div className="relative grid grid-cols-4 gap-4">
          {phases.map((phase, index) => {
            const status = getPhaseStatus(phase.id);
            
            return (
              <div key={phase.id} className="flex flex-col items-center">
                {/* Icône de phase */}
                <button
                  onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center text-2xl
                    border-4 border-white shadow-lg transition-all duration-300
                    ${getStatusColor(status)}
                    ${status === StatutPhase.EN_COURS ? 'ring-4 ring-blue-200 animate-pulse' : ''}
                    hover:scale-110 cursor-pointer
                  `}
                >
                  {phase.icone}
                </button>

                {/* Numéro de phase */}
                <div className="mt-2 text-sm font-semibold text-gray-600">
                  Phase {index + 1}
                </div>

                {/* Titre */}
                <div className="mt-1 text-center">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {phase.titre}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {phase.duree}
                  </p>
                </div>

                {/* Badge de statut */}
                <div className="mt-2">
                  {status === StatutPhase.VALIDE && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Validé
                    </span>
                  )}
                  {status === StatutPhase.EN_COURS && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <svg className="w-3 h-3 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      En cours
                    </span>
                  )}
                  {status === StatutPhase.NON_COMMENCE && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      À venir
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Détails de la phase sélectionnée */}
      {selectedPhase && (
        <div className="bg-white rounded-lg shadow-lg border-2 border-blue-200 p-6 animate-fadeIn">
          {(() => {
            const phase = phases.find(p => p.id === selectedPhase)!;
            const status = getPhaseStatus(selectedPhase);
            
            return (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{phase.icone}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {phase.titre}
                      </h3>
                      <p className="text-gray-600">{phase.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPhase(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Contenu spécifique à la phase */}
                <div className="mt-6 space-y-4">
                  {selectedPhase === PhaseBilan.PRELIMINAIRE && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Objectifs de cette phase :</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Analyser votre demande et vos motivations
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Vous informer sur les conditions de déroulement
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Définir conjointement les modalités de réalisation
                        </li>
                      </ul>
                    </div>
                  )}

                  {selectedPhase === PhaseBilan.INVESTIGATION && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Activités prévues :</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Tests psychométriques (MBTI, DISC, Big Five, RIASEC)
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Analyse approfondie de vos compétences
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Exploration de pistes professionnelles
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Entretiens d'investigation réguliers
                        </li>
                      </ul>
                    </div>
                  )}

                  {selectedPhase === PhaseBilan.CONCLUSION && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Livrables de cette phase :</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Synthèse complète du bilan (document PDF)
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Projet professionnel formalisé
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Plan d'action détaillé et personnalisé
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Entretien de restitution avec votre consultant
                        </li>
                      </ul>
                    </div>
                  )}

                  {selectedPhase === PhaseBilan.SUIVI && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Suivi à 6 mois :</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-orange-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Entretien de suivi pour faire le point
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-orange-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Évaluation de la mise en œuvre du projet
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-orange-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Enquête de satisfaction à froid
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-orange-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Accompagnement complémentaire si besoin
                        </li>
                      </ul>
                    </div>
                  )}

                  {/* Bouton d'action */}
                  {status === StatutPhase.EN_COURS && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <a
                        href={`/parcours/${selectedPhase.toLowerCase()}`}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                      >
                        Accéder à cette phase
                        <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Événements récents */}
      {evenements.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Événements Récents
          </h3>
          <div className="space-y-4">
            {evenements.slice(0, 5).map((evenement) => (
              <div key={evenement.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg">{evenement.icone || '📅'}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {evenement.titre}
                  </p>
                  <p className="text-sm text-gray-500">
                    {evenement.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(evenement.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

