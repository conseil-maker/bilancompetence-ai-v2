'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { bilansModule } from '@/lib/supabase/modules';
import { Bilan } from '@/types/database.types';
import BilanStatusBadge from '@/components/bilans/BilanStatusBadge';

export default function BilanDetailPage() {
  const params = useParams();
  const bilanId = params.id as string;
  const [bilan, setBilan] = useState<Bilan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bilanId) {
      loadBilan();
    }
  }, [bilanId]);

  const loadBilan = async () => {
    try {
      const data = await bilansModule.getBilan(bilanId);
      setBilan(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (!bilan) {
    return <div className="p-8 text-center">Bilan non trouvé</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{bilan.titre}</h1>
            <p className="text-gray-600 mt-2">{bilan.description}</p>
          </div>
          <BilanStatusBadge status={bilan.status} size="lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Date de début</p>
            <p className="text-lg font-semibold">
              {bilan.date_debut ? new Date(bilan.date_debut).toLocaleDateString('fr-FR') : '-'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Progression</p>
            <p className="text-lg font-semibold">{calculateProgress(bilan)}%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Engagement</p>
            <p className="text-lg font-semibold">{bilan.engagement_score || 0}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-4">
            <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium">
              Informations
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
              Compétences
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
              Pistes métiers
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
              Plan d'action
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
              Documents
            </button>
          </nav>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Informations du bilan</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Bénéficiaire</p>
              <p className="font-medium">{bilan.beneficiaire_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Consultant</p>
              <p className="font-medium">{bilan.consultant_id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateProgress(bilan: Bilan): number {
  let progress = 0;
  if (bilan.preliminaire_completed_at) progress += 33;
  if (bilan.investigation_completed_at) progress += 33;
  if (bilan.conclusion_completed_at) progress += 34;
  return Math.round(progress);
}
