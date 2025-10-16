'use client';

import React from 'react';
import { Database } from '@/types/database.types';
import { CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, Zap } from 'lucide-react';

// Définition des types pour les données de compétence
// On suppose que le type de compétence est défini dans '@/types/database.types'
// et qu'il s'agit d'une table ou d'une vue nommée 'competences'
type Competence = Database['public']['Tables']['competences']['Row'];

// Définition de l'interface des Props du composant
interface CompetenceCardProps {
  competence: Competence;
  isLoading?: boolean;
  error?: string | null;
}

// Fonction utilitaire pour déterminer la couleur en fonction du niveau
const getLevelColor = (level: number): string => {
  if (level >= 8) return 'bg-green-100 text-green-800 border-green-400';
  if (level >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-400';
  return 'bg-red-100 text-red-800 border-red-400';
};

// Fonction utilitaire pour déterminer l'icône en fonction du niveau
const getLevelIcon = (level: number) => {
  if (level >= 8) return <TrendingUp className="w-5 h-5 text-green-600" />;
  if (level >= 5) return <Zap className="w-5 h-5 text-yellow-600" />;
  return <TrendingDown className="w-5 h-5 text-red-600" />;
};

// Composant CompetenceCard
const CompetenceCard: React.FC<CompetenceCardProps> = ({ competence, isLoading = false, error = null }) => {
  // Gestion de l'état d'erreur
  if (error) {
    return (
      <div className="p-4 border border-red-500 rounded-lg shadow-md bg-red-50">
        <div className="flex items-center space-x-2">
          <XCircle className="w-6 h-6 text-red-600" />
          <p className="font-medium text-red-800">Erreur de chargement : {error}</p>
        </div>
      </div>
    );
  }

  // Gestion de l'état de chargement
  if (isLoading) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/6"></div>
        </div>
      </div>
    );
  }

  // Détermination des styles et icônes
  const levelColorClass = getLevelColor(competence.niveau);
  const levelIcon = getLevelIcon(competence.niveau);
  const validationIcon = competence.validee ? (
    <CheckCircle className="w-5 h-5 text-green-500" />
  ) : (
    <Clock className="w-5 h-5 text-yellow-500" />
  );
  const validationText = competence.validee ? 'Validée' : 'En attente';

  return (
    <div className="p-5 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white max-w-sm w-full mx-auto">
      {/* En-tête de la carte */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-gray-800 break-words pr-4">
          {competence.nom}
        </h3>
        <div className={`px-3 py-1 text-sm font-medium rounded-full border ${levelColorClass} flex items-center space-x-1 flex-shrink-0`}>
          {levelIcon}
          <span>Niv. {competence.niveau}</span>
        </div>
      </div>

      {/* Catégorie */}
      <p className="text-sm text-indigo-600 font-medium mb-4">
        {competence.categorie}
      </p>

      {/* Description (optionnel, si disponible) */}
      {competence.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {competence.description}
        </p>
      )}

      {/* Pied de page avec validation */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
          {validationIcon}
          <span>{validationText}</span>
        </div>
        <span className="text-xs text-gray-500">
          {competence.date_creation ? `Créée le ${new Date(competence.date_creation).toLocaleDateString()}` : 'Date inconnue'}
        </span>
      </div>
    </div>
  );
};

export default CompetenceCard;
