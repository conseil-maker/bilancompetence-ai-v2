'use client';

import { useEffect, useState } from 'react';
import { bilans } from '@/lib/supabase/modules';
import BilanCard from '@/components/bilans/BilanCard';
import { Bilan } from '@/types/database.types';

export default function TousBilansPage() {
  const [bilans, setBilans] = useState<Bilan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadBilans();
  }, []);

  const loadBilans = async () => {
    try {
      const data = await bilans.getAllBilans();
      setBilans(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBilans = filter === 'all' 
    ? bilans 
    : bilans.filter(b => b.status === filter);

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tous les Bilans</h1>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">Tous</option>
            <option value="en_attente">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminés</option>
            <option value="abandonne">Abandonnés</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBilans.map((bilan) => (
          <BilanCard key={bilan.id} bilan={bilan} role="admin" />
        ))}
      </div>

      {filteredBilans.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">Aucun bilan trouvé</p>
        </div>
      )}
    </div>
  );
}
