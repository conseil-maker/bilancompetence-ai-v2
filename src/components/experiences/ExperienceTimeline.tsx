'use client';

import React from 'react';
import { Clock, Briefcase, MapPin, Loader2, AlertTriangle } from 'lucide-react';

// --- MOCK TYPE DEFINITION ---
// En l'absence du fichier '@/types/database.types', nous définissons un type plausible
// pour une expérience professionnelle.
export type Experience = {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string; // Format 'YYYY-MM-DD' ou 'Mois YYYY'
  endDate: string | null; // null pour l'expérience actuelle
  description: string;
  isCurrent: boolean;
};

// --- PROPS INTERFACE ---
interface ExperienceTimelineProps {
  experiences: Experience[] | null;
  isLoading: boolean;
  error: string | null;
}

// --- HELPER FUNCTIONS ---

/**
 * Formate une date au format lisible (ex: "Janvier 2020").
 * @param dateString La date au format YYYY-MM-DD.
 * @returns La date formatée.
 */
const formatDate = (dateString: string): string => {
  if (!dateString) return 'Date inconnue';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  } catch (e) {
    return dateString; // Retourne la chaîne originale en cas d'erreur
  }
};

/**
 * Affiche la période de l'expérience.
 * @param start La date de début.
 * @param end La date de fin.
 * @param isCurrent Indique si c'est l'expérience actuelle.
 * @returns La période formatée.
 */
const formatPeriod = (start: string, end: string | null, isCurrent: boolean): string => {
  const formattedStart = formatDate(start);
  if (isCurrent) {
    return `${formattedStart} - Aujourd'hui`;
  }
  const formattedEnd = end ? formatDate(end) : 'Date inconnue';
  return `${formattedStart} - ${formattedEnd}`;
};

// --- SUB-COMPONENT: TIMELINE ITEM ---
interface TimelineItemProps {
  experience: Experience;
  isLast: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ experience, isLast }) => {
  const { title, company, location, startDate, endDate, description, isCurrent } = experience;
  const period = formatPeriod(startDate, endDate, isCurrent);

  return (
    <li className="relative mb-8 pl-8 sm:pl-12 border-l-2 border-gray-200 dark:border-gray-700">
      {/* Cercle de l'événement */}
      <div className="absolute -left-2.5 top-0 w-5 h-5 bg-white border-4 border-indigo-500 dark:bg-gray-900 dark:border-indigo-400 rounded-full shadow-md flex items-center justify-center">
        <Briefcase className="w-3 h-3 text-indigo-500 dark:text-indigo-400" aria-hidden="true" />
      </div>

      {/* Contenu de l'événement */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-lg font-medium text-indigo-600 dark:text-indigo-300">{company}</p>
        
        {/* Détails (Période et Lieu) */}
        <div className="flex flex-wrap items-center gap-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <time dateTime={startDate}>{period}</time>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" aria-hidden="true" />
            <span>{location}</span>
          </span>
        </div>

        {/* Description */}
        <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {description}
        </p>
      </div>
    </li>
  );
};

// --- MAIN COMPONENT ---
const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ experiences, isLoading, error }) => {
  // 1. Gestion de l'état de chargement
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg" role="status" aria-live="polite">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" aria-hidden="true" />
        <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">Chargement des expériences...</p>
      </div>
    );
  }

  // 2. Gestion de l'état d'erreur
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-lg" role="alert" aria-live="assertive">
        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" aria-hidden="true" />
        <p className="mt-4 text-lg font-medium text-red-700 dark:text-red-300">Erreur lors du chargement :</p>
        <p className="text-sm text-red-600 dark:text-red-400 text-center mt-1">{error}</p>
      </div>
    );
  }

  // 3. Gestion de l'absence de données
  if (!experiences || experiences.length === 0) {
    return (
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center" role="note" aria-live="polite">
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Aucune expérience professionnelle trouvée.</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Veuillez ajouter des expériences pour les afficher ici.</p>
      </div>
    );
  }

  // 4. Affichage de la timeline (responsive: la timeline est toujours verticale)
  return (
    <section className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl shadow-2xl" aria-labelledby="experience-timeline-title">
      <h2 id="experience-timeline-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2">
        Chronologie des Expériences Professionnelles
      </h2>
      
      <ol className="relative">
        {experiences
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()) // Tri par date de début décroissante
          .map((experience, index) => (
            <TimelineItem
              key={experience.id}
              experience={experience}
              isLast={index === experiences.length - 1}
            />
          ))}
      </ol>
    </section>
  );
};

export default ExperienceTimeline;
