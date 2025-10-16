'use client';

import React from 'react from 'react';
import { ActionPlan } from '@/types/database.types'; // Assumed type

// Définition des types pour les props du composant
interface PlanActionCardProps {
  action: ActionPlan;
  onActionClick?: (actionId: string) => void;
}

// Fonction utilitaire pour déterminer la couleur du statut
const getStatusColor = (status: ActionPlan['status']): string => {
  switch (status) {
    case 'todo':
      return 'bg-gray-200 text-gray-700';
    case 'in_progress':
      return 'bg-blue-100 text-blue-700';
    case 'done':
      return 'bg-green-100 text-green-700';
    case 'on_hold':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-500';
  }
};

// Fonction utilitaire pour formater la date
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Non définie';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return 'Date invalide';
  }
};

/**
 * Composant PlanActionCard
 * Affiche une carte pour une action du plan avec statut et échéance.
 * @param {PlanActionCardProps} props - Les propriétés du composant.
 */
const PlanActionCard: React.FC<PlanActionCardProps> = ({ action, onActionClick }) => {
  const { id, title, description, status, due_date } = action;

  const statusClass = getStatusColor(status);
  const formattedDueDate = formatDate(due_date);

  return (
    <div
      className={`
        bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300
        p-5 border-l-4 ${status === 'done' ? 'border-green-500' : status === 'in_progress' ? 'border-blue-500' : 'border-gray-300'}
        ${onActionClick ? 'cursor-pointer' : ''}
      `}
      onClick={() => onActionClick && onActionClick(id)}
      role={onActionClick ? 'button' : 'article'}
      aria-label={`Action: ${title}, Statut: ${status}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">{title}</h3>
        <span
          className={`
            text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wider
            whitespace-nowrap ${statusClass}
          `}
        >
          {status.replace('_', ' ')}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {description || 'Aucune description fournie pour cette action.'}
      </p>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-1.5 text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <span>Échéance: {formattedDueDate}</span>
        </div>
        {onActionClick && (
          <span className="text-indigo-600 hover:text-indigo-800 font-medium">
            Voir les détails &rarr;
          </span>
        )}
      </div>
    </div>
  );
};

export default PlanActionCard;
