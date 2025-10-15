'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PhasePreliminaire, 
  EntretienPreliminaire,
  SituationProfessionnelle,
  ModaliteEntretien,
  StatutPhase 
} from '@/types/parcours';

/**
 * Page de la phase préliminaire du bilan de compétences
 * Conforme aux exigences Qualiopi
 */
export default function PhasePreliminairePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<PhasePreliminaire | null>(null);
  const [entretien, setEntretien] = useState<Partial<EntretienPreliminaire>>({
    motivations: '',
    attentes: '',
    contexte: '',
    objectifs: [],
    contraintes: [],
    notes: '',
  });

  useEffect(() => {
    // Charger les données de la phase préliminaire
    loadPhaseData();
  }, []);

  const loadPhaseData = async () => {
    try {
      // TODO: Appel API pour récupérer les données
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // TODO: Appel API pour sauvegarder
      console.log('Sauvegarde:', entretien);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleValidate = async () => {
    try {
      // TODO: Appel API pour valider la phase
      router.push('/parcours/investigation');
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
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
          Phase Préliminaire
        </h1>
        <p className="text-gray-600">
          Analysons ensemble votre demande et définissons les modalités de votre bilan de compétences
        </p>
      </div>

      {/* Progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progression</span>
          <span className="text-sm font-medium text-gray-700">25%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: '25%' }}
          ></div>
        </div>
      </div>

      {/* Informations importantes */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Objectif de cette phase :</strong> Analyser votre demande, vous informer sur les conditions de déroulement du bilan, et définir conjointement les modalités de réalisation.
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="space-y-8">
        {/* Section 1 : Motivations */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Vos Motivations
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qu'est-ce qui vous amène à réaliser un bilan de compétences ?
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                value={entretien.motivations}
                onChange={(e) => setEntretien({ ...entretien, motivations: e.target.value })}
                placeholder="Décrivez ce qui vous motive à entreprendre cette démarche..."
              />
            </div>
          </div>
        </section>

        {/* Section 2 : Attentes */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Vos Attentes
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qu'attendez-vous de ce bilan de compétences ?
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                value={entretien.attentes}
                onChange={(e) => setEntretien({ ...entretien, attentes: e.target.value })}
                placeholder="Quels sont vos objectifs et vos attentes..."
              />
            </div>
          </div>
        </section>

        {/* Section 3 : Contexte */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Votre Contexte
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Décrivez votre situation actuelle
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                value={entretien.contexte}
                onChange={(e) => setEntretien({ ...entretien, contexte: e.target.value })}
                placeholder="Votre situation professionnelle, personnelle, vos contraintes..."
              />
            </div>
          </div>
        </section>

        {/* Section 4 : Objectifs */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Vos Objectifs
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Listez les objectifs que vous souhaitez atteindre grâce à ce bilan
            </p>
            {entretien.objectifs?.map((objectif, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={objectif}
                  onChange={(e) => {
                    const newObjectifs = [...(entretien.objectifs || [])];
                    newObjectifs[index] = e.target.value;
                    setEntretien({ ...entretien, objectifs: newObjectifs });
                  }}
                  placeholder={`Objectif ${index + 1}`}
                />
                <button
                  onClick={() => {
                    const newObjectifs = entretien.objectifs?.filter((_, i) => i !== index);
                    setEntretien({ ...entretien, objectifs: newObjectifs });
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
                  objectifs: [...(entretien.objectifs || []), ''] 
                });
              }}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Ajouter un objectif</span>
            </button>
          </div>
        </section>

        {/* Section 5 : Contraintes */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Vos Contraintes
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Quelles sont vos contraintes (disponibilité, mobilité, etc.) ?
            </p>
            {entretien.contraintes?.map((contrainte, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={contrainte}
                  onChange={(e) => {
                    const newContraintes = [...(entretien.contraintes || [])];
                    newContraintes[index] = e.target.value;
                    setEntretien({ ...entretien, contraintes: newContraintes });
                  }}
                  placeholder={`Contrainte ${index + 1}`}
                />
                <button
                  onClick={() => {
                    const newContraintes = entretien.contraintes?.filter((_, i) => i !== index);
                    setEntretien({ ...entretien, contraintes: newContraintes });
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
                  contraintes: [...(entretien.contraintes || []), ''] 
                });
              }}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Ajouter une contrainte</span>
            </button>
          </div>
        </section>

        {/* Section 6 : Notes */}
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
              placeholder="Toute information complémentaire que vous souhaitez partager..."
            />
          </div>
        </section>
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => router.push('/beneficiaire-dashboard')}
          className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
        >
          Retour au tableau de bord
        </button>
        <div className="flex space-x-4">
          <button
            onClick={handleSave}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
          >
            Enregistrer le brouillon
          </button>
          <button
            onClick={handleValidate}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Valider et continuer
          </button>
        </div>
      </div>

      {/* Informations de contact */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Besoin d'aide ?</strong> Votre consultant est disponible pour vous accompagner dans cette étape.
          Contactez-le à tout moment via la messagerie ou prenez rendez-vous pour un entretien.
        </p>
      </div>
    </div>
  );
}

