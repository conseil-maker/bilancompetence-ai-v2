'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PhaseSuivi,
  EntretienSuivi,
  EnqueteFroid 
} from '@/types/parcours';

/**
 * Page du suivi post-bilan (6 mois après)
 * Conforme aux exigences Qualiopi
 */
export default function PhaseSuiviPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'entretien' | 'enquete'>('entretien');
  const [entretien, setEntretien] = useState<Partial<EntretienSuivi>>({
    situationActuelle: '',
    projetMisEnOeuvre: false,
    etapeRealisees: [],
    difficultes: [],
    changementsSituation: '',
    nouvellesOpportunites: [],
    besoinAccompagnement: false,
    notes: '',
  });
  const [enquete, setEnquete] = useState<Partial<EnqueteFroid>>({
    situationActuelle: 'EMPLOI',
    detailsSituation: '',
    projetRealise: false,
    tauxRealisation: 0,
    recommanderaitService: false,
    commentaires: '',
  });

  useEffect(() => {
    loadSuiviData();
  }, []);

  const loadSuiviData = async () => {
    try {
      // TODO: Appel API
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const handleSaveEntretien = async () => {
    try {
      // TODO: Sauvegarder l'entretien
      console.log('Sauvegarde entretien:', entretien);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmitEnquete = async () => {
    try {
      // TODO: Soumettre l'enquête
      console.log('Soumission enquête:', enquete);
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Suivi Post-Bilan (6 mois)
        </h1>
        <p className="text-gray-600">
          Faisons le point sur la mise en œuvre de votre projet professionnel
        </p>
      </div>

      {/* Progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progression</span>
          <span className="text-sm font-medium text-gray-700">100%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: '100%' }}
          ></div>
        </div>
      </div>

      {/* Rappel du projet */}
      <div className="mb-8 bg-blue-50 border-l-4 border-blue-600 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Rappel de votre projet professionnel
        </h3>
        <p className="text-blue-800">
          <strong>Projet :</strong> Devenir Chef de Projet Digital
        </p>
        <p className="text-blue-800 text-sm mt-1">
          <strong>Objectif :</strong> Évoluer vers un poste de chef de projet dans le secteur du digital
        </p>
      </div>

      {/* Onglets */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('entretien')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'entretien'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Entretien de Suivi
            </button>
            <button
              onClick={() => setActiveTab('enquete')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'enquete'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Enquête à Froid
            </button>
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'entretien' && (
        <div className="space-y-6">
          {/* Situation actuelle */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              1. Votre Situation Actuelle
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Décrivez votre situation professionnelle actuelle
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                value={entretien.situationActuelle}
                onChange={(e) => setEntretien({ ...entretien, situationActuelle: e.target.value })}
                placeholder="Où en êtes-vous aujourd'hui ? Avez-vous changé de poste, d'entreprise ?"
              />
            </div>
          </section>

          {/* Mise en œuvre du projet */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              2. Mise en Œuvre de Votre Projet
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded"
                    checked={entretien.projetMisEnOeuvre}
                    onChange={(e) => setEntretien({ ...entretien, projetMisEnOeuvre: e.target.checked })}
                  />
                  <span className="ml-2 text-gray-700">
                    J'ai commencé à mettre en œuvre mon projet professionnel
                  </span>
                </label>
              </div>

              {entretien.projetMisEnOeuvre && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quelles étapes avez-vous réalisées ?
                  </label>
                  {entretien.etapeRealisees?.map((etape, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={etape}
                        onChange={(e) => {
                          const newEtapes = [...(entretien.etapeRealisees || [])];
                          newEtapes[index] = e.target.value;
                          setEntretien({ ...entretien, etapeRealisees: newEtapes });
                        }}
                        placeholder={`Étape ${index + 1}`}
                      />
                      <button
                        onClick={() => {
                          const newEtapes = entretien.etapeRealisees?.filter((_, i) => i !== index);
                          setEntretien({ ...entretien, etapeRealisees: newEtapes });
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setEntretien({ 
                        ...entretien, 
                        etapeRealisees: [...(entretien.etapeRealisees || []), ''] 
                      });
                    }}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Ajouter une étape</span>
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Difficultés rencontrées */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              3. Difficultés Rencontrées
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avez-vous rencontré des difficultés dans la mise en œuvre de votre projet ?
              </label>
              {entretien.difficultes?.map((difficulte, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={difficulte}
                    onChange={(e) => {
                      const newDifficultes = [...(entretien.difficultes || [])];
                      newDifficultes[index] = e.target.value;
                      setEntretien({ ...entretien, difficultes: newDifficultes });
                    }}
                    placeholder={`Difficulté ${index + 1}`}
                  />
                  <button
                    onClick={() => {
                      const newDifficultes = entretien.difficultes?.filter((_, i) => i !== index);
                      setEntretien({ ...entretien, difficultes: newDifficultes });
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setEntretien({ 
                    ...entretien, 
                    difficultes: [...(entretien.difficultes || []), ''] 
                  });
                }}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Ajouter une difficulté</span>
              </button>
            </div>
          </section>

          {/* Changements et opportunités */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              4. Évolutions et Opportunités
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Y a-t-il eu des changements dans votre situation depuis le bilan ?
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  value={entretien.changementsSituation}
                  onChange={(e) => setEntretien({ ...entretien, changementsSituation: e.target.value })}
                  placeholder="Changements personnels, professionnels, contextuels..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avez-vous identifié de nouvelles opportunités ?
                </label>
                {entretien.nouvellesOpportunites?.map((opportunite, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={opportunite}
                      onChange={(e) => {
                        const newOpportunites = [...(entretien.nouvellesOpportunites || [])];
                        newOpportunites[index] = e.target.value;
                        setEntretien({ ...entretien, nouvellesOpportunites: newOpportunites });
                      }}
                      placeholder={`Opportunité ${index + 1}`}
                    />
                    <button
                      onClick={() => {
                        const newOpportunites = entretien.nouvellesOpportunites?.filter((_, i) => i !== index);
                        setEntretien({ ...entretien, nouvellesOpportunites: newOpportunites });
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setEntretien({ 
                      ...entretien, 
                      nouvellesOpportunites: [...(entretien.nouvellesOpportunites || []), ''] 
                    });
                  }}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Ajouter une opportunité</span>
                </button>
              </div>
            </div>
          </section>

          {/* Besoin d'accompagnement */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              5. Besoin d'Accompagnement
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded"
                    checked={entretien.besoinAccompagnement}
                    onChange={(e) => setEntretien({ ...entretien, besoinAccompagnement: e.target.checked })}
                  />
                  <span className="ml-2 text-gray-700">
                    Je souhaiterais bénéficier d'un accompagnement complémentaire
                  </span>
                </label>
              </div>

              {entretien.besoinAccompagnement && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quel type d'accompagnement souhaitez-vous ?
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    value={entretien.typeAccompagnement}
                    onChange={(e) => setEntretien({ ...entretien, typeAccompagnement: e.target.value })}
                    placeholder="Coaching, formation, conseil..."
                  />
                </div>
              )}
            </div>
          </section>

          {/* Notes */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              6. Notes Complémentaires
            </h2>
            <div>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                value={entretien.notes}
                onChange={(e) => setEntretien({ ...entretien, notes: e.target.value })}
                placeholder="Toute information complémentaire..."
              />
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveEntretien}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Enregistrer l'entretien
            </button>
          </div>
        </div>
      )}

      {activeTab === 'enquete' && (
        <div className="space-y-6">
          {/* Enquête à froid */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Enquête de Satisfaction à 6 Mois
            </h2>

            <div className="space-y-6">
              {/* Situation actuelle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quelle est votre situation professionnelle actuelle ?
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={enquete.situationActuelle}
                  onChange={(e) => setEnquete({ ...enquete, situationActuelle: e.target.value as any })}
                >
                  <option value="EMPLOI">En emploi</option>
                  <option value="FORMATION">En formation</option>
                  <option value="RECHERCHE">En recherche d'emploi</option>
                  <option value="CREATION_ENTREPRISE">Création d'entreprise</option>
                  <option value="AUTRE">Autre</option>
                </select>
              </div>

              {/* Détails */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Précisez votre situation
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  value={enquete.detailsSituation}
                  onChange={(e) => setEnquete({ ...enquete, detailsSituation: e.target.value })}
                  placeholder="Poste, entreprise, formation suivie..."
                />
              </div>

              {/* Réalisation du projet */}
              <div>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded"
                    checked={enquete.projetRealise}
                    onChange={(e) => setEnquete({ ...enquete, projetRealise: e.target.checked })}
                  />
                  <span className="ml-2 text-gray-700 font-medium">
                    Mon projet professionnel a été réalisé
                  </span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taux de réalisation de votre projet : {enquete.tauxRealisation}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    className="w-full"
                    value={enquete.tauxRealisation}
                    onChange={(e) => setEnquete({ ...enquete, tauxRealisation: parseInt(e.target.value) })}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Impact du bilan */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  Impact du bilan de compétences
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Impact sur votre carrière
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => setEnquete({ ...enquete, impactCarriere: value })}
                          className={`px-4 py-2 rounded-md ${
                            enquete.impactCarriere === value
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Impact sur votre confiance en vous
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => setEnquete({ ...enquete, impactConfiance: value })}
                          className={`px-4 py-2 rounded-md ${
                            enquete.impactConfiance === value
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Clarté de votre projet professionnel
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => setEnquete({ ...enquete, impactClarte: value })}
                          className={`px-4 py-2 rounded-md ${
                            enquete.impactClarte === value
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommandation */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded"
                    checked={enquete.recommanderaitService}
                    onChange={(e) => setEnquete({ ...enquete, recommanderaitService: e.target.checked })}
                  />
                  <span className="ml-2 text-gray-700">
                    Je recommanderais ce service à mon entourage
                  </span>
                </label>
              </div>

              {/* Commentaires */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaires libres
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  value={enquete.commentaires}
                  onChange={(e) => setEnquete({ ...enquete, commentaires: e.target.value })}
                  placeholder="Vos remarques, suggestions, témoignage..."
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmitEnquete}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
            >
              Soumettre l'enquête
            </button>
          </div>
        </div>
      )}

      {/* Retour */}
      <div className="mt-8">
        <button
          onClick={() => router.push('/beneficiaire-dashboard')}
          className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
        >
          Retour au tableau de bord
        </button>
      </div>
    </div>
  );
}

