'use client';

import React, { ReactNode } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

// Définition de l'interface des Props pour le composant StatsCard
// Note: L'interface StatsData est une simulation de ce qui pourrait venir de @/types/database.types
// Pour une intégration réelle, il faudrait importer les types appropriés.

/**
 * Interface pour les données de la carte de statistique.
 * Simule la structure de données attendue, en attendant l'accès à @/types/database.types.
 */
interface StatsData {
  value: string | number;
  label: string;
  icon: ReactNode; // L'icône à afficher (composant React)
  unit?: string; // Unité de la valeur (ex: %, €)
}

/**
 * Interface pour les propriétés du composant StatsCard.
 */
interface StatsCardProps {
  data: StatsData | null;
  isLoading: boolean;
  isError: boolean;
  className?: string;
}

/**
 * Composant StatsCard pour afficher une statistique avec icône et valeur.
 * @param {StatsCardProps} props - Les propriétés du composant.
 * @returns {JSX.Element} Le composant StatsCard.
 */
const StatsCard: React.FC<StatsCardProps> = ({ data, isLoading, isError, className = '' }) => {
  // --- Gestion des états de chargement et d'erreur ---

  if (isLoading) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 min-h-[120px] transition-all duration-300 ${className}`}
        role="status"
        aria-live="polite"
      >
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <p className="mt-2 text-sm font-medium text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-6 bg-red-50 rounded-xl shadow-lg border border-red-200 min-h-[120px] transition-all duration-300 ${className}`}
        role="alert"
        aria-live="assertive"
      >
        <AlertTriangle className="w-6 h-6 text-red-600" />
        <p className="mt-2 text-sm font-medium text-red-600 text-center">Erreur de chargement des données</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 min-h-[120px] transition-all duration-300 ${className}`}
        aria-live="polite"
      >
        <p className="text-sm font-medium text-gray-500">Aucune donnée disponible</p>
      </div>
    );
  }

  // --- Affichage normal de la carte ---

  const { value, label, icon, unit } = data;

  return (
    <div
      className={`p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${className}`}
      aria-labelledby={`stat-label-${label.replace(/\s/g, '-')}`}
    >
      <div className="flex items-start justify-between">
        {/* Icône */}
        <div className="p-3 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
          {icon}
        </div>
        
        {/* Libellé */}
        <h3 id={`stat-label-${label.replace(/\s/g, '-')}`} className="text-sm font-medium text-gray-500 uppercase tracking-wider text-right">
          {label}
        </h3>
      </div>
      
      <div className="mt-4">
        {/* Valeur */}
        <p className="text-4xl font-extrabold text-gray-900">
          {value}
          {unit && <span className="ml-1 text-xl font-semibold text-gray-500">{unit}</span>}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;