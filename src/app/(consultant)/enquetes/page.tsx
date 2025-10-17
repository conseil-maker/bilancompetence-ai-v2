'use client'

import { useState, useEffect } from 'react';
import { useAuthContext as useAuth } from '@/components/providers/AuthProvider';
import { qualiopi } from '@/lib/supabase/modules';
import { EnqueteSatisfaction } from '@/lib/supabase/modules/qualiopi'; // Supposons ce type pour la structure des données

// Définition du type pour les données de l'enquête (à adapter si le type réel est différent)
interface EnqueteData extends EnqueteSatisfaction {
  // Ajouter d'autres champs si nécessaire pour l'affichage
}

export default function EnquetesSatisfactionPage() {
  const { user } = useAuth();
  const [enquetes, setEnquetes] = useState<EnqueteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchEnquetes = async () => {
        try {
          setIsLoading(true);
          setError(null);
          // L'ID du consultant est souvent dans user.id ou un champ similaire.
          // Adapter l'appel si l'ID est requis par getEnquetesSatisfaction()
          const data = await qualiopi.getEnquetesSatisfaction(); 
          setEnquetes(data as EnqueteData[]);
        } catch (err) {
          console.error("Erreur lors du chargement des enquêtes:", err);
          setError("Impossible de charger les enquêtes de satisfaction.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchEnquetes();
    } else {
      setIsLoading(false);
      setError("Authentification requise pour accéder aux enquêtes.");
    }
  }, [user]);

  // Fonction de simulation pour une action (ex: voir détails)
  const handleViewDetails = (enqueteId: string) => {
    console.log(`Afficher les détails de l'enquête: ${enqueteId}`);
    // Logique de navigation ou d'affichage de modal en HTML pur ici
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-gray-900">Gestion des enquêtes de satisfaction</div>
        <button 
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => console.log("Ajouter une nouvelle enquête")}
        >
          Ajouter une enquête
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-10">
          <div className="text-lg font-medium text-indigo-600">Chargement des données...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erreur:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!isLoading && !error && enquetes.length === 0 && (
        <div className="text-center py-10 border border-gray-200 rounded-lg bg-white">
          <div className="text-lg font-medium text-gray-500">Aucune enquête de satisfaction trouvée.</div>
        </div>
      )}

      {!isLoading && !error && enquetes.length > 0 && (
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  ID Enquête
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Nom du Bilan
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Date de Création
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Statut
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {enquetes.map((enquete) => (
                <tr key={enquete.id}>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{enquete.id}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                    {enquete.nom_bilan || 'N/A'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(enquete.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                      enquete.statut === 'Terminée' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {enquete.statut || 'En cours'}
                    </div>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => handleViewDetails(enquete.id)}
                    >
                      Voir détails<span className="sr-only">, {enquete.id}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
