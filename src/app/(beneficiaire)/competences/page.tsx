'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { competencesModule } from '@/lib/supabase/modules';
import CompetenceCard from '@/components/competences/CompetenceCard';
import { Competence } from '@/types/database.types';

export default function CompetencesPage() {
  const { user } = useAuth();
  const [competences, setCompetences] = useState<Competence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCompetences();
    }
  }, [user]);

  const loadCompetences = async () => {
    try {
      if (!user) return;
      const data = await competencesModule.getCompetencesByUser(user.id);
      setCompetences(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mes Compétences</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          ➕ Ajouter une compétence
        </button>
      </div>

      {competences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competences.map((competence) => (
            <CompetenceCard key={competence.id} competence={competence} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">Aucune compétence enregistrée</p>
        </div>
      )}
    </div>
  );
}
