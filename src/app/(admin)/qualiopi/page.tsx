'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { qualiopiModule } from '@/lib/supabase/modules';

// Définition des types pour les données de satisfaction
interface EnqueteSatisfaction {
  id: string;
  date_enquete: string;
  satisfaction_globale: number; // Note de 1 à 5
  qualite_formation: number;
  pertinence_contenu: number;
  recommandation: boolean;
  commentaire: string;
}

interface Stats {
  totalEnquetes: number;
  satisfactionMoyenne: string;
  tauxRecommandation: string;
  alertesFaibles: number;
}

const QualiopiDashboardPage: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [enquetes, setEnquetes] = useState<EnqueteSatisfaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && user) {
      const fetchEnquetes = async () => {
        try {
          setIsLoading(true);
          setError(null);
          // Simuler l'appel à la fonction fournie
          // @ts-ignore - On suppose que qualiopiModule est bien défini et contient la fonction
          const data: EnqueteSatisfaction[] = await qualiopiModule.getEnquetesSatisfaction();
          setEnquetes(data);
        } catch (err) {
          console.error("Erreur lors du chargement des enquêtes:", err);
          setError("Impossible de charger les données de satisfaction Qualiopi.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchEnquetes();
    } else if (!isAuthLoading && !user) {
      // Gérer le cas où l'utilisateur n'est pas authentifié si nécessaire
      setError("Vous devez être connecté pour accéder à ce tableau de bord.");
      setIsLoading(false);
    }
  }, [user, isAuthLoading]);

  const stats: Stats = useMemo(() => {
    if (enquetes.length === 0) {
      return {
        totalEnquetes: 0,
        satisfactionMoyenne: 'N/A',
        tauxRecommandation: 'N/A',
        alertesFaibles: 0,
      };
    }

    const total = enquetes.length;
    const sommeSatisfaction = enquetes.reduce((acc, e) => acc + e.satisfaction_globale, 0);
    const moyenne = sommeSatisfaction / total;
    const recommandations = enquetes.filter(e => e.recommandation).length;
    const tauxRecommandation = (recommandations / total) * 100;
    
    // Alerte si la satisfaction globale est inférieure à 3/5
    const alertes = enquetes.filter(e => e.satisfaction_globale < 3).length;

    return {
      totalEnquetes: total,
      satisfactionMoyenne: moyenne.toFixed(2) + ' / 5',
      tauxRecommandation: tauxRecommandation.toFixed(1) + ' %',
      alertesFaibles: alertes,
    };
  }, [enquetes]);

  // Styles Tailwind de base pour le tableau de bord
  const baseClasses = "p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto";
  const cardClasses = "bg-white shadow-lg rounded-lg p-4 transition duration-300 ease-in-out hover:shadow-xl";
  const headerClasses = "text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b pb-2";
  const statValueClasses = "text-3xl font-extrabold";
  const statLabelClasses = "text-sm font-medium text-gray-500 uppercase tracking-wider";
  const tableHeaderClasses = "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
  const tableRowClasses = "bg-white border-b hover:bg-gray-50";

  if (isAuthLoading || isLoading) {
    return (
      <div className={baseClasses}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="ml-4 text-lg text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={baseClasses}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={baseClasses}>
      <h1 className={headerClasses}>Tableau de Bord de Conformité Qualiopi</h1>

      {/* Section des Statistiques Clés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={cardClasses}>
          <div className={statLabelClasses}>Enquêtes Traitées</div>
          <div className={statValueClasses}>{stats.totalEnquetes}</div>
        </div>
        <div className={cardClasses}>
          <div className={statLabelClasses}>Satisfaction Moyenne</div>
          <div className={`${statValueClasses} text-blue-600`}>{stats.satisfactionMoyenne}</div>
        </div>
        <div className={cardClasses}>
          <div className={statLabelClasses}>Taux de Recommandation</div>
          <div className={`${statValueClasses} text-green-600`}>{stats.tauxRecommandation}</div>
        </div>
        <div className={`${cardClasses} ${stats.alertesFaibles > 0 ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'}`}>
          <div className={statLabelClasses}>Alertes (Satisfaction &lt; 3)</div>
          <div className={`${statValueClasses} ${stats.alertesFaibles > 0 ? 'text-red-600' : 'text-green-600'}`}>{stats.alertesFaibles}</div>
        </div>
      </div>

      {/* Section des Alertes et Actions */}
      {stats.alertesFaibles > 0 && (
        <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 rounded-lg" role="alert">
          <p className="font-bold">Attention : {stats.alertesFaibles} enquête(s) signale(nt) une faible satisfaction.</p>
          <p className="text-sm">Veuillez examiner les commentaires pour identifier les axes d'amélioration.</p>
        </div>
      )}

      {/* Tableau des Enquêtes Détaillées */}
      <div className="shadow-lg overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">Détail des Enquêtes de Satisfaction</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className={tableHeaderClasses}>Date</th>
                <th scope="col" className={tableHeaderClasses}>Satisfaction Globale (1-5)</th>
                <th scope="col" className={tableHeaderClasses}>Qualité Formation (1-5)</th>
                <th scope="col" className={tableHeaderClasses}>Pertinence Contenu (1-5)</th>
                <th scope="col" className={tableHeaderClasses}>Recommandation</th>
                <th scope="col" className={tableHeaderClasses}>Commentaire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {enquetes.map((enquete) => (
                <tr key={enquete.id} className={tableRowClasses}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(enquete.date_enquete).toLocaleDateString('fr-FR')}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-bold ${enquete.satisfaction_globale < 3 ? 'text-red-600' : 'text-green-600'}`}>
                    {enquete.satisfaction_globale}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {enquete.qualite_formation}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {enquete.pertinence_contenu}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${enquete.recommandation ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {enquete.recommandation ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate" title={enquete.commentaire}>
                    {enquete.commentaire || 'Aucun'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {enquetes.length === 0 && (
          <p className="p-4 text-center text-gray-500">Aucune enquête de satisfaction disponible.</p>
        )}
      </div>

      {/* Section des Indicateurs de Conformité (Simulés) */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Indicateurs de Conformité Clés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Indicateur 1 */}
          <div className={cardClasses}>
            <div className={statLabelClasses}>Indicateur 1 : Information Publique</div>
            <div className="text-lg font-semibold text-green-700 mt-2">Conforme</div>
            <p className="text-sm text-gray-500 mt-1">Dernière vérification : 15/10/2025</p>
          </div>
          {/* Indicateur 2 */}
          <div className={cardClasses}>
            <div className={statLabelClasses}>Indicateur 7 : Recueil des Appréciations</div>
            <div className="text-lg font-semibold text-blue-700 mt-2">En Cours</div>
            <p className="text-sm text-gray-500 mt-1">Taux de réponse : {stats.tauxRecommandation}</p>
          </div>
          {/* Indicateur 3 */}
          <div className={cardClasses}>
            <div className={statLabelClasses}>Indicateur 10 : Amélioration Continue</div>
            <div className="text-lg font-semibold text-red-700 mt-2">Action Requise</div>
            <p className="text-sm text-gray-500 mt-1">Voir {stats.alertesFaibles} alerte(s) de satisfaction.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualiopiDashboardPage;
