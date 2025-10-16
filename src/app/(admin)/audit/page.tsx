'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
// Supposons que le module d'activités exporte une fonction pour récupérer les données
// et que le type d'activité est défini ici ou dans un fichier de types partagé.
// Pour l'exercice, nous allons définir les types et simuler le module.
// import { activitesModule } from '@/lib/supabase/modules';

// --- Types Mockés pour l'exercice ---
interface Activite {
  id: string;
  utilisateurId: string;
  utilisateurNom: string;
  action: string;
  details: string;
  date: string; // ISO string
}

// Simulation du module Supabase
const activitesModule = {
  getAllActivites: async (): Promise<Activite[]> => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Données mockées
    return [
      { id: '1', utilisateurId: 'u1', utilisateurNom: 'Alice Dupont', action: 'CONNEXION', details: 'Connexion réussie', date: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: '2', utilisateurId: 'u2', utilisateurNom: 'Bob Martin', action: 'CREATION_BILAN', details: 'Création du bilan #123', date: new Date(Date.now() - 86400000 * 1.5).toISOString() },
      { id: '3', utilisateurId: 'u1', utilisateurNom: 'Alice Dupont', action: 'MODIFICATION_PROFIL', details: 'Mise à jour de l\'adresse email', date: new Date(Date.now() - 86400000).toISOString() },
      { id: '4', utilisateurId: 'u3', utilisateurNom: 'Charlie Lefevre', action: 'DECONNEXION', details: 'Déconnexion normale', date: new Date(Date.now() - 86400000 * 0.5).toISOString() },
      { id: '5', utilisateurId: 'u2', utilisateurNom: 'Bob Martin', action: 'SUPPRESSION_FICHIER', details: 'Suppression du document "Rapport Q3"', date: new Date().toISOString() },
    ];
  }
};
// --- Fin des Types Mockés ---

const AuditJournalPage: React.FC = () => {
  // --- Hooks et États ---
  const { user, isLoading: isAuthLoading } = useAuth();
  const [activites, setActivites] = useState<Activite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États de filtrage
  const [filtreUtilisateur, setFiltreUtilisateur] = useState('');
  const [filtreAction, setFiltreAction] = useState('');
  const [filtreDateDebut, setFiltreDateDebut] = useState('');
  const [filtreDateFin, setFiltreDateFin] = useState('');

  // --- Logique de Chargement des Données ---
  useEffect(() => {
    const chargerActivites = async () => {
      if (isAuthLoading || !user) {
        // Gérer le cas où l'utilisateur n'est pas authentifié ou l'authentification est en cours
        // Pour cette page admin, on pourrait rediriger ou afficher un message d'accès refusé.
        // Pour l'instant, on suppose que l'accès est géré en amont ou que l'utilisateur est admin.
        if (!isAuthLoading && !user) {
            setError("Accès refusé. Vous devez être connecté.");
            setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        const data = await activitesModule.getAllActivites();
        setActivites(data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des activités:", err);
        setError("Échec du chargement des données d'audit.");
      } finally {
        setIsLoading(false);
      }
    };

    chargerActivites();
  }, [user, isAuthLoading]);

  // --- Logique de Filtrage ---
  const activitesFiltrees = useMemo(() => {
    return activites.filter(activite => {
      // Filtrer par utilisateur
      if (filtreUtilisateur && !activite.utilisateurNom.toLowerCase().includes(filtreUtilisateur.toLowerCase())) {
        return false;
      }

      // Filtrer par action
      if (filtreAction && activite.action !== filtreAction) {
        return false;
      }

      const dateActivite = new Date(activite.date).getTime();

      // Filtrer par date de début
      if (filtreDateDebut) {
        const debut = new Date(filtreDateDebut).getTime();
        if (dateActivite < debut) {
          return false;
        }
      }

      // Filtrer par date de fin
      if (filtreDateFin) {
        // Ajouter un jour pour inclure la journée entière
        const fin = new Date(filtreDateFin);
        fin.setDate(fin.getDate() + 1);
        const finTime = fin.getTime();
        if (dateActivite >= finTime) {
          return false;
        }
      }

      return true;
    });
  }, [activites, filtreUtilisateur, filtreAction, filtreDateDebut, filtreDateFin]);

  // Options uniques pour les filtres (Actions et Utilisateurs)
  const optionsActions = useMemo(() => {
    const actions = new Set(activites.map(a => a.action));
    return Array.from(actions).sort();
  }, [activites]);

  const optionsUtilisateurs = useMemo(() => {
    const utilisateurs = new Set(activites.map(a => a.utilisateurNom));
    return Array.from(utilisateurs).sort();
  }, [activites]);

  // --- Logique d'Exportation CSV ---
  const handleExportCSV = () => {
    if (activitesFiltrees.length === 0) {
      alert("Aucune activité à exporter.");
      return;
    }

    const headers = ["ID", "Utilisateur", "Action", "Détails", "Date"];
    const csvContent = activitesFiltrees.map(a => [
      a.id,
      a.utilisateurNom,
      a.action,
      `"${a.details.replace(/"/g, '""')}"`, // Gérer les guillemets dans les détails
      new Date(a.date).toLocaleString('fr-FR'),
    ].join(',')).join('\n'); // Correction: utiliser \n pour le saut de ligne CSV

    const csv = [headers.join(','), csvContent].join('\n'); // Correction: utiliser \n pour le saut de ligne CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'journal_audit.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Rendu des États Spéciaux ---
  if (isAuthLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">Chargement du journal d'audit...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto bg-red-100 border border-red-400 text-red-700 rounded-lg mt-10">
        <h1 className="text-2xl font-bold mb-4">Erreur d'accès ou de chargement</h1>
        <p>{error}</p>
        <p className="mt-4 text-sm">Veuillez vérifier votre connexion ou vos droits d'accès.</p>
      </div>
    );
  }

  // --- Rendu Principal ---
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Journal d'Audit Complet</h1>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          aria-label="Exporter les données filtrées au format CSV"
        >
          Exporter CSV ({activitesFiltrees.length})
        </button>
      </header>

      {/* Section des Filtres */}
      <section className="bg-white p-4 rounded-lg shadow-xl mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Filtres d'Activité</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Filtre par Utilisateur (Recherche textuelle) */}
          <div>
            <label htmlFor="filtreUtilisateur" className="block text-sm font-medium text-gray-700 mb-1">
              Utilisateur (Nom)
            </label>
            <input
              id="filtreUtilisateur"
              type="text"
              value={filtreUtilisateur}
              onChange={(e) => setFiltreUtilisateur(e.target.value)}
              placeholder="Rechercher par nom..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Filtre par Action (Select) */}
          <div>
            <label htmlFor="filtreAction" className="block text-sm font-medium text-gray-700 mb-1">
              Action
            </label>
            <select
              id="filtreAction"
              value={filtreAction}
              onChange={(e) => setFiltreAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="">Toutes les actions</option>
              {optionsActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          {/* Filtre par Date de Début */}
          <div>
            <label htmlFor="filtreDateDebut" className="block text-sm font-medium text-gray-700 mb-1">
              Date de Début
            </label>
            <input
              id="filtreDateDebut"
              type="date"
              value={filtreDateDebut}
              onChange={(e) => setFiltreDateDebut(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Filtre par Date de Fin */}
          <div>
            <label htmlFor="filtreDateFin" className="block text-sm font-medium text-gray-700 mb-1">
              Date de Fin
            </label>
            <input
              id="filtreDateFin"
              type="date"
              value={filtreDateFin}
              onChange={(e) => setFiltreDateFin(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        {/* Bouton de Réinitialisation des Filtres */}
        <div className="mt-4">
            <button
                onClick={() => {
                    setFiltreUtilisateur('');
                    setFiltreAction('');
                    setFiltreDateDebut('');
                    setFiltreDateFin('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
                Réinitialiser les Filtres
            </button>
        </div>
      </section>

      {/* Tableau des Activités */}
      <section className="bg-white rounded-lg shadow-xl overflow-x-auto">
        <div className="p-4">
            <p className="text-sm text-gray-600">
                Affichage de {activitesFiltrees.length} activités sur {activites.length} au total.
            </p>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <caption className="sr-only">Tableau du journal d'audit filtré</caption>
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Détails
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activitesFiltrees.length > 0 ? (
              activitesFiltrees.map((activite) => (
                <tr key={activite.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(activite.date).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activite.utilisateurNom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {activite.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={activite.details}>
                    {activite.details}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucune activité trouvée correspondant aux filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AuditJournalPage;