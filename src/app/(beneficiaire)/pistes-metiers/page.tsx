'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuthContext as useAuth } from '@/components/providers/AuthProvider';
import { pistesMetiersModule } from '@/lib/supabase/modules';

// Définition des interfaces de données (simulées car la structure exacte n'est pas fournie)
interface PisteMetier {
  id: string;
  titre: string;
  description: string;
  secteur: string;
  niveau_requis: string;
  salaire_moyen: number;
  competences_requises: string[];
  gap_analysis: {
    competences_manquantes: string[];
    formation_suggeree: string;
  };
}

interface BilanData {
  pistes: PisteMetier[];
  suggestions: string[];
}

const PistesMetiersPage: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [data, setData] = useState<BilanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPiste, setSelectedPiste] = useState<PisteMetier | null>(null);

  // Simulation de l'ID du bilan, qui devrait être récupéré d'une manière ou d'une autre (e.g., URL, contexte)
  // Pour l'exemple, on utilise un ID fictif ou l'ID de l'utilisateur si disponible.
  const bilanId = user?.id || 'fictif-bilan-id';

  const fetchData = useCallback(async () => {
    if (isAuthLoading || !user) {
      // Attendre l'authentification ou l'utilisateur
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Appel simulé à la fonction de chargement des données
      // En réalité, on appellerait :
      // const result = await pistesMetiersModule.getPistesMetiersByBilan(bilanId);
      
      // Simulation des données pour le développement de l'interface
      const mockData: BilanData = {
        suggestions: [
          'Développeur Web Full Stack',
          'Chef de Projet Digital',
          'Consultant en Transformation Numérique',
        ],
        pistes: [
          {
            id: 'p1',
            titre: 'Développeur Web Full Stack',
            description: 'Conception et développement d\'applications web complètes.',
            secteur: 'Informatique',
            niveau_requis: 'Bac+5',
            salaire_moyen: 45000,
            competences_requises: ['React', 'Node.js', 'SQL', 'Cloud'],
            gap_analysis: {
              competences_manquantes: ['Node.js', 'DevOps'],
              formation_suggeree: 'Bootcamp Node.js et CI/CD',
            },
          },
          {
            id: 'p2',
            titre: 'Chef de Projet Digital',
            description: 'Pilotage de projets digitaux, gestion d\'équipe et budget.',
            secteur: 'Marketing/IT',
            niveau_requis: 'Bac+5',
            salaire_moyen: 55000,
            competences_requises: ['Agile', 'Scrum', 'Gestion de budget', 'Communication'],
            gap_analysis: {
              competences_manquantes: ['Certif. Scrum Master'],
              formation_suggeree: 'Certification PSM I',
            },
          },
          {
            id: 'p3',
            titre: 'Consultant en Transformation Numérique',
            description: 'Accompagnement des entreprises dans leur transition digitale.',
            secteur: 'Conseil',
            niveau_requis: 'Bac+5',
            salaire_moyen: 60000,
            competences_requises: ['Stratégie', 'Analyse', 'Conduite du changement', 'Secteur Bancaire'],
            gap_analysis: {
              competences_manquantes: ['Connaissance du Secteur Bancaire'],
              formation_suggeree: 'MOOC Finance et Banque',
            },
          },
        ],
      };

      setData(mockData);
      // setData(result); // Utiliser ceci en production
    } catch (err) {
      console.error('Erreur lors du chargement des pistes métiers:', err);
      setError('Impossible de charger les pistes métiers. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthLoading, bilanId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Affichage des états ---

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">
          Chargement des données...
          {/* Simple spinner HTML/Tailwind */}
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur de Chargement</h1>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-50">
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">Accès Refusé</h1>
          <p className="text-gray-700">Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (!data || data.pistes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Aucune Piste Métier Trouvée</h1>
          <p className="text-gray-700">Votre bilan de compétences n'a pas encore généré de pistes métiers.</p>
        </div>
      </div>
    );
  }

  // --- Composant principal ---

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 border-b-4 border-blue-500 pb-2">
          Exploration des Pistes Métiers
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Découvrez les métiers suggérés par votre bilan de compétences et analysez les écarts de compétences.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne 1: Liste des Pistes Métiers */}
        <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-lg h-fit sticky top-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Pistes Suggérées</h2>
          <div className="space-y-3">
            {data.pistes.map((piste) => (
              <button
                key={piste.id}
                onClick={() => setSelectedPiste(piste)}
                className={`w-full text-left p-3 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  selectedPiste?.id === piste.id
                    ? 'bg-blue-600 text-white shadow-md font-semibold'
                    : 'bg-gray-50 hover:bg-blue-100 text-gray-800'
                }`}
              >
                <span className="block text-lg">{piste.titre}</span>
                <span className="block text-sm opacity-80">{piste.secteur}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Autres Suggestions</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 pl-4">
              {data.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm">{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Colonne 2 & 3: Détails et Gap Analysis */}
        <div className="lg:col-span-2">
          {selectedPiste ? (
            <div className="space-y-8">
              {/* Détails de la Piste Métier */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-blue-700 mb-4">{selectedPiste.titre}</h2>
                <p className="text-gray-700 mb-4">{selectedPiste.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <span className="font-semibold text-blue-800 block">Secteur:</span>
                    <span className="text-gray-700">{selectedPiste.secteur}</span>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <span className="font-semibold text-blue-800 block">Niveau Requis:</span>
                    <span className="text-gray-700">{selectedPiste.niveau_requis}</span>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <span className="font-semibold text-blue-800 block">Salaire Moyen Estimé:</span>
                    <span className="text-gray-700">{selectedPiste.salaire_moyen.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}/an</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Compétences Requises</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPiste.competences_requises.map((comp, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-full">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gap Analysis */}
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
                <h2 className="text-3xl font-bold text-red-700 mb-4">Analyse des Écarts (Gap Analysis)</h2>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Compétences Manquantes</h3>
                  {selectedPiste.gap_analysis.competences_manquantes.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
                      {selectedPiste.gap_analysis.competences_manquantes.map((comp, index) => (
                        <li key={index} className="text-base font-medium text-red-600">{comp}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-green-600 font-semibold">Aucun écart majeur détecté. Bravo !</p>
                  )}
                </div>

                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Formation Suggérée</h3>
                  <p className="text-gray-700 font-medium">{selectedPiste.gap_analysis.formation_suggeree}</p>
                  <button className="mt-3 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200 text-sm">
                    Explorer les Formations
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-xl shadow-lg text-center border-2 border-dashed border-gray-300">
              <p className="text-xl text-gray-500 font-medium">
                Sélectionnez une piste métier dans la liste de gauche pour afficher les détails et l'analyse des écarts.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer pour le responsive */}
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>BilanCompetence.AI v2 - Exploration des Pistes Métiers</p>
      </footer>
    </div>
  );
};

export default PistesMetiersPage;
