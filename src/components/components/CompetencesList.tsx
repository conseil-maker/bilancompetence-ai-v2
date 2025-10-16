'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Competence, CompetenceCategory, mockCompetences, competenceCategories } from '@/types/database.types';

// Composant pour afficher une seule compétence
interface CompetenceCardProps {
  competence: Competence;
}

const CompetenceCard: React.FC<CompetenceCardProps> = ({ competence }) => {
  const renderLevel = (level: number) => {
    const totalStars = 5;
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: totalStars }, (_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${index < level ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">{competence.level}/5</span>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{competence.name}</h3>
      <p className="text-sm text-indigo-600 font-medium mb-3 capitalize">
        {competence.category.replace('_', ' ')}
      </p>
      <p className="text-gray-600 mb-4 text-sm">{competence.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Niveau de Maîtrise:</span>
        {renderLevel(competence.level)}
      </div>
    </div>
  );
};

// Composant principal
interface CompetencesListProps {
  // Optionnel: pour passer les données de l'extérieur si nécessaire
  initialCompetences?: Competence[];
}

const CompetencesList: React.FC<CompetencesListProps> = ({ initialCompetences }) => {
  // Simulation de l'état de chargement et d'erreur
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Utilisation des données initiales ou des données simulées
  const allCompetences = useMemo(() => initialCompetences || mockCompetences, [initialCompetences]);

  // États pour le filtrage
  const [selectedCategory, setSelectedCategory] = useState<CompetenceCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Logique de filtrage
  const filteredCompetences = useMemo(() => {
    let filtered = allCompetences;

    // 1. Filtrage par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }

    // 2. Filtrage par terme de recherche (nom ou description)
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(lowerCaseSearch) ||
        c.description.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return filtered;
  }, [allCompetences, selectedCategory, searchTerm]);

  // Gestion des changements de catégorie
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as CompetenceCategory | 'all');
  }, []);

  // Gestion des changements de terme de recherche
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Affichage de l'état de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-lg text-indigo-600">Chargement des compétences...</p>
      </div>
    );
  }

  // Affichage de l'état d'erreur
  if (error) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
        <p className="font-bold">Erreur de chargement</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Catalogue de Compétences</h1>
      
      {/* Zone de filtres et recherche */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 sticky top-0 z-10 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Champ de recherche */}
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Rechercher une compétence</label>
            <input
              id="search"
              type="text"
              placeholder="Rechercher par nom ou description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              aria-label="Champ de recherche de compétences"
            />
          </div>

          {/* Sélecteur de catégorie */}
          <div className="w-full md:w-64">
            <label htmlFor="category" className="sr-only">Filtrer par catégorie</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              aria-label="Sélecteur de catégorie de compétences"
            >
              {competenceCategories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Affichage des résultats */}
      <div className="mb-8">
        <p className="text-lg font-medium text-gray-700">
          {filteredCompetences.length} compétence(s) trouvée(s)
        </p>
      </div>

      {filteredCompetences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetences.map(competence => (
            <CompetenceCard key={competence.id} competence={competence} />
          ))}
        </div>
      ) : (
        <div className="text-center p-10 bg-white rounded-xl shadow-md">
          <p className="text-xl font-semibold text-gray-600">
            Aucune compétence ne correspond à vos critères de recherche.
          </p>
          <p className="text-gray-500 mt-2">
            Veuillez ajuster la catégorie ou le terme de recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default CompetencesList;