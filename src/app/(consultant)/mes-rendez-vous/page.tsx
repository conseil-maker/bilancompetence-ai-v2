'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { rdvModule } from '@/lib/supabase/modules';
import { Rdv } from '@/lib/supabase/modules/rdvModule';

// Définition des types pour les données de la page
interface RdvDisplay extends Rdv {
  beneficiaireNom: string;
  beneficiairePrenom: string;
}

const ConsultantMesRendezVousPage: React.FC = () => {
  const { user } = useAuth();
  const [rdvs, setRdvs] = useState<RdvDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtreStatut, setFiltreStatut] = useState<string>('all');
  const [filtreDate, setFiltreDate] = useState<string>('');

  // Fonction pour charger les rendez-vous
  useEffect(() => {
    const fetchRdvs = async () => {
      if (!user?.id) {
        setLoading(false);
        setError("ID utilisateur non disponible. Veuillez vous connecter.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Utilisation de la fonction demandée : rdvModule.getRdvsByConsultant()
        const data = await rdvModule.getRdvsByConsultant(user.id);
        
        // Simuler l'enrichissement des données avec les noms/prénoms des bénéficiaires
        // En réalité, rdvModule.getRdvsByConsultant() devrait gérer la jointure ou une fonction séparée serait utilisée.
        // Ici, on simule pour avoir un objet RdvDisplay complet.
        const rdvsDisplay: RdvDisplay[] = data.map(rdv => ({
          ...rdv,
          beneficiaireNom: rdv.beneficiaire_id ? `Nom Bénéficiaire ${rdv.beneficiaire_id}` : 'N/A',
          beneficiairePrenom: rdv.beneficiaire_id ? `Prénom Bénéficiaire ${rdv.beneficiaire_id}` : 'N/A',
        }));

        setRdvs(rdvsDisplay);
      } catch (err) {
        console.error("Erreur lors du chargement des RDV:", err);
        setError("Échec du chargement des rendez-vous.");
      } finally {
        setLoading(false);
      }
    };

    fetchRdvs();
  }, [user?.id]);

  // Filtrage des rendez-vous
  const rdvsFiltres = useMemo(() => {
    return rdvs.filter(rdv => {
      // Filtrer par statut
      const statutMatch = filtreStatut === 'all' || rdv.statut === filtreStatut;

      // Filtrer par date (simple comparaison de date YYYY-MM-DD)
      const dateRdv = new Date(rdv.date_heure).toISOString().split('T')[0];
      const dateMatch = !filtreDate || dateRdv === filtreDate;

      return statutMatch && dateMatch;
    });
  }, [rdvs, filtreStatut, filtreDate]);

  // Affichage du composant
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mon Calendrier de Rendez-vous</h1>
        <p className="text-gray-600 mt-1">Liste de tous les rendez-vous planifiés avec les bénéficiaires.</p>
      </div>

      {/* Zone de filtres */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-4 items-center">
        <div className="flex flex-col">
          <label htmlFor="filtreStatut" className="text-sm font-medium text-gray-700 mb-1">Filtrer par Statut</label>
          <select
            id="filtreStatut"
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="planifie">Planifié</option>
            <option value="termine">Terminé</option>
            <option value="annule">Annulé</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="filtreDate" className="text-sm font-medium text-gray-700 mb-1">Filtrer par Date</label>
          <input
            id="filtreDate"
            type="date"
            value={filtreDate}
            onChange={(e) => setFiltreDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          onClick={() => { setFiltreStatut('all'); setFiltreDate(''); }}
          className="mt-auto p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-150"
        >
          Réinitialiser les filtres
        </button>
      </div>

      {/* Affichage des données */}
      {loading && (
        <div className="text-center p-8">
          <p className="text-lg font-medium text-indigo-600">Chargement des rendez-vous...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <p className="font-bold">Erreur:</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Heure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bénéficiaire</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type de RDV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rdvsFiltres.length > 0 ? (
                rdvsFiltres.map((rdv) => (
                  <tr key={rdv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(rdv.date_heure).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rdv.beneficiairePrenom} {rdv.beneficiaireNom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rdv.type_rdv}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        rdv.statut === 'planifie' ? 'bg-blue-100 text-blue-800' :
                        rdv.statut === 'termine' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {rdv.statut}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => alert(`Détails du RDV ${rdv.id}`)}
                        className="text-indigo-600 hover:text-indigo-900 transition duration-150"
                      >
                        Voir Détails
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun rendez-vous trouvé pour les filtres sélectionnés.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConsultantMesRendezVousPage;