'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { pistesMetiersModule } from '@/lib/supabase/modules';

// Définition des types pour la clarté
interface Formation {
  id: number;
  nom: string;
  domaine: string;
  duree: number; // en heures
  prix: number;
  taux_reussite: number; // en pourcentage
  recommandee: boolean;
}

interface PisteMetier {
  id: number;
  nom: string;
  formations: Formation[];
}

const FormationsRecommandeesPage: React.FC = () => {
  const { user } = useAuth();
  const [pistesMetiers, setPistesMetiers] = useState<PisteMetier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les filtres
  const [filtreDomaine, setFiltreDomaine] = useState('Tous');
  const [filtreDureeMax, setFiltreDureeMax] = useState<number | ''>('');
  const [filtrePrixMax, setFiltrePrixMax] = useState<number | ''>('');
  const [filtreRecommandee, setFiltreRecommandee] = useState('Tous'); // 'Tous', 'Oui', 'Non'

  useEffect(() => {
    const fetchPistesMetiers = async () => {
      if (!user) {
        setError("Utilisateur non authentifié.");
        setLoading(false);
        return;
      }

      try {
        // Simuler la récupération des données
        // Dans une application réelle, cela appellerait une fonction comme pistesMetiersModule.fetchPistesMetiers(user.id)
        const data: PisteMetier[] = [
          {
            id: 1,
            nom: "Développeur Web",
            formations: [
              { id: 101, nom: "React Avancé", domaine: "Informatique", duree: 40, prix: 800, taux_reussite: 95, recommandee: true },
              { id: 102, nom: "Node.js et Express", domaine: "Informatique", duree: 60, prix: 1200, taux_reussite: 88, recommandee: true },
              { id: 103, nom: "Design UX/UI", domaine: "Design", duree: 30, prix: 500, taux_reussite: 92, recommandee: false },
            ],
          },
          {
            id: 2,
            nom: "Chef de Projet",
            formations: [
              { id: 201, nom: "Gestion de Projet Agile", domaine: "Management", duree: 50, prix: 1500, taux_reussite: 90, recommandee: true },
              { id: 202, nom: "Communication Interpersonnelle", domaine: "Soft Skills", duree: 20, prix: 300, taux_reussite: 98, recommandee: false },
            ],
          },
          {
            id: 3,
            nom: "Comptable",
            formations: [
              { id: 301, nom: "Comptabilité Avancée IFRS", domaine: "Finance", duree: 80, prix: 2000, taux_reussite: 85, recommandee: true },
              { id: 302, nom: "Fiscalité des entreprises", domaine: "Finance", duree: 45, prix: 950, taux_reussite: 89, recommandee: true },
            ],
          },
        ];
        
        setPistesMetiers(data);
      } catch (err) {
        console.error("Erreur lors du chargement des pistes métiers:", err);
        setError("Échec du chargement des données. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchPistesMetiers();
  }, [user]);

  // Extraction de toutes les formations et domaines uniques
  const toutesFormations = useMemo(() => {
    return pistesMetiers.flatMap(piste => piste.formations.map(f => ({
      ...f,
      pisteMetierNom: piste.nom,
    })));
  }, [pistesMetiers]);

  const domainesUniques = useMemo(() => {
    const domaines = new Set<string>();
    toutesFormations.forEach(f => domaines.add(f.domaine));
    return ['Tous', ...Array.from(domaines).sort()];
  }, [toutesFormations]);

  // Logique de filtrage
  const formationsFiltrees = useMemo(() => {
    return toutesFormations.filter(formation => {
      // Filtrer par domaine
      if (filtreDomaine !== 'Tous' && formation.domaine !== filtreDomaine) {
        return false;
      }

      // Filtrer par durée maximale
      if (filtreDureeMax !== '' && formation.duree > filtreDureeMax) {
        return false;
      }

      // Filtrer par prix maximal
      if (filtrePrixMax !== '' && formation.prix > filtrePrixMax) {
        return false;
      }

      // Filtrer par recommandation
      if (filtreRecommandee === 'Oui' && !formation.recommandee) {
        return false;
      }
      if (filtreRecommandee === 'Non' && formation.recommandee) {
        return false;
      }

      return true;
    });
  }, [toutesFormations, filtreDomaine, filtreDureeMax, filtrePrixMax, filtreRecommandee]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-xl font-semibold">Chargement des formations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600 font-semibold">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="text-3xl font-bold text-gray-800">Formations Recommandées</div>
      
      {/* Zone de filtres */}
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-wrap gap-4 items-end">
        
        {/* Filtre Domaine */}
        <div className="flex flex-col">
          <label htmlFor="filtreDomaine" className="text-sm font-medium text-gray-700 mb-1">Domaine</label>
          <select
            id="filtreDomaine"
            value={filtreDomaine}
            onChange={(e) => setFiltreDomaine(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {domainesUniques.map(domaine => (
              <option key={domaine} value={domaine}>{domaine}</option>
            ))}
          </select>
        </div>

        {/* Filtre Durée Max */}
        <div className="flex flex-col">
          <label htmlFor="filtreDureeMax" className="text-sm font-medium text-gray-700 mb-1">Durée Max (heures)</label>
          <input
            id="filtreDureeMax"
            type="number"
            value={filtreDureeMax}
            onChange={(e) => setFiltreDureeMax(e.target.value === '' ? '' : parseInt(e.target.value))}
            placeholder="Ex: 50"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-32"
          />
        </div>

        {/* Filtre Prix Max */}
        <div className="flex flex-col">
          <label htmlFor="filtrePrixMax" className="text-sm font-medium text-gray-700 mb-1">Prix Max (€)</label>
          <input
            id="filtrePrixMax"
            type="number"
            value={filtrePrixMax}
            onChange={(e) => setFiltrePrixMax(e.target.value === '' ? '' : parseInt(e.target.value))}
            placeholder="Ex: 1000"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-32"
          />
        </div>

        {/* Filtre Recommandée */}
        <div className="flex flex-col">
          <label htmlFor="filtreRecommandee" className="text-sm font-medium text-gray-700 mb-1">Recommandée</label>
          <select
            id="filtreRecommandee"
            value={filtreRecommandee}
            onChange={(e) => setFiltreRecommandee(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Tous">Tous</option>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </div>

        {/* Bouton de réinitialisation (optionnel) */}
        <button
          onClick={() => {
            setFiltreDomaine('Tous');
            setFiltreDureeMax('');
            setFiltrePrixMax('');
            setFiltreRecommandee('Tous');
          }}
          className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition duration-150"
        >
          Réinitialiser
        </button>
      </div>

      {/* Tableau des formations */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piste Métier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domaine</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Durée (h)</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Prix (€)</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Taux Réussite (%)</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Recommandée</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {formationsFiltrees.length > 0 ? (
              formationsFiltrees.map((formation) => (
                <tr key={formation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formation.nom}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formation.pisteMetierNom}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formation.domaine}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formation.duree}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formation.prix.toLocaleString('fr-FR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formation.taux_reussite}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                      formation.recommandee ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {formation.recommandee ? 'Oui' : 'Non'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <button
                      onClick={() => alert(`Détails de la formation: ${formation.nom}`)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      Voir Détails
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucune formation trouvée correspondant aux critères de filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Affichage du nombre de résultats */}
      <div className="text-sm text-gray-600">
        {formationsFiltrees.length} formation(s) affichée(s) sur {toutesFormations.length} au total.
      </div>
    </div>
  );
};

export default FormationsRecommandeesPage;