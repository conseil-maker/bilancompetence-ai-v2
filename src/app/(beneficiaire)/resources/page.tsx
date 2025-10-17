'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuthContext as useAuth } from '@/components/providers/AuthProvider';
import { resourcesModule } from '@/lib/supabase/modules';

// Définition des types pour la ressource et les filtres
interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  type: string;
  url: string;
}

interface FilterOptions {
  categories: string[];
  types: string[];
}

// Données de simulation pour les options de filtre (à remplacer par des données réelles si disponibles)
const MOCK_FILTER_OPTIONS: FilterOptions = {
  categories: ['Bilan de Compétences', 'Orientation', 'Recherche d\'Emploi', 'Développement Personnel'],
  types: ['Article', 'Vidéo', 'Podcast', 'Document PDF', 'Exercice'],
};

// Composant principal de la page
const ResourcesPage: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les filtres
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Chargement des données
  useEffect(() => {
    if (!isAuthLoading && user) {
      const fetchResources = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Simuler le chargement des données depuis resourcesModule
          // En réalité, on ferait un appel comme:
          // const data = await resourcesModule.fetchResources(user.id);
          
          // Données de simulation
          const mockData: Resource[] = [
            { id: 1, title: 'Guide du Bilan de Compétences', description: 'Tout savoir sur le processus de bilan.', category: 'Bilan de Compétences', type: 'Document PDF', url: '#' },
            { id: 2, title: '5 étapes pour trouver sa voie', description: 'Méthode simple pour l\'orientation.', category: 'Orientation', type: 'Vidéo', url: '#' },
            { id: 3, title: 'Optimiser son CV', description: 'Conseils pour un CV percutant.', category: 'Recherche d\'Emploi', type: 'Article', url: '#' },
            { id: 4, title: 'La force de l\'habitude', description: 'Développer de bonnes habitudes.', category: 'Développement Personnel', type: 'Podcast', url: '#' },
            { id: 5, title: 'Exercice d\'introspection', description: 'Questionnaire pour mieux se connaître.', category: 'Bilan de Compétences', type: 'Exercice', url: '#' },
            { id: 6, title: 'Le marché caché de l\'emploi', description: 'Comment trouver des offres non publiées.', category: 'Recherche d\'Emploi', type: 'Article', url: '#' },
          ];
          setResources(mockData);
        } catch (err) {
          setError('Erreur lors du chargement des ressources.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchResources();
    } else if (!isAuthLoading && !user) {
      // Gérer la redirection ou l'affichage si l'utilisateur n'est pas connecté
      setError('Vous devez être connecté pour accéder à cette page.');
      setIsLoading(false);
    }
  }, [user, isAuthLoading]);

  // Logique de filtrage
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const categoryMatch = selectedCategory === 'all' || resource.category === selectedCategory;
      const typeMatch = selectedType === 'all' || resource.type === selectedType;
      const searchMatch = searchTerm === '' || 
                          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return categoryMatch && typeMatch && searchMatch;
    });
  }, [resources, selectedCategory, selectedType, searchTerm]);

  // Gestionnaires de changement pour les selects (respect des contraintes)
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="text-xl font-semibold">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <div className="text-xl font-semibold">Erreur: {error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-red-600">
        <div className="text-xl font-semibold">Accès refusé. Veuillez vous connecter.</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Bibliothèque de Ressources Pédagogiques</h1>
        <p className="text-gray-600 mt-2">Accédez à des articles, vidéos et exercices pour enrichir votre bilan de compétences.</p>
      </div>

      {/* Section des Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row gap-4">
        
        {/* Recherche par mot-clé */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Rechercher par mot-clé</label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Titre ou description..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Filtre par Catégorie */}
        <div className="w-full md:w-1/4">
          <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Toutes les catégories</option>
            {MOCK_FILTER_OPTIONS.categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Filtre par Type */}
        <div className="w-full md:w-1/4">
          <label htmlFor="type-select" className="block text-sm font-medium text-gray-700 mb-1">Type de ressource</label>
          <select
            id="type-select"
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Tous les types</option>
            {MOCK_FILTER_OPTIONS.types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Affichage des Résultats */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {filteredResources.length} Ressource{filteredResources.length > 1 ? 's' : ''} trouvée{filteredResources.length > 1 ? 's' : ''}
        </h2>

        {filteredResources.length === 0 ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
            <p className="font-bold">Aucune ressource trouvée</p>
            <p>Veuillez ajuster vos critères de recherche ou de filtrage.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <div key={resource.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border border-gray-200">
                <div className="text-sm font-medium text-indigo-600 mb-1">{resource.category}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{resource.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold inline-block py-1 px-3 uppercase rounded-full text-teal-600 bg-teal-100">
                    {resource.type}
                  </span>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-indigo-600 hover:text-indigo-800 font-semibold transition duration-150"
                  >
                    Consulter &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
