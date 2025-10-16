'use client';

import React from 'react';
import { Clock, Building2, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';

// Définition du type de base pour une formation, en supposant une structure
// compatible avec les types de base de données de l'application.
// Remplacer par le type réel 'Database["public"]["Tables"]["formations"]["Row"]' si disponible.
interface Formation {
  id: string;
  nom: string;
  organisme: string;
  duree_heures: number;
  lien_externe: string | null;
  description: string | null;
}

// Définition des Props du composant
interface FormationCardProps {
  formation: Formation | null;
  isLoading?: boolean;
  isError?: boolean;
}

/**
 * Composant FormationCard pour afficher une carte de formation recommandée.
 * Il inclut le nom, l'organisme, la durée et un lien externe.
 * Il gère également les états de chargement et d'erreur.
 */
const FormationCard: React.FC<FormationCardProps> = ({ formation, isLoading = false, isError = false }) => {
  // 1. Gestion de l'état d'erreur
  if (isError) {
    return (
      <div className="p-4 border border-red-400 bg-red-50 rounded-lg shadow-md flex items-center space-x-3 w-full max-w-sm mx-auto">
        <AlertTriangle className="w-6 h-6 text-red-600" />
        <p className="text-sm font-medium text-red-800">
          Erreur lors du chargement de la formation.
        </p>
      </div>
    );
  }

  // 2. Gestion de l'état de chargement
  if (isLoading || !formation) {
    return (
      <div className="p-4 border border-gray-200 bg-white rounded-lg shadow-md animate-pulse w-full max-w-sm mx-auto">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="mt-4 flex justify-end">
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  // 3. Affichage normal de la carte
  const { nom, organisme, duree_heures, lien_externe } = formation;

  return (
    <div className="
      p-5 border border-gray-200 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300
      w-full max-w-sm mx-auto
      flex flex-col
    ">
      {/* En-tête de la carte */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2 leading-tight">
        {nom}
      </h3>

      {/* Détails de la formation */}
      <div className="space-y-2 text-sm text-gray-600 mt-2">
        {/* Organisme */}
        <div className="flex items-center">
          <Building2 className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
          <span className="font-medium text-gray-700">Organisme:</span>
          <span className="ml-2 truncate">{organisme}</span>
        </div>

        {/* Durée */}
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
          <span className="font-medium text-gray-700">Durée:</span>
          <span className="ml-2">{duree_heures} heures</span>
        </div>
      </div>

      {/* Bouton ou Lien d'action */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
        {lien_externe ? (
          <a
            href={lien_externe}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm
              text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              transition duration-150 ease-in-out
            "
            aria-label={`Voir la formation ${nom} sur le site externe`}
          >
            Voir la formation
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        ) : (
          <span className="text-sm text-gray-500 italic">Lien non disponible</span>
        )}
      </div>
    </div>
  );
};

export default FormationCard;