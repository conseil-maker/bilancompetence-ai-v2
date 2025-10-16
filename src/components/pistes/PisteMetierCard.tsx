'use client';

import React from 'react';
import { Database } from '@/types/database.types';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// Définition du type pour la Piste Métier
// En supposant que 'pistes_metiers' est une table dans votre schéma de base de données
type PisteMetier = Database['public']['Tables']['pistes_metiers']['Row'];

// Définition des Props du composant
interface PisteMetierCardProps {
  pisteMetier: PisteMetier;
  isLoading?: boolean;
  error?: string | null;
}

// Fonction utilitaire pour déterminer la couleur et l'icône du statut
const getStatusDisplay = (status: string) => {
  switch (status.toLowerCase()) {
    case 'validée':
      return {
        icon: CheckCircleIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        label: 'Validée',
      };
    case 'rejetée':
      return {
        icon: XCircleIcon,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        label: 'Rejetée',
      };
    case 'en attente':
    default:
      return {
        icon: ClockIcon,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        label: 'En Attente',
      };
  }
};

// Fonction utilitaire pour déterminer la couleur du score d'adéquation
const getScoreColor = (score: number) => {
  if (score >= 75) return 'text-green-600 bg-green-50';
  if (score >= 50) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};

const PisteMetierCard: React.FC<PisteMetierCardProps> = ({ pisteMetier, isLoading, error }) => {
  // Gestion des états de chargement et d'erreur
  if (isLoading) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg shadow-md animate-pulse bg-white">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/5"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-400 rounded-lg shadow-md bg-red-50 text-red-700">
        <p className="font-semibold">Erreur de chargement :</p>
        <p>{error}</p>
      </div>
    );
  }

  // Assurez-vous que les données nécessaires sont présentes
  if (!pisteMetier) {
    return (
      <div className="p-4 border border-gray-400 rounded-lg shadow-md bg-gray-50 text-gray-700">
        <p className="font-semibold">Aucune piste métier à afficher.</p>
      </div>
    );
  }

  // Extraction des données avec valeurs par défaut pour la robustesse
  const nomPiste = pisteMetier.nom_piste || 'Piste Métier Inconnue';
  const description = pisteMetier.description_courte || 'Description non disponible.';
  const scoreAdequation = pisteMetier.score_adequation ?? 0; // Supposons un score entre 0 et 100
  const statut = pisteMetier.statut || 'En Attente';

  const { icon: StatusIcon, color: statusColor, bgColor: statusBgColor, label: statusLabel } = getStatusDisplay(statut);
  const scoreColorClass = getScoreColor(scoreAdequation);

  return (
    <div className="w-full max-w-sm mx-auto md:max-w-md lg:max-w-lg p-5 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300 bg-white">
      <div className="flex justify-between items-start mb-4">
        {/* Nom de la Piste Métier */}
        <h3 className="text-xl font-bold text-gray-800 break-words pr-4">
          {nomPiste}
        </h3>
        
        {/* Score d'Adéquation */}
        <div className={`flex-shrink-0 px-3 py-1 text-sm font-semibold rounded-full ${scoreColorClass} whitespace-nowrap`}>
          {scoreAdequation}%
        </div>
      </div>

      {/* Description Courte */}
      <p className="text-gray-600 mb-4 text-sm line-clamp-2">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100">
        {/* Statut */}
        <div className={`flex items-center px-3 py-1 text-sm font-medium rounded-full ${statusColor} ${statusBgColor} mb-3 sm:mb-0`}>
          <StatusIcon className={`w-4 h-4 mr-2 ${statusColor}`} />
          {statusLabel}
        </div>

        {/* Bouton d'Action (Exemple) */}
        <button
          className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150"
          onClick={() => console.log(`Voir les détails de ${nomPiste}`)}
          aria-label={`Voir les détails de la piste métier ${nomPiste}`}
        >
          Voir les détails
          <ArrowRightIcon className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default PisteMetierCard;