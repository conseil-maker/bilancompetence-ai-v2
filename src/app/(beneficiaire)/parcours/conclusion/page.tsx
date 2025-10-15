'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PhaseConclusion,
  ProjetProfessionnel,
  PlanAction,
  ActionPlanAction 
} from '@/types/parcours';

/**
 * Page de la phase de conclusion du bilan de compétences
 * Synthèse, projet professionnel et plan d'action
 */
export default function PhaseConclusionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'synthese' | 'projet' | 'plan'>('synthese');
  const [projet, setProjet] = useState<Partial<ProjetProfessionnel>>({
    titre: '',
    description: '',
    objectifPrincipal: '',
    objectifsSecondaires: [],
  });
  const [actions, setActions] = useState<Partial<ActionPlanAction>[]>([]);

  useEffect(() => {
    loadConclusionData();
  }, []);

  const loadConclusionData = async () => {
    try {
      // TODO: Appel API
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const handleGenerateSynthese = async () => {
    try {
      // TODO: Générer la synthèse via IA
      console.log('Génération de la synthèse...');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSaveProjet = async () => {
    try {
      // TODO: Sauvegarder le projet
      console.log('Sauvegarde du projet:', projet);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAddAction = () => {
    setActions([...actions, {
      titre: '',
      description: '',
      categorie: 'FORMATION',
      etapes: [],
    }]);
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
          Phase de Conclusion
        </h1>
        <p className="text-gray-600">
          Élaborons votre projet professionnel et définissons les étapes concrètes de sa mise en œuvre
        </p>
      </div>

      {/* Progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progression</span>
          <span className="text-sm font-medium text-gray-700">75%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: '75%' }}
          ></div>
        </div>
      </div>

      {/* Onglets */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('synthese')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'synthese'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Synthèse du Bilan
            </button>
            <button
              onClick={() => setActiveTab('projet')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'projet'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Projet Professionnel
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'plan'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Plan d'Action
            </button>
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'synthese' && (
        <div className="space-y-6">
          {/* Génération automatique */}
          <section className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Génération Automatique de la Synthèse
                </h3>
                <p className="text-gray-600 mb-4">
                  Notre IA peut générer automatiquement une synthèse complète de votre bilan en analysant toutes les données collectées : tests, entretiens, compétences identifiées et pistes explorées.
                </p>
                <button 
                  onClick={handleGenerateSynthese}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium"
                >
                  Générer la synthèse
                </button>
              </div>
            </div>
          </section>

          {/* Aperçu de la synthèse */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Votre Synthèse de Bilan
            </h2>

            <div className="space-y-6">
              {/* Parcours réalisé */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Parcours Réalisé</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">24h</div>
                      <div className="text-sm text-gray-600">Durée totale</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">8</div>
                      <div className="text-sm text-gray-600">Entretiens</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">6</div>
                      <div className="text-sm text-gray-600">Tests réalisés</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compétences clés */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Vos Compétences Clés</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Gestion de projet
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Communication
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Leadership
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Analyse de données
                  </span>
                </div>
              </div>

              {/* Points forts */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Points Forts</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Capacité d'adaptation et d'apprentissage rapide</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Excellentes compétences relationnelles</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Sens de l'organisation et rigueur</span>
                  </li>
                </ul>
              </div>

              {/* Motivations */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Motivations Principales</h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <ul className="space-y-1 text-gray-700">
                    <li>• Développer de nouvelles compétences</li>
                    <li>• Avoir plus d'autonomie</li>
                    <li>• Contribuer à des projets à impact</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Téléchargement */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Télécharger la synthèse complète (PDF)
              </button>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'projet' && (
        <div className="space-y-6">
          {/* Formulaire projet */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Définissez Votre Projet Professionnel
            </h2>

            <div className="space-y-6">
              {/* Type de projet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de projet
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Sélectionnez un type</option>
                  <option value="EVOLUTION">Évolution dans mon entreprise</option>
                  <option value="RECONVERSION">Reconversion professionnelle</option>
                  <option value="CREATION_ENTREPRISE">Création d'entreprise</option>
                  <option value="FORMATION">Formation qualifiante</option>
                </select>
              </div>

              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du projet
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Devenir Chef de Projet Digital"
                  value={projet.titre}
                  onChange={(e) => setProjet({ ...projet, titre: e.target.value })}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description du projet
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Décrivez votre projet professionnel..."
                  value={projet.description}
                  onChange={(e) => setProjet({ ...projet, description: e.target.value })}
                />
              </div>

              {/* Objectif principal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objectif principal
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Quel est votre objectif principal ?"
                  value={projet.objectifPrincipal}
                  onChange={(e) => setProjet({ ...projet, objectifPrincipal: e.target.value })}
                />
              </div>

              {/* Échéance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Échéance
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="COURT_TERME">Court terme (0-6 mois)</option>
                  <option value="MOYEN_TERME">Moyen terme (6-18 mois)</option>
                  <option value="LONG_TERME">Long terme (18+ mois)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSaveProjet}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Enregistrer le projet
              </button>
            </div>
          </section>

          {/* Validation */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Validation du Projet
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                <label className="ml-2 text-gray-700">
                  Le projet est pertinent par rapport à mes compétences et motivations
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                <label className="ml-2 text-gray-700">
                  Le projet est réalisable compte tenu de ma situation
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                <label className="ml-2 text-gray-700">
                  Je suis motivé(e) pour mettre en œuvre ce projet
                </label>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'plan' && (
        <div className="space-y-6">
          {/* Liste des actions */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Votre Plan d'Action
              </h2>
              <button
                onClick={handleAddAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Ajouter une action
              </button>
            </div>

            {actions.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune action définie</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Commencez par ajouter des actions concrètes pour mettre en œuvre votre projet professionnel.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {actions.map((action, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <input
                          type="text"
                          className="w-full font-medium text-gray-900 border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-0"
                          placeholder="Titre de l'action"
                          value={action.titre}
                          onChange={(e) => {
                            const newActions = [...actions];
                            newActions[index].titre = e.target.value;
                            setActions(newActions);
                          }}
                        />
                        <textarea
                          className="w-full mt-2 text-sm text-gray-600 border-0 focus:ring-0"
                          rows={2}
                          placeholder="Description de l'action..."
                          value={action.description}
                          onChange={(e) => {
                            const newActions = [...actions];
                            newActions[index].description = e.target.value;
                            setActions(newActions);
                          }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newActions = actions.filter((_, i) => i !== index);
                          setActions(newActions);
                        }}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Téléchargement */}
          {actions.length > 0 && (
            <div className="flex justify-end">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Télécharger le plan d'action (PDF)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => router.push('/parcours/investigation')}
          className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
        >
          ← Phase précédente
        </button>
        <button
          onClick={() => router.push('/beneficiaire-dashboard')}
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
        >
          Terminer le bilan
        </button>
      </div>
    </div>
  );
}

