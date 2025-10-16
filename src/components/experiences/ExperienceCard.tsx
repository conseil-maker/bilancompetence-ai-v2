'use client';

import React from 'react';
import { Briefcase, Calendar, MapPin, Loader2, AlertTriangle } from 'lucide-react';

// Définition du type Experience, simulant l'import de @/types/database.types
// En réalité, ce type devrait être importé du chemin spécifié.
export type Experience = {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string; // Format 'YYYY-MM-DD' ou 'Month YYYY'
  endDate: string | null; // null si l'expérience est en cours
  description: string;
};

// Définition de l'interface des Props du composant
interface ExperienceCardProps {
  experience: Experience | null;
  isLoading?: boolean;
  isError?: boolean;
}

/**
 * Composant ExperienceCard pour afficher une expérience professionnelle.
 * Il est conçu pour être un Client Component et utilise Tailwind CSS.
 *
 * @param {ExperienceCardProps} props - Les propriétés du composant.
 * @returns {JSX.Element} La carte d'expérience professionnelle.
 */
const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  isLoading = false,
  isError = false,
}) => {
  // Gestion de l'état de chargement
  if (isLoading) {
    return (
      <div
        className="p-6 border border-gray-200 rounded-xl shadow-lg bg-white animate-pulse"
        aria-live="polite"
        aria-label="Chargement de l'expérience professionnelle"
      >
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  // Gestion de l'état d'erreur
  if (isError) {
    return (
      <div
        className="p-6 border border-red-400 rounded-xl shadow-lg bg-red-50"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center space-x-3 text-red-700">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
        </div>
        <p className="mt-2 text-sm text-red-600">
          Impossible d'afficher les détails de l'expérience. Veuillez réessayer.
        </p>
      </div>
    );
  }

  // Gestion du cas où l'expérience est nulle après le chargement
  if (!experience) {
    return (
      <div
        className="p-6 border border-yellow-400 rounded-xl shadow-lg bg-yellow-50"
        role="status"
      >
        <p className="text-yellow-700">
          Aucune donnée d'expérience professionnelle disponible.
        </p>
      </div>
    );
  }

  // Fonction utilitaire pour formater les dates (simplifiée)
  const formatDate = (dateString: string) => {
    // Une implémentation plus robuste utiliserait une librairie comme date-fns ou Intl.DateTimeFormat
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
    } catch {
      return dateString; // Retourne la chaîne brute si le formatage échoue
    }
  };

  const formattedStartDate = formatDate(experience.startDate);
  const formattedEndDate = experience.endDate ? formatDate(experience.endDate) : 'En cours';
  const duration = `${formattedStartDate} - ${formattedEndDate}`;

  return (
    <article
      className="p-6 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
      aria-labelledby={`experience-title-${experience.id}`}
    >
      <header className="mb-4 border-b pb-3">
        <h2 id={`experience-title-${experience.id}`} className="text-2xl font-bold text-gray-800">
          {experience.title}
        </h2>
        <p className="text-lg font-medium text-blue-600 mt-1 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-blue-500" aria-hidden="true" />
          {experience.company}
        </p>
      </header>

      <div className="space-y-3 text-gray-600">
        <div className="flex items-center text-sm">
          <Calendar className="w-4 h-4 mr-2 text-gray-500" aria-hidden="true" />
          <time dateTime={experience.startDate}>
            {duration}
          </time>
        </div>

        <div className="flex items-center text-sm">
          <MapPin className="w-4 h-4 mr-2 text-gray-500" aria-hidden="true" />
          <span>{experience.location}</span>
        </div>

        <section className="pt-3">
          <h3 className="sr-only">Description de l'expérience</h3>
          <p className="text-base leading-relaxed whitespace-pre-line">
            {experience.description}
          </p>
        </section>
      </div>
    </article>
  );
};

export default ExperienceCard;
